import { projectEnglish } from "@/lib/english-content";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, asset, sourceSite } from "@/lib/content";
import { getSourcePage } from "@/lib/source";
import { languagePair } from "@/lib/routes";
import { ResponsiveImage } from "./responsive-image";
import { SourceContent } from "./source-content";
import { CaseReader } from "./case-reader";
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
  const chapters = en
    ? ["Context", "Interpretation", "Spatial experience", "Implementation"]
    : ["文化背景", "内容转化", "空间体验", "项目实施"];
  return (
    <div className={"case-film climate-" + p.kind}>
      <section
        className="case-film-hero"
        data-nav-tone="dark"
        data-scene={en ? projectNames[slug] : p.title}
      >
        <ResponsiveImage
          name={p.kind}
          alt={p.imageAlt}
          priority
          sizes="100vw"
          className="scene-media"
        />
        <div className="scene-shade" />
        <div className="container case-film-heading">
          <Link className="scene-link" href={en ? "/en/cases/" : "/cases/"}>
            {en ? "All work" : "全部案例"}
            <ArrowUpRight size={16} />
          </Link>
          <h1>{en ? projectNames[slug] : p.title}</h1>
          <p>{en ? projectEnglish[slug].description : p.description}</p>
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
        <div>
          <span>{en ? "MGC role" : "美创职责"}</span>
          <strong>{en ? projectEnglish[slug].role : p.service}</strong>
        </div>
        <div>
          <span>{en ? "Type / Year" : "类型 / 年份"}</span>
          <strong>
            {en ? "Cultural exhibition" : p.type} /{" "}
            {p.year || (en ? "Not published" : "未公开")}
          </strong>
        </div>
        <div>
          <span>{en ? "Source" : "项目资料"}</span>
          <a href={sourceSite + p.source} target="_blank" rel="noreferrer">
            {en ? "Original project" : "查看原始资料"}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <nav
        className="container case-story-nav"
        aria-label={en ? "Story chapters" : "项目章节"}
      >
        {p.sections.map((s, i) => (
          <a key={i} href={i === 0 ? "#case-context" : "#case-chapter-" + i}>
            {en ? projectEnglish[slug].sections[i].title : s.title}
          </a>
        ))}
      </nav>
      {p.sections.map((s, i) => (
        <section
          className="case-chapter"
          id={i === 0 ? "case-context" : "case-chapter-" + i}
          key={i}
        >
          <div className="container case-chapter-copy" data-reveal>
            <span>{chapters[i]}</span>
            <h2>{en ? projectEnglish[slug].sections[i].title : s.title}</h2>
            <p>{en ? projectEnglish[slug].sections[i].text : s.text}</p>
          </div>
          {slug === "liye-qin-slips" && i === 2 ? (
            <CaseReader english={en} />
          ) : slug === "liye-qin-slips" && i === 0 ? (
            <div className="case-archive-media">
              <ResponsiveImage
                name="liye-details"
                alt={
                  en
                    ? "Liye manuscript interpretation"
                    : "里耶秦简文字释读与重点标注"
                }
                sizes="100vw"
              />
            </div>
          ) : i === 1 && p.gallery.length ? (
            <figure className="case-full-media">
              <img
                src={asset(p.gallery[p.gallery.length - 1].image)}
                alt={p.gallery[p.gallery.length - 1].alt}
                width={1440}
                height={900}
                loading="lazy"
              />
              <figcaption className="container">
                {p.gallery[p.gallery.length - 1].alt}
              </figcaption>
            </figure>
          ) : null}
        </section>
      ))}
      <section className="container case-film-result">
        <h2>
          {en ? "From interpretation to experience." : "让文化，进入真实体验。"}
        </h2>
        <p>
          {en
            ? "The original archive preserves the published project materials and images."
            : "项目的真实资料与完整图集继续保留。更多研究、设计与实施细节，可在原始项目档案中阅读。"}
        </p>
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
                  page={getSourcePage(
                    (en ? "/en" : "") + "/cases/brochure-2026-gaomiao-museum",
                  )!}
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
        <div className="container case-next-copy">
          <span>{en ? "Next project" : "下一个项目"}</span>
          <h2>
            {en ? projectNames[next.slug] : next.title}
            <ArrowUpRight size={27} />
          </h2>
        </div>
      </Link>
      <ContactCTA english={en} />
    </div>
  );
}
