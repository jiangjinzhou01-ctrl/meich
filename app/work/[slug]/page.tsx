import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects, siteUrl, sourceSite, asset } from "@/lib/content";
import { ProjectVisual } from "@/components/project-card";
import { PageHero, ContactCTA } from "@/components/ui";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.title,
    description: p?.description,
    alternates: { canonical: `${siteUrl}/work/${slug}/` },
    openGraph: {
      title: p?.title,
      description: p?.description,
      images: p ? [`${siteUrl}${p.image}`] : [],
    },
    twitter: {
      title: p?.title,
      description: p?.description,
      images: p ? [`${siteUrl}${p.image}`] : [],
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
  if (!p) notFound();
  return (
    <>
      <PageHero
        path={`/work/${slug}/`}
        label="精选项目"
        title={p.title}
        description={p.description}
      >
        <Link href="/work/" className="text-link">
          返回项目列表
        </Link>
      </PageHero>
      <div className="container">
        <ProjectVisual project={p} large />
        <div className="case-facts">
          <div>
            <span>业务领域</span>
            <strong>{p.type}</strong>
          </div>
          <div>
            <span>美创服务</span>
            <strong>{p.service}</strong>
          </div>
          <div>
            <span>项目年份</span>
            <strong>{p.year || "未公开"}</strong>
          </div>
          <div>
            <span>项目资料</span>
            <a
              className="text-link"
              href={`${sourceSite}${p.source}`}
              target="_blank"
              rel="noreferrer"
            >
              查看官方来源 ↗
            </a>
          </div>
        </div>
        <div className="case-story">
          <aside>
            <span>文化，进入体验。</span>
            <p>
              内容与图片选自美创官网公开项目资料。项目范围与状态对应原文发布时点。
            </p>
          </aside>
          <div>
            {p.sections.map((s) => (
              <section key={s.title} data-reveal="line">
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </section>
            ))}
          </div>
        </div>
        {!!p.gallery.length && (
          <div className="case-gallery">
            {p.gallery.map((g) => (
              <figure key={g.image} data-reveal="scale">
                <Image
                  src={asset(g.image)}
                  alt={g.alt}
                  width={1440}
                  height={900}
                  sizes="(max-width: 600px) 90vw, 45vw"
                  loading="lazy"
                />
                <figcaption>{g.alt}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
      <ContactCTA />
    </>
  );
}
