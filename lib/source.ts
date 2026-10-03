import fs from "node:fs";
import path from "node:path";
import { asset, sourceSite } from "./content";
export type SourceBlock = {
  type: string;
  text?: string;
  id?: string;
  src?: string;
  alt?: string;
  href?: string;
  items?: string[];
  poster?: string;
  title?: string;
  rows?: string[][];
};
export type SourcePage = {
  path: string;
  title: string;
  description: string;
  blocks: SourceBlock[];
  cards: { path: string; title: string; text: string; image: string }[];
  forms: {
    action: string | null;
    method: string | null;
    fields: {
      tag: string;
      name: string;
      type: string;
      label: string;
      options: { value: string; label: string }[];
    }[];
  }[];
  source: string;
  lang: string;
  error?: string;
  anchors?: string[];
};
export type CatalogItem = {
  path: string;
  title: string;
  description: string;
  image: string;
  domain: string;
  tags: Record<string, string[]>;
  labels: string[];
  format: string;
  venue: string;
};
export type CatalogFilter = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};
// Server-only snapshot: full source content never enters the client catalog bundle.
export const sourcePages: SourcePage[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "lib/source-pages.json"), "utf8"),
);
sourcePages.forEach((p) => {
  if (!p.description)
    p.description =
      p.blocks
        .find((b) => b.type === "p" && (b.text?.length || 0) > 25)
        ?.text?.slice(0, 180) || p.title;
});
const lookup = new Map(
  sourcePages.filter((p) => !p.error).map((p) => [p.path, p]),
);
export function getSourcePage(key: string) {
  return lookup.get(key.replace(/\/$/, "") || "/");
}
export function sourceLink(href: string): string {
  if (href.startsWith("#")) return href;
  try {
    const u = new URL(href, sourceSite);
    if (u.origin === sourceSite) {
      const local = u.pathname.replace(/\/$/, "") || "/";
      if (
        !lookup.has(local) &&
        local !== "/admin" &&
        !local.startsWith("/brand/") &&
        !local.startsWith("/api/")
      )
        return href;
      if (u.pathname.startsWith("/brand/") || u.pathname.startsWith("/api/"))
        return href;
      if (
        u.pathname === "/contact" &&
        u.searchParams.get("interest") === "research"
      )
        return href;
      return `${u.pathname.replace(/\/$/, "")}/` + u.search + u.hash;
    }
    return href;
  } catch {
    return href;
  }
}
let imageMap: Record<string, string> | undefined;
export function sourceImage(src: string) {
  try {
    imageMap ||= JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "lib/source-image-map.json"),
        "utf8",
      ),
    );
    return imageMap?.[src] ? asset(imageMap[src]) : src;
  } catch {
    return src;
  }
}
export function catalogFor(prefix: string): CatalogItem[] {
  if (prefix === "/en/videos") return catalogFor("/videos");
  const index = getSourcePage(prefix);
  const metadata = getCatalogMetadata();
  return sourcePages
    .filter(
      (p) =>
        !p.error &&
        p.path.startsWith(`${prefix}/`) &&
        (!p.path.slice(prefix.length + 1).includes("/") ||
          prefix.endsWith("/research")),
    )
    .map((p) => {
      const card = index?.cards.find((c) => c.path === p.path);
      const meta = metadata[p.path] || {};
      const image =
        card?.image || p.blocks.find((b) => b.type === "image")?.src || "";
      return {
        path: p.path,
        title: p.title,
        description:
          p.description || card?.text?.replace(p.title, "").slice(0, 140) || "",
        image: sourceImage(image),
        domain:
          meta.domain ||
          p.blocks
            .find((b) => b.type === "p")
            ?.text?.split("·")[0]
            .trim() ||
          "",
        tags: meta.tags || {},
        labels: meta.labels || [],
        format: meta.format || "",
        venue: meta.venue || "",
      };
    });
}
function getCatalogMetadata(): Record<
  string,
  {
    domain: string;
    tags: Record<string, string[]>;
    labels: string[];
    format: string;
    venue: string;
  }
> {
  try {
    return JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "lib/source-taxonomy.json"),
        "utf8",
      ),
    );
  } catch {
    return {};
  }
}
export function catalogFilters(prefix: string): CatalogFilter[] {
  if (prefix.endsWith("/videos"))
    return [
      {
        name: "scene",
        label: "应用场景",
        options: [
          { value: "", label: "全部场景" },
          { value: "museum", label: "博物馆与展馆" },
          { value: "city", label: "城市与文旅" },
          { value: "education", label: "科普教育" },
          { value: "brand", label: "品牌传播" },
          { value: "screen", label: "特殊屏幕" },
        ],
      },
      {
        name: "format",
        label: "呈现形式",
        options: [
          { value: "", label: "全部形式" },
          ...Array.from(
            new Set(
              catalogFor(prefix)
                .map((i) => i.format)
                .filter(Boolean),
            ),
          ).map((v) => ({ value: v, label: v })),
        ],
      },
    ];
  const index = getSourcePage(prefix);
  const fields = index?.forms.flatMap((f) => f.fields) || [];
  const en = prefix.startsWith("/en/");
  const names: Record<string, string> = en
    ? {
        venue: "Venue",
        scene: "Scene",
        theme: "Theme",
        service: "Service",
        technology: "Technology",
        capability: "Capability",
      }
    : {
        venue: "场馆类型",
        scene: "应用场景",
        theme: "文化主题",
        service: "服务类型",
        technology: "技术方式",
        capability: "产品能力",
        industry: "行业",
        category: "场景",
        type: "呈现形式",
        format: "呈现形式",
      };
  return fields
    .filter((f) => f.tag === "select" && f.options.length > 1)
    .map((f) => ({
      name: f.name,
      label: names[f.name] || f.label || f.name,
      options: f.options.map((o) => ({
        ...o,
        label: o.label.replace(/\s*\(\s*\d+\s*\)\s*$/, ""),
      })),
    }));
}
