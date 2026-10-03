import Link from "next/link";
import { CaseFilm } from "./case-film";
import { SearchJourney } from "./search-journey";
import { searchIndex } from "@/lib/search";
import { canonicalPath } from "@/lib/routes";
import { PageHero, ContactCTA } from "./ui";
import { EnglishHome } from "./english-home";
import { Catalog } from "./catalog";
import { SourceContent, OriginalSubmission } from "./source-content";
import {
  catalogFor,
  catalogFilters,
  sourceImage,
  getSourcePage,
  type SourcePage,
} from "@/lib/source";
const indexes = [
  "/products",
  "/cases",
  "/videos",
  "/experiences",
  "/research",
  "/insights",
];
const names: Record<string, string> = {
  products: "产品目录",
  cases: "案例与作品",
  videos: "美创影像",
  experiences: "体验与探索",
  research: "创新与研发",
  insights: "洞察与动态",
  collaboration: "协作与共创",
};
export function SourcePageView({ page }: { page: SourcePage }) {
  const en = page.lang === "en";
  const path = page.path;
  const prefix = path.replace(/^\/en/, "") || "/";
  if (en && prefix === "/") return <EnglishHome />;
  const featured: Record<string, string> = {
    "/cases/brochure-2026-liye-qin-slips": "liye-qin-slips",
    "/cases/potala-snow-city": "potala-snow-city",
    "/cases/gaomiao": "gaomiao",
  };
  if (en && featured[prefix])
    return <CaseFilm slug={featured[prefix]} english />;
  const family = prefix.split("/")[1];
  const index = indexes.includes(prefix);
  const label = en
    ? `${family.toUpperCase() || "MGC"} · MGC DIGITAL`
    : names[family] || "美创数字";
  const title =
    prefix === "/products"
      ? en
        ? "Products for cultural experiences."
        : "文化体验的产品与系统。"
      : prefix === "/videos"
        ? en
          ? "Stories, in motion."
          : "让文化故事，在影像中发生。"
        : page.title;
  let blocks = page.blocks;
  // Related card sections get their own list instead of duplicated long text links.
  const relatedStart = blocks.findIndex(
    (b) =>
      b.type === "h2" &&
      /继续了解|相关产品|相关案例|RELATED|Related/.test(b.text || ""),
  );
  if (relatedStart >= 0) blocks = blocks.slice(0, relatedStart);
  const hero = blocks.find((b) => b.type === "image");
  if (hero && family !== "experiences")
    blocks = blocks.filter((b) => b !== hero);
  const research = family === "research" && !index;
  return (
    <div lang={page.lang}>
      {page.anchors
        ?.filter(
          (id) =>
            !blocks.some((b) => b.id === id) &&
            id !== "main-content" &&
            id !== "partner-apply" &&
            id !== "participate",
        )
        .map((id) => (
          <span className="source-anchor" id={id} key={id} />
        ))}
      <PageHero
        path={`${path}/`}
        label={label}
        title={title}
        description={page.description || ""}
      >
        {!index && family && (
          <Link className="text-link" href={`${en ? "/en" : ""}/${family}/`}>
            {en ? "Back to all content" : "返回全部内容"} ↗
          </Link>
        )}
      </PageHero>
      {index ? (
        <section
          className="container catalog-section"
          id={
            family === "products"
              ? "product-library"
              : family === "videos"
                ? "library"
                : undefined
          }
        >
          {family === "products" && (
            <nav
              className="catalog-area-links"
              aria-label={en ? "Services" : "四大业务"}
            >
              {[
                ["display", "数字展示", "Digital exhibitions"],
                ["heritage", "数字文博", "Smart museums"],
                ["creative", "数字文创", "Cultural creation"],
                ["operations", "数字运营", "Digital operations"],
              ].map(([id, zh, eng]) => (
                <Link
                  key={id}
                  href={`${en ? "/en" : ""}/products/areas/${id}/`}
                >
                  {en ? eng : zh}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
          )}
          {family === "research" && (
            <details className="research-overview-details">
              <summary>
                {en
                  ? "Research and achievements"
                  : "查看科研平台、知识产权与技术积累"}
              </summary>
              <SourceContent
                page={page}
                blocks={page.blocks.slice(
                  0,
                  page.blocks.findIndex(
                    (b) => b.type === "h2" && b.text?.includes("探索"),
                  ) > 0
                    ? page.blocks.findIndex(
                        (b) => b.type === "h2" && b.text?.includes("探索"),
                      )
                    : 45,
                )}
              />
            </details>
          )}
          {family === "products" ? (
            <SearchJourney
              items={searchIndex(en)}
              english={en}
              initialKind="product"
              filters={catalogFilters(path)}
            />
          ) : (
            <Catalog
              items={catalogFor(path)}
              filters={catalogFilters(path)}
              english={en}
            />
          )}
          {family === "insights" && (
            <SourceContent
              page={page}
              blocks={page.blocks.filter(
                (b) =>
                  b.type === "link" &&
                  !b.href?.startsWith("https://www.mgcdigi.com"),
              )}
            />
          )}
        </section>
      ) : (
        <>
          {hero && family !== "experiences" && (
            <figure className="container source-hero-image">
              <img
                src={sourceImage(hero.src!)}
                alt={hero.alt || page.title}
                width={1440}
                height={850}
                fetchPriority="high"
              />
              <figcaption>{hero.alt}</figcaption>
            </figure>
          )}
          <div className="container source-layout">
            <aside className="source-sidebar">
              <span>{en ? "IN THIS PAGE" : "内容导览"}</span>
              {blocks
                .filter((b) => b.type === "h2" && b.id)
                .slice(0, 12)
                .map((b, i) => (
                  <a key={i} href={`#${b.id}`}>
                    {b.text}
                  </a>
                ))}
            </aside>
            <div>
              <SourceContent
                page={page}
                blocks={blocks}
                excludeIds={
                  prefix === "/collaboration"
                    ? ["partner-apply"]
                    : prefix === "/contact"
                      ? ["cooperate"]
                      : research
                        ? ["participate"]
                        : []
                }
              />
              {(prefix === "/collaboration" ||
                prefix === "/contact" ||
                research) && (
                <OriginalSubmission
                  path={path}
                  english={en}
                  research={research}
                  contact={prefix === "/contact"}
                />
              )}
            </div>
          </div>
        </>
      )}
      {page.cards.length > 0 && !index && (
        <section className="container source-related">
          <h2>{en ? "Keep exploring" : "继续探索"}</h2>
          <div className="catalog-grid">
            {page.cards.slice(0, 3).map((c) => (
              <Link
                className="catalog-card"
                key={c.path}
                href={canonicalPath(c.path)}
              >
                {c.image && (
                  <div className="catalog-image">
                    <img
                      src={sourceImage(c.image)}
                      alt={c.title}
                      width={800}
                      height={520}
                      loading="lazy"
                    />
                  </div>
                )}
                <h3>{c.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
      {en &&
        prefix === "/cases/gaomiao" &&
        getSourcePage("/en/cases/brochure-2026-gaomiao-museum") && (
          <section className="container case-archive">
            <details>
              <summary>
                Complete project material from the published brochure
              </summary>
              <SourceContent
                page={getSourcePage("/en/cases/brochure-2026-gaomiao-museum")!}
                idPrefix="brochure-archive-"
              />
            </details>
          </section>
        )}
      <ContactCTA english={en} />
    </div>
  );
}
