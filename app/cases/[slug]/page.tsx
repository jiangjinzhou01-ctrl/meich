import {CaseFilm} from "@/components/case-film";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSourcePage, sourcePages } from "@/lib/source";
import { SourceContent } from "@/components/source-content";
import { SourcePageView } from "@/components/source-page";
import { StaticRedirect } from "@/components/static-redirect";
import { aliases, canonicalPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { projects, siteUrl, sourceSite, asset } from "@/lib/content";
import { ProjectVisual } from "@/components/project-card";
import { PageHero, ContactCTA } from "@/components/ui";
export function generateStaticParams() {
  return Array.from(
    new Set([
      ...projects.map((p) => p.slug),
      ...sourcePages
        .filter((p) => p.path.startsWith("/cases/"))
        .map((p) => p.path.split("/")[2]),
    ]),
  ).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  const path = canonicalPath(`/cases/${slug}/`);
  const source = getSourcePage(`/cases/${slug}`);
  const title = p?.title || source?.title || "项目案例";
  const description = p?.description || source?.description || title;
  const metadata = pageMetadata(title, description, path);
  const image = p
    ? `${siteUrl}${p.image}`
    : source?.blocks.find((b) => b.type === "image")?.src;
  return {
    ...metadata,
    robots: aliases[`/cases/${slug}`]
      ? { index: false, follow: true }
      : undefined,
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
export default async function Case({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  const legacy = aliases[`/cases/${slug}`];
  if (legacy) return <StaticRedirect to={canonicalPath(legacy)} />;
  if (!p) {
    const source = getSourcePage(`/cases/${slug}`);
    if (!source) notFound();
    return <SourcePageView page={source} />;
  }
  return <CaseFilm slug={slug} />;
}
