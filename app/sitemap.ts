import type { MetadataRoute } from "next";
import { sourcePages } from "@/lib/source";
import { siteUrl, projects, articles } from "@/lib/content";
import { aliases, canonicalPath, languagePair } from "@/lib/routes";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Array.from(
    new Set(
      [
        "/",
        "/services/",
        "/solutions/",
        "/cases/",
        "/culture-ai/",
        "/research/",
        "/en/research/",
        "/about/",
        "/research/technology/",
        "/insights/",
        "/careers/",
        "/contact/",
        "/privacy/",
        "/en/services/",
        "/en/solutions/",
        "/en/cases/",
        "/en/culture-ai/",
        "/en/research/technology/",
        ...projects.map((p) => `/cases/${p.slug}/`),
        ...articles.map((a) => `/insights/${a.slug}/`),
        ...sourcePages
          .filter((p) => !p.error && !aliases[p.path])
          .map((p) => `${p.path}/`),
      ].map(canonicalPath),
    ),
  );
  const set = new Set(routes);
  return routes.map((route) => {
    const pair = languagePair(route);
    const paired = set.has(pair.zh) && set.has(pair.en);
    return {
      url: `${siteUrl.replace(/\/$/, "")}${route}`,
      changeFrequency: route === "/" ? "monthly" : "yearly",
      priority: route === "/" ? 1 : route.split("/").length <= 3 ? 0.8 : 0.6,
      alternates: paired
        ? {
            languages: {
              "zh-CN": `${siteUrl}${pair.zh}`,
              en: `${siteUrl}${pair.en}`,
            },
          }
        : undefined,
    };
  });
}
