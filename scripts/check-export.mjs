import { readFile, readdir, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
// Use the generated asset prefix when checking an already-built ZIP.
const exportedHome = await readFile(path.join(root, "index.html"), "utf8");
const detectedBase = exportedHome.match(/\bsrc="([^"]*?)\/_next\//)?.[1] || "";
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? detectedBase).replace(
  /\/$/,
  "",
);
const failures = [];
let pages = 0;
async function exists(p) {
  try {
    return (await stat(p)).isFile();
  } catch {
    return false;
  }
}
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await check(file);
      continue;
    }
    if (!entry.name.endsWith(".html") || entry.name === "404.html") continue;
    pages++;
    const html = await readFile(file, "utf8");
    for (const match of html.matchAll(
      /<(?:a|img)\b[^>]*\b(?:href|src)="([^"]+)"/g,
    )) {
      let url;
      try {
        url = new URL(
          match[1].replaceAll("&amp;", "&"),
          "http://export.local/" + path.relative(root, file),
        );
      } catch {
        continue;
      }
      if (url.origin !== "http://export.local") continue;
      let p = decodeURIComponent(url.pathname);
      if (base && p.startsWith(base + "/")) p = p.slice(base.length);
      const target = path.join(root, p);
      if (
        !(await exists(target)) &&
        !(await exists(path.join(target, "index.html")))
      )
        failures.push({ page: path.relative(root, file), target: p });
    }
  }
}
await check(root);
const result = { pages, brokenInternalLinksOrImages: failures };
await mkdir("docs/qa", {recursive:true});
await writeFile("docs/qa/export-links.json", JSON.stringify(result, null, 2));
console.log(
  `${pages} exported pages checked; ${failures.length} broken internal links or images.`,
);
if (failures.length) {
  console.error(failures.slice(0, 10));
  process.exitCode = 1;
}
