import type { Metadata } from "next";
import { siteUrl, company } from "./content";
import { canonicalPath, languagePair } from "./routes";
import { englishRoutes } from "./languages";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = canonicalPath(path);
  const pair = languagePair(canonical);
  const en = canonical.startsWith("/en/");
  const paired =
    englishRoutes.has(pair.en) ||
    [
      "/en/services/",
      "/en/solutions/",
      "/en/culture-ai/",
      "/en/research/technology/",
    ].includes(pair.en);
  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}${canonical}`,
      languages: paired
        ? { "zh-CN": `${siteUrl}${pair.zh}`, en: `${siteUrl}${pair.en}` }
        : undefined,
    },
    openGraph: {
      title: `${title} · MGC 美创数字`,
      description,
      type: "website",
      locale: en ? "en_US" : "zh_CN",
      siteName: company,
      url: `${siteUrl}${canonical}`,
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · MGC 美创数字`,
      description,
      images: [`${siteUrl}/og.png`],
    },
  };
}
