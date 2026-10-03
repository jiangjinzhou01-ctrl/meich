import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sourcePages, getSourcePage } from "@/lib/source";
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
  if (!a) {
    const p = getSourcePage(`/insights/${slug}`);
    return {
      title: p?.title,
      description: p?.description,
      alternates: { canonical: `${siteUrl}/insights/${slug}/` },
      openGraph: {
        title: p?.title,
        description: p?.description,
        images: p?.blocks.find((b) => b.type === "image")?.src
          ? [p.blocks.find((b) => b.type === "image")!.src!]
          : [],
      },
    };
  }
  return {
    title: a?.title,
    description: a?.description,
    alternates: { canonical: `${siteUrl}/insights/${slug}/` },
    openGraph: {
      title: a?.title,
      description: a?.description,
      images: a?.image ? [`${siteUrl}${a.image}`] : [`${siteUrl}/og.png`],
    },
    twitter: {
      title: a?.title,
      description: a?.description,
      images: a?.image ? [`${siteUrl}${a.image}`] : [`${siteUrl}/og.png`],
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
        <Link href="/insights/" className="text-link">
          返回全部洞察
        </Link>
      </article>
      <ContactCTA />
    </>
  );
}
