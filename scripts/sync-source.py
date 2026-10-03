#!/usr/bin/env python3
"""Refresh public MGC content for the static website. No admin/login APIs are used."""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import time
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import parse_qs, urljoin, urlsplit
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.mgcdigi.com"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--cache-dir", help="Use already fetched HTML for local content normalization")
args = parser.parse_args()

def download(url):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "MGC website content migration/1.0"})
            with urllib.request.urlopen(request, timeout=40) as response:
                return response.read().decode("utf-8")
        except Exception:
            if attempt == 2:
                raise
            time.sleep(0.5 * (attempt + 1))

if args.cache_dir:
    sitemap = (ROOT / "lib/source-pages.json").read_text()
    urls = [p["source"] for p in json.loads(sitemap)]
else:
    document = ET.fromstring(download(f"{ORIGIN}/sitemap.xml"))
    urls = sorted({e.text.split("#")[0].rstrip("/") for e in document.iter() if e.tag.endswith("}loc")})

def extract(url):
    key = urlsplit(url).path or "/"
    if args.cache_dir:
        file = Path(args.cache_dir) / (hashlib.sha256(key.encode()).hexdigest()[:16] + ".html")
        html = file.read_text()
    else:
        html = download(url)
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    if not main:
        raise ValueError(f"Missing public main content: {key}")
    h1 = main.find("h1")
    title = h1.get_text(" ", strip=True) if h1 else soup.title.get_text(" ", strip=True)
    meta = soup.find("meta", attrs={"name": "description"})
    blocks, seen = [], set()
    for element in main.find_all(["h2", "h3", "h4", "p", "img", "ul", "ol", "dl", "video", "iframe", "a", "details", "table"]):
        if element.find_parent(["ul", "ol", "dl", "table", "details"]):
            continue
        tag = element.name
        text = element.get_text(" ", strip=True)
        if tag in ["h2", "h3", "h4", "p"]:
            if not text or (tag, text) in seen:
                continue
            seen.add((tag, text))
            block = {"type": "h3" if tag == "h4" else tag, "text": text}
            if tag != "p":
                parent = element
                while parent and parent is not main and not parent.get("id"):
                    parent = parent.parent
                if parent and parent is not main:
                    block["id"] = parent.get("id")
            blocks.append(block)
        elif tag == "img":
            source = element.get("src")
            if source and (tag, source) not in seen:
                seen.add((tag, source))
                blocks.append({"type": "image", "src": urljoin(url, source), "alt": element.get("alt") or title})
        elif tag in ["ul", "ol"]:
            items = [li.get_text(" ", strip=True) for li in element.find_all("li", recursive=False)]
            if items:
                blocks.append({"type": tag, "items": items})
        elif tag == "dl":
            items = [dt.get_text(" ", strip=True) + ": " + " / ".join(dd.get_text(" ", strip=True) for dd in dt.find_next_siblings("dd")) for dt in element.find_all("dt")]
            if items:
                blocks.append({"type": "facts", "items": items})
        elif tag == "video":
            source = element.get("src") or (element.find("source").get("src") if element.find("source") else "")
            if source:
                blocks.append({"type": "video", "src": urljoin(url, source), "poster": urljoin(url, element["poster"]) if element.get("poster") else ""})
        elif tag == "iframe" and element.get("src"):
            blocks.append({"type": "embed", "src": urljoin(url, element["src"]), "title": element.get("title") or title})
        elif tag == "a" and element.get("href") and text and not element.find_parent("nav"):
            href = urljoin(url, element["href"])
            if ("link", href, text) not in seen:
                seen.add(("link", href, text))
                blocks.append({"type": "link", "href": href, "text": text})
        elif tag == "details":
            summary = element.find("summary")
            heading = summary.get_text(" ", strip=True) if summary else "Details"
            blocks.append({"type": "details", "title": heading, "text": text[len(heading):]})
        elif tag == "table":
            blocks.append({"type": "table", "rows": [[cell.get_text(" ", strip=True) for cell in row.find_all(["th", "td"])] for row in element.find_all("tr")]})
    cards = {}
    for anchor in main.select("a[href]"):
        heading, image = anchor.find(["h2", "h3"]), anchor.find("img")
        href = urljoin(url, anchor["href"])
        if heading and urlsplit(href).netloc == urlsplit(url).netloc:
            target = urlsplit(href).path
            cards[target] = {"path": target, "title": heading.get_text(" ", strip=True), "text": anchor.get_text(" ", strip=True), "image": urljoin(url, image["src"]) if image and image.get("src") else ""}
    forms = []
    for form in main.find_all("form"):
        fields = [{"tag": field.name, "name": field.get("name"), "type": field.get("type"), "label": field.get("aria-label"), "options": [{"value": o.get("value"), "label": o.get_text(" ", strip=True)} for o in field.find_all("option")]} for field in form.find_all(["input", "select", "textarea"])]
        forms.append({"action": form.get("action"), "method": form.get("method"), "fields": fields})
    tags, labels = {}, []
    for anchor in main.select(".label-chips a[href]"):
        for name, values in parse_qs(urlsplit(anchor["href"]).query).items():
            tags.setdefault(name, []).extend(values)
        labels.append(anchor.get_text(" ", strip=True))
    eyebrow = (main.find("header") or main).select_one(".eyebrow")
    domain = eyebrow.get_text(" ", strip=True).split("·")[0].strip() if eyebrow else ""
    video_format = ""
    if key.startswith("/videos/"):
        for anchor in main.select("a[href]"):
            query = parse_qs(urlsplit(anchor["href"]).query)
            if query.get("scene"):
                tags["scene"] = query["scene"]
                break
        film_meta = main.select_one(".film-meta")
        text = film_meta.get_text(" ", strip=True) if film_meta else ""
        video_format = text.split("·")[-1].strip() if "·" in text else ""
        if video_format:
            tags["format"] = [video_format]
        domain = "美创影视"
    page = {"path": key, "title": title, "description": meta.get("content", "") if meta else "", "blocks": blocks, "cards": list(cards.values()), "forms": forms, "source": url, "lang": "en" if key.startswith("/en") else "zh-CN", "anchors": [e["id"] for e in main.select("[id]")]}
    taxonomy = {"domain": domain, "tags": tags, "labels": labels, "format": video_format, "venue": ""}
    return page, taxonomy

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(extract, urls))
pages = sorted([p for p, _ in results], key=lambda p: p["path"])
taxonomy = {p["path"]: t for p, t in results}
# Write only after every public route has been read successfully.
for filename, data in [("source-pages.json", pages), ("source-taxonomy.json", taxonomy)]:
    (ROOT / "lib" / filename).write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
english = [p["path"] + "/" for p in pages if p["lang"] == "en"]
(ROOT / "lib/languages.ts").write_text("export const englishRoutes = new Set(" + json.dumps(english, separators=(",", ":")) + ");\n")
print(f"Updated {len(pages)} public routes from {ORIGIN}.")
