import type { Metadata } from "next";
import { siteUrl, company } from "./content";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: `${title} · 美创数字`,
      description,
      type: "website",
      locale: "zh_CN",
      siteName: company,
      url: `${siteUrl}${path}`,
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · 美创数字`,
      description,
      images: [`${siteUrl}/og.png`],
    },
  };
}
