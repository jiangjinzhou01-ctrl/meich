import { aliases, canonicalPath } from "@/lib/routes";
import { pageMetadata } from "@/lib/metadata";
import { StaticRedirect } from "@/components/static-redirect";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sourcePages, getSourcePage } from "@/lib/source";
import { SourceContent } from "@/components/source-content";
import { SourcePageView } from "@/components/source-page";
import { articles, siteUrl, sourceSite, asset } from "@/lib/content";
import { PageHero, ContactCTA } from "@/components/ui";
export function generateStaticParams() {
  return [
    ...articles.map((a) => ({ slug: a.slug })),
    ...sourcePages
      .filter((p) => p.path.startsWith("/insights/"))
      .map((p) => ({ slug: p.path.split("/")[2] })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  const p = getSourcePage(`/insights/${slug}`);
  const title = a?.title || p?.title || "洞察与动态";
  const description = a?.description || p?.description || title;
  const metadata = pageMetadata(title, description, `/insights/${slug}/`);
  const image = a?.image
    ? `${siteUrl}${a.image}`
    : p?.blocks.find((b) => b.type === "image")?.src;
  return {
    ...metadata,
    robots: aliases[`/insights/${slug}`]
      ? { index: false, follow: true }
      : undefined,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      images: image ? [image] : [`${siteUrl}/og.png`],
    },
    twitter: {
      ...metadata.twitter,
      images: image ? [image] : [`${siteUrl}/og.png`],
    },
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((a) => a.slug === slug);
  if (aliases[`/insights/${slug}`])
    return <StaticRedirect to={canonicalPath(`/insights/${slug}/`)} />;
  if (!a) {
    const p = getSourcePage(`/insights/${slug}`);
    if (!p) notFound();
    return <SourcePageView page={p} />;
  }
  return (
    <>
      <PageHero
        path={`/insights/${slug}/`}
        label={a.category}
        title={a.title}
        description={a.description}
      />
      <article className="article-body container">
        <div className="article-byline">
          美创数字 / {a.category}
          {a.date ? ` · ${a.date}` : ""}
        </div>
        {a.image && (
          <Image
            className="article-image"
            src={asset(a.image)}
            alt={a.description}
            width={1280}
            height={800}
            sizes="(max-width: 800px) 90vw, 800px"
            priority
          />
        )}
        {a.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {a.source && (
          <p className="article-source">
            <a
              className="text-link"
              href={`${sourceSite}${a.source}`}
              target="_blank"
              rel="noreferrer"
            >
              阅读官网原文 ↗
            </a>
          </p>
        )}
        {a.source && getSourcePage(a.source) && (
          <section className="article-archive case-archive">
            <details>
              <summary>查阅完整原始报道</summary>
              <SourceContent
                page={getSourcePage(a.source)!}
                idPrefix="article-archive-"
              />
            </details>
          </section>
        )}
        <Link href="/insights/" className="text-link">
          返回全部洞察
        </Link>
      </article>
      <ContactCTA />
    </>
  );
}
