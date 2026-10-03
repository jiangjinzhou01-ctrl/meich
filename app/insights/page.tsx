import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero, ContactCTA } from "@/components/ui";
import { Catalog } from "@/components/catalog";
import { catalogFor } from "@/lib/source";
import { articles, asset } from "@/lib/content";
export const metadata: Metadata = pageMetadata(
  "洞察与动态",
  "记录美创的项目动态、文创实践与文化科技观察。",
  "/insights/",
);
export default function Insights() {
  return (
    <>
      <PageHero
        label="洞察与动态"
        title={
          <>
            好问题，
            <br />
            值得多想一步。
          </>
        }
        description="记录文化与科技相遇的现场，分享项目进展、文创实践与体验思考。"
      />
      <section className="container insights-list">
        {articles.map((a, i) => (
          <Link
            href={`/insights/${a.slug}/`}
            key={a.slug}
            className="insight-row"
            data-reveal="line"
          >
            <div className={`insight-symbol symbol-${i}`} aria-hidden="true">
              {a.image ? (
                <Image
                  src={asset(a.image)}
                  alt=""
                  width={360}
                  height={260}
                  sizes="(max-width: 600px) 120px, 180px"
                  loading="lazy"
                />
              ) : (
                <>
                  <i />
                  <i />
                  <i />
                </>
              )}
            </div>
            <div>
              <span>
                {a.category}
                {a.date ? ` · ${a.date}` : ""}
              </span>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
            </div>
            <span className="insight-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </section>
      <section className="container source-related">
        <h2>全部动态与媒体报道</h2>
        <Catalog items={catalogFor("/insights")} />
      </section>
      <ContactCTA />
    </>
  );
}
