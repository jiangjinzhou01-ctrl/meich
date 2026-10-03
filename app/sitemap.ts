import type { MetadataRoute } from "next";
import { sourcePages } from "@/lib/source";
import { siteUrl, projects, articles } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return Array.from(
    new Set([
      "",
      "services/",
      "solutions/",
      "work/",
      "about/",
      "technology/",
      "insights/",
      "careers/",
      "contact/",
      "privacy/",
      ...projects.map((p) => `work/${p.slug}/`),
      ...articles.map((a) => `insights/${a.slug}/`),
      ...sourcePages
        .filter((p) => !p.error && p.path !== "/")
        .map((p) => `${p.path.slice(1).replace(/\/$/, "")}/`),
    ]),
  ).map((p) => ({
    url: `${siteUrl.replace(/\/$/, "")}/${p}`,
    changeFrequency: p === "" ? "monthly" : "yearly",
    priority: p === "" ? 1 : 0.7,
  }));
}
