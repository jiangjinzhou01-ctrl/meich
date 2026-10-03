import { serviceEnglish } from "./english-content";
import { catalogFor, getSourcePage, type CatalogItem, type SourceBlock } from "./source";
import { services } from "./content";
export type SearchKind = "case" | "service" | "research" | "product";
export type SearchEntry = CatalogItem & { kind: SearchKind; keywords: string };
function projectText(blocks: SourceBlock[] = []) {
  const boundary = blocks.findIndex((b) =>
    /^(LET[’']S TALK|PROJECT NOTES|内容导览|继续了解|Continue exploring)$/i.test(
      b.text?.trim() || "",
    ),
  );
  return (boundary < 0 ? blocks : blocks.slice(0, boundary))
    .filter((b) => ["p", "h2", "h3", "ul", "ol"].includes(b.type))
    .map((b) => [b.text, ...(b.items || [])].filter(Boolean).join(" "))
    .join(" ")
    .slice(0, 5000);
}
export function searchIndex(english = false): SearchEntry[] {
  const pre = english ? "/en" : "";
  const entries: SearchEntry[] = [];
  for (const [family, kind] of [
    ["cases", "case"],
    ["products", "product"],
    ["research", "research"],
  ] as const) {
    for (const i of catalogFor(pre + "/" + family)) {
      const p = getSourcePage(i.path);
      entries.push({
        ...i,
        kind,
        keywords: [
          i.title,
          i.description,
          i.domain,
          ...i.labels,
          projectText(p?.blocks),
          ...Object.values(i.tags).flat(),
        ].join(" "),
      });
    }
  }
  services.forEach((s, i) =>
    entries.push({
      path: pre + "/services/#" + s.id,
      title: english
        ? [
            "Digital exhibitions",
            "Digital museums",
            "Cultural creation",
            "Digital operations",
          ][i]
        : s.title,
      description: english ? serviceEnglish[i].description : s.description,
      image: s.image,
      domain: s.title,
      tags: {},
      labels: english ? serviceEnglish[i].items : s.items,
      format: "",
      venue: "",
      kind: "service",
      keywords: [
        s.title,
        s.en,
        serviceEnglish[i].description,
        ...serviceEnglish[i].items,
        s.description,
        ...s.items,
      ].join(" "),
    }),
  );
  return Array.from(new Map(entries.map((e) => [e.path, e])).values());
}
