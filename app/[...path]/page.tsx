import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSourcePage, sourcePages } from "@/lib/source";
import { SourcePageView } from "@/components/source-page";
import { siteUrl } from "@/lib/content";
const reserved = new Set([
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/insights",
  "/services",
  "/solutions",
  "/work",
  "/technology",
  "/careers",
]);
export function generateStaticParams() {
  return sourcePages
    .filter(
      (p) =>
        !p.error && !reserved.has(p.path) && !p.path.startsWith("/insights/"),
    )
    .map((p) => ({ path: p.path.slice(1).split("/") }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const p = getSourcePage("/" + path.join("/"));
  if (!p) return {};
  const image = p.blocks.find((b) => b.type === "image")?.src;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `${siteUrl}${p.path}/` },
    openGraph: {
      title: p.title,
      description: p.description,
      locale: p.lang === "en" ? "en_US" : "zh_CN",
      images: image ? [image] : [`${siteUrl}/og.png`],
    },
    twitter: {
      title: p.title,
      description: p.description,
      images: image ? [image] : [`${siteUrl}/og.png`],
    },
  };
}
export default async function PublicPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const p = getSourcePage("/" + path.join("/"));
  if (!p) notFound();
  return <SourcePageView page={p} />;
}
