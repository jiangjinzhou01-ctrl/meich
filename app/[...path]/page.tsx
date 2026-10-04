import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSourcePage, sourcePages } from "@/lib/source";
import { SourcePageView } from "@/components/source-page";
import { aliases, canonicalPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/metadata";
import { StaticRedirect } from "@/components/static-redirect";
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
  "/cases",
  "/culture-ai",
  "/research",
  "/admin",
  "/admin/content",
  "/en/research",
  "/research/technology",
  "/en/cases",
  "/en/services",
  "/en/solutions",
  "/en/culture-ai",
  "/en/research/technology",
]);
export function generateStaticParams() {
  return sourcePages
    .filter(
      (p) =>
        !p.error &&
        !reserved.has(p.path) &&
        !p.path.startsWith("/insights/") &&
        !p.path.startsWith("/cases/"),
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
  const metadata = pageMetadata(p.title, p.description, p.path);
  return {
    ...metadata,
    robots: aliases[p.path] ? { index: false, follow: true } : undefined,
    openGraph: {
      ...metadata.openGraph,
      images: image ? [image] : [`${siteUrl}/og.png`],
    },
    twitter: {
      ...metadata.twitter,
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
  if (aliases[p.path]) return <StaticRedirect to={canonicalPath(p.path)} />;
  return <SourcePageView page={p} />;
}
