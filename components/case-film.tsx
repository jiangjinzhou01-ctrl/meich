import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { asset, projects, sourceSite } from "@/lib/content";
import { projectEnglish, projectNames } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { getSourcePage } from "@/lib/source";
import { CaseNavigation } from "./case-navigation";
import { CaseReader } from "./case-reader";
import { ImageInspector } from "./image-inspector";
import { ProjectStudy } from "./project-study";
import { ResponsiveImage } from "./responsive-image";
import { SourceContent } from "./source-content";

const chapterNames = {
  liye: [
    ["展览主题", "观看设计", "秦简释读", "影像与现场"],
    ["Exhibition theme", "Display design", "Manuscript interpretation", "Film and space"],
  ],
  potala: [
    ["项目范围", "建筑保护", "参观叙事", "现场实施"],
    ["Project scope", "Conservation", "Visitor narrative", "Implementation"],
  ],
  gaomiao: [
    ["展览空间", "数字互动", "现场制作"],
    ["Exhibition space", "Digital interaction", "Exhibition design"],
  ],
} as const;

const gaomiaoCaptions = [
  ["展厅动线与墙面展陈", "Exhibition circulation and wall displays"],
  ["展厅中央展柜", "Central display cases"],
  ["夯土质感的展陈空间", "Earthen-texture exhibition setting"],
  ["展柜与顶部影像", "Display cases and overhead film"],
];

export function CaseFilm({ slug, english: en = false }: { slug: string; english?: boolean }) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return null;
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const prefix = en ? "/en" : "";
  const title = en ? projectNames[slug] : project.title;
  const description = en ? projectEnglish[slug].description : project.description;
  const role = en ? projectEnglish[slug].role : project.service;
  const lang = en ? 1 : 0;
  const kind = project.kind as keyof typeof chapterNames;
  const chapters = chapterNames[kind][lang];
  const path = languagePair("/cases/" + slug);
  const nextPath = languagePair("/cases/" + next.slug);
  const source = getSourcePage(en ? path.en : project.source);
  const brochure = kind === "gaomiao" ? getSourcePage(prefix + "/cases/brochure-2026-gaomiao-museum") : undefined;
  const enquiryPath = prefix + "/contact/?project=" + project.slug;
  const photoCaption = {
    liye: en ? "Inside the Liye Qin Manuscript Museum" : "「大秦迁陵 简读中华」主题展厅",
    potala: en ? "Potala Palace exterior · architectural context" : "布达拉宫外景 · 建筑背景",
    gaomiao: en ? "Entrance to the Gaomiao Site Museum exhibition" : "「凤起高庙」展厅入口",
  }[kind];

  return (
    <article className={`project-detail project-${kind}`}>
      <header className="container project-heading">
        <Link className="project-back" href={prefix + "/cases/"}>
          <ArrowLeft size={17} aria-hidden="true" />{en ? "All projects" : "全部案例"}
        </Link>
        <div className="project-intro">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="project-intro-facts">
            <dl>
              <div>
                <dt>{en ? "MGC’s role" : "美创职责"}</dt>
                <dd>{role}</dd>
              </div>
              {project.year && (
                <div>
                  <dt>{en ? "Year" : "项目年份"}</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
            </dl>
            <Link className="editorial-link project-enquiry" href={enquiryPath}>
              {en ? "Discuss a similar project" : "咨询类似项目"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container project-media">
        <figure className="project-plate project-main-plate">
          <ResponsiveImage name={kind} alt={photoCaption} priority
            mobileSource={kind === "gaomiao" ? "gaomiao-hero-mobile" : undefined}
            sizes={kind === "gaomiao" ? "92vw" : "(max-width: 760px) 92vw, 62vw"} />
          <figcaption>{photoCaption}</figcaption>
        </figure>
        {kind === "liye" && (
          <figure className="project-plate project-side-plate">
            <ResponsiveImage name="liye-details" alt={en ? "Exhibition layout with Qin manuscripts and explanatory text" : "秦简实物、现代转写与重点说明的释读版面"}
              sizes="(max-width: 760px) 92vw, 29vw" />
            <figcaption>{en ? "Manuscript interpretation panel" : "秦简释读版面"}</figcaption>
          </figure>
        )}
        {kind === "potala" && (
          <figure className="project-plate project-side-plate">
            <ResponsiveImage name="potala-gallery" alt={en ? "Historic scenes inside the Snow City exhibition" : "雪城展览中的历史生活场景"}
              sizes="(max-width: 760px) 92vw, 29vw" />
            <figcaption>{en ? "Snow City exhibition interior" : "雪城室内展陈"}</figcaption>
          </figure>
        )}
      </div>

      <CaseNavigation key={slug} chapters={chapters} english={en} />
      <div className="container project-story">
        {project.sections.map((section, position) => {
          const copy = en ? projectEnglish[slug].sections[position] : section;
          return (
            <section className="project-chapter" id={position ? "case-chapter-" + position : "case-context"} key={position}>
              <div className="project-chapter-copy" data-reveal-group>
                <h2 data-reveal="editorial">{chapters[position]}</h2>
                <div data-reveal="content">
                  <h3>{copy.title}</h3>
                  <p>{copy.text}</p>
                </div>
              </div>
              {kind === "liye" && position === 2 && <ProjectStudy english={en} />}
              {kind === "liye" && position === 3 && <CaseReader english={en} />}
              {kind === "potala" && position === 2 && (
                <div className="project-source-control">
                  <ImageInspector name="potala-gallery" label={en ? "Snow City exhibition interior" : "雪城室内展陈"} english={en} />
                </div>
              )}
              {kind === "gaomiao" && position === 1 && (
                <div className="project-records">
                  {gaomiaoCaptions.map(([zh, english], photo) => (
                    <figure className="project-plate" key={zh}>
                      <img
                        src={asset(`/brand/gaomiao-gallery-0${photo + 2}.webp`)}
                        alt={en ? english : zh}
                        width={photo < 2 ? 673 : 671}
                        height={504}
                        loading="lazy"
                      />
                      <figcaption>{en ? english : zh}</figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <section className="container project-resources" id="case-archive">
        <h2>{en ? "Project material" : "项目资料"}</h2>
        {source && (
          <details>
            <summary>{en ? "Read the published project archive" : "阅读原始项目资料与图集"}</summary>
            <SourceContent page={source} idPrefix="project-archive-" />
            {brochure && <SourceContent page={brochure} idPrefix="brochure-archive-" />}
          </details>
        )}
        <a className="editorial-link" href={source?.source || sourceSite + project.source} target="_blank" rel="noreferrer">
          {en ? "Source on MGC’s website" : "查看美创原站项目资料"}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </section>

      <section className="project-ending">
        <div className="container project-ending-inner">
          <div>
            <h2>{en ? "Discuss a similar project" : "想做类似的项目？"}</h2>
            <p>{en ? "Bring your venue, brief or collection to the conversation." : "可以从场地、展览主题或已有的馆藏资料聊起。"}</p>
          </div>
          <div className="editorial-actions">
            <Link className="button editorial-primary" href={enquiryPath}>
              {en ? "Discuss a similar project" : "咨询类似项目"}
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button editorial-secondary" href={prefix + "/services/#" + (kind === "gaomiao" ? "heritage" : "display")}>
              {en ? "Related services" : "查看相关服务"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <div className="container project-next">
        <Link className="project-next-link" href={en ? nextPath.en : nextPath.zh}>
          <div>
            <p>{en ? "Next project" : "下一个项目"}</p>
            <h2>{en ? projectNames[next.slug] : next.title}</h2>
          </div>
          <ArrowRight size={24} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
