import { serviceEnglish } from "./english-content";
import { catalogFor, getSourcePage, type CatalogItem } from "./source";
import { services } from "./content";
export type SearchKind = "case" | "service" | "research" | "product";
export type SearchEntry = CatalogItem & { kind: SearchKind; keywords: string };
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
          p?.blocks
            .filter((b) => ["p", "h2", "h3"].includes(b.type))
            .map((b) => b.text)
            .join(" ")
            .slice(0, 2200),
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
