import { projectEnglish } from "@/lib/english-content";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, asset, sourceSite } from "@/lib/content";
import { getSourcePage } from "@/lib/source";
import { languagePair } from "@/lib/routes";
import { ResponsiveImage } from "./responsive-image";
import { SourceContent } from "./source-content";
import { CaseReader } from "./case-reader";
import { CaseNavigation } from "./case-navigation";
import { ProjectStudy } from "./project-study";
import { projectNames } from "./project-card";
import { ContactCTA } from "./ui";
export function CaseFilm({
  slug,
  english: en = false,
}: {
  slug: string;
  english?: boolean;
}) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) return null;
  const p = projects[index],
    next = projects[(index + 1) % projects.length];
  const source = getSourcePage(
    en ? languagePair("/cases/" + slug + "/").en : p.source,
  );
  const chapters =
    slug === "liye-qin-slips"
      ? en
        ? [
            "Cultural context",
            "Viewing challenge",
            "Interpretation",
            "Delivery",
          ]
        : ["文化背景", "观看的挑战", "释读与设计", "空间与交付"]
      : slug === "potala-snow-city"
        ? en
          ? [
              "Context & role",
              "Conservation",
              "Visitor narrative",
              "Implementation",
            ]
          : ["背景与职责", "保护与设计", "参观叙事", "实施与边界"]
        : en
          ? ["Cultural context", "Digital expression", "Delivery scope"]
          : ["文化背景", "数字表达", "交付边界"];
  return (
    <div className={"case-film climate-" + p.kind}>
      <section
        className="case-film-hero"
        data-nav-tone="dark"
        data-scene={en ? projectNames[slug] : p.title}
      >
        <ResponsiveImage
          name={p.kind}
          alt={
            en
              ? slug === "potala-snow-city"
                ? "Potala Palace exterior, published project context photograph"
                : projectNames[slug] + ", actual project photography"
              : slug === "potala-snow-city"
                ? "布达拉宫建筑外景，公开项目资料配图"
                : p.imageAlt
          }
          priority
          sizes="100vw"
          className="scene-media"
          cover
        />
        <div className="scene-shade" />
        <div className="container case-film-heading" data-reveal-group>
          <Link
            className="scene-link"
            href={en ? "/en/cases/" : "/cases/"}
            data-reveal="content"
            data-motion-enter
          >
            {en ? "All work" : "全部案例"}
            <ArrowUpRight size={16} />
          </Link>
          <h1
            data-reveal="cinematic"
            data-motion-enter
            style={{ "--motion-delay": "90ms" } as React.CSSProperties}
          >
            {en ? projectNames[slug] : p.title}
          </h1>
          <p
            data-reveal="content"
            data-motion-enter
            style={{ "--motion-delay": "180ms" } as React.CSSProperties}
          >
            {en ? projectEnglish[slug].description : p.description}
          </p>
          <a className="scene-link" href="#case-context">
            {en ? "Read the story" : "进入项目叙事"}
            <ArrowUpRight size={19} />
          </a>
        </div>
      </section>
      <div
        className="container case-film-facts"
        data-scene={en ? "Project story" : "项目叙事"}
      >
        <div data-reveal="content">
          <span>{en ? "MGC role" : "美创职责"}</span>
          <strong>{en ? projectEnglish[slug].role : p.service}</strong>
        </div>
        <div data-reveal="content">
          <span>{en ? "Type / Year" : "类型 / 年份"}</span>
          <strong>
            {en ? "Cultural exhibition" : p.type} /{" "}
            {p.year || (en ? "Not published" : "未公开")}
          </strong>
        </div>
        <div data-reveal="content">
          <span>{en ? "Source" : "项目资料"}</span>
          <a href={sourceSite + p.source} target="_blank" rel="noreferrer">
            {en ? "Original project" : "查看原始资料"}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <CaseNavigation key={slug} chapters={chapters} english={en} />
      {p.sections.map((s, i) => (
        <section
          className="case-chapter"
          id={i === 0 ? "case-context" : "case-chapter-" + i}
          key={i}
        >
          <div className="container case-chapter-copy" data-reveal-group>
            <span data-reveal="content" data-reveal-order="0">
              {chapters[i]}
            </span>
            <h2 data-reveal="editorial">
              {en ? projectEnglish[slug].sections[i].title : s.title}
            </h2>
            <p data-reveal="content">
              {en ? projectEnglish[slug].sections[i].text : s.text}
            </p>
          </div>
          {i === 0 && (
            <ProjectStudy
              kind={p.kind as "liye" | "potala" | "gaomiao"}
              english={en}
            />
          )}
          {slug === "liye-qin-slips" && i === 3 && <CaseReader english={en} />}
          {slug === "gaomiao" && i === 1 && (
            <div className="container case-field-records">
              <div className="case-field-record-heading">
                <h3>
                  {en ? "Further into the exhibition." : "沿着动线，走进展厅。"}
                </h3>
                <p>
                  {en
                    ? "Four original plates from the published project archive. These small records retain their available resolution."
                    : "四幅公开项目图版，补充入口之外的空间记录。保留现有资料的原始清晰度。"}
                </p>
              </div>
              {[2, 3, 4, 5].map((n, j) => (
                <figure key={n}>
                  <img
                    src={asset(`/brand/gaomiao-gallery-0${n}.webp`)}
                    width={n === 2 || n === 3 ? 673 : 671}
                    height={504}
                    alt={
                      en
                        ? [
                            "Gaomiao exhibition circulation and wall displays",
                            "Gaomiao central display cases",
                            "Gaomiao earthen-texture exhibition setting",
                            "Gaomiao display cases and overhead moving-image surface",
                          ][j]
                        : [
                            "高庙展厅动线与墙面展陈",
                            "高庙展厅中央展柜",
                            "高庙夯土质感展陈场景",
                            "高庙展柜与顶部影像界面",
                          ][j]
                    }
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>
                    0{j + 1} /{" "}
                    {en ? "Published project record" : "公开项目资料"}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      ))}
      <section className="container case-film-result" data-reveal-group>
        <h2 data-reveal="editorial">
          {en ? "From interpretation to experience." : "让文化，进入真实体验。"}
        </h2>
        <p data-reveal="content">
          {en
            ? "The original archive preserves the published project materials and images."
            : "项目的真实资料与完整图集继续保留。更多研究、设计与实施细节，可在原始项目档案中阅读。"}
        </p>
        <div className="case-capability-links">
          <Link
            className="text-link"
            href={
              (en ? "/en" : "") +
              "/services/#" +
              (slug === "gaomiao" ? "heritage" : "display")
            }
          >
            {en ? "Related expertise: " : "关联能力："}
            {slug === "gaomiao"
              ? en
                ? "Digital museums"
                : "数字文博"
              : en
                ? "Digital exhibitions"
                : "数字展示"}
            <ArrowUpRight size={18} />
          </Link>
          <Link
            className="text-link"
            href={(en ? "/en" : "") + "/contact/?project=" + slug}
          >
            {en ? "Discuss a similar project" : "沟通类似项目"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        {source && (
          <details>
            <summary>
              {en
                ? "Read the complete project archive"
                : "阅读完整项目资料与图集"}
            </summary>
            <SourceContent page={source} idPrefix="project-archive-" />
            {slug === "gaomiao" &&
              getSourcePage(
                (en ? "/en" : "") + "/cases/brochure-2026-gaomiao-museum",
              ) && (
                <SourceContent
                  page={
                    getSourcePage(
                      (en ? "/en" : "") + "/cases/brochure-2026-gaomiao-museum",
                    )!
                  }
                  idPrefix="brochure-archive-"
                />
              )}
          </details>
        )}
      </section>
      <Link
        className="case-next"
        data-scene={en ? "Next project" : "下一个项目"}
        data-nav-tone="dark"
        href={
          en
            ? languagePair("/cases/" + next.slug + "/").en
            : "/cases/" + next.slug + "/"
        }
      >
        <ResponsiveImage name={next.kind} alt={next.imageAlt} sizes="100vw" />
        <div className="container case-next-copy" data-reveal-group>
          <span data-reveal="content" data-reveal-order="0">
            {en ? "Next project" : "下一个项目"}
          </span>
          <h2 data-reveal="editorial">
            {en ? projectNames[next.slug] : next.title}
            <ArrowUpRight size={27} />
          </h2>
        </div>
      </Link>
      <ContactCTA english={en} />
    </div>
  );
}
