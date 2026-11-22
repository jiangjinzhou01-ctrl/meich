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
  const titleLines = {
    liye: ["里耶古城", "（秦简）博物馆"],
    potala: ["布达拉宫雪城", "展览升级改造"],
    gaomiao: ["高庙遗址", "博物馆"],
  }[kind];
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
      <header className="case-jacket">
        <div className="container case-jacket-inner">
          <div className="case-jacket-type">
            <Link className="project-back" href={prefix + "/cases/"}>
              <ArrowLeft size={16} />{en ? "All projects" : "全部案例"}
            </Link>
            <h1 className="section-display">{en ? title : titleLines.map((line) => <span className="case-name-line" key={line}>{line}</span>)}</h1>
            <p>{description}</p>
            <div className="jacket-facts">
              <dl>
                <div><dt>{en ? "MGC’s role" : "美创职责"}</dt><dd>{role}</dd></div>
                {project.year && <div><dt>{en ? "Year" : "项目年份"}</dt><dd>{project.year}</dd></div>}
              </dl>
              <Link className="folio-link project-enquiry" href={enquiryPath}>{en ? "Discuss a similar project" : "咨询类似项目"}<ArrowUpRight size={17} /></Link>
            </div>
          </div>
          <figure className="jacket-print project-main-plate">
            {kind === "liye" ? (
              <img src={asset("/brand/liye-table.webp")} width={1080} height={564} fetchPriority="high"
                alt={en ? "The multiplication table manuscript and its interpretation in the transparent case" : "「九九表」简牍与释读文字并列于透明展柜中"} />
            ) : (
              <ResponsiveImage name={kind} alt={photoCaption} priority mobileSource={kind === "gaomiao" ? "gaomiao-hero-mobile" : undefined}
                sizes="(max-width: 760px) 100vw, 54vw" />
            )}
            <figcaption>{kind === "liye" ? en ? "The multiplication table · interactive display case" : "「九九表」透明互动展柜" : photoCaption}</figcaption>
          </figure>
        </div>
      </header>

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
              {kind === "liye" && position === 0 && (
                <div className="project-media story-print">
                  <figure><img src={asset("/brand/liye-visitors.webp")} width={1080} height={809} loading="lazy" alt={en ? "Visitors looking at the central display beneath the curved screen" : "观众围绕核心展柜，双曲面屏在上方展示迁陵洞庭郡"} />
                    <figcaption>{en ? "Qianling and Dongting · the main case and curved screen" : "「迁陵洞庭郡」组合陈列 · 核心展柜与双曲面屏"}</figcaption></figure>
                </div>
              )}
              {kind === "liye" && position === 1 && (
                <div className="project-media process-prints">
                  <figure><img src={asset("/brand/liye-bench.webp")} width={1080} height={810} loading="lazy" alt={en ? "Adjusting the viewing angle of a display case" : "调试展柜的观看角度与照明"} />
                    <figcaption>{en ? "Testing the viewing angle" : "测试展柜的观展角度"}</figcaption></figure>
                  <figure><img src={asset("/brand/liye-casework.webp")} width={1080} height={810} loading="lazy" alt={en ? "Positioning the manuscript supports under the display light" : "在陈列照明下比对简牍的摆放位置"} />
                    <figcaption>{en ? "Checking manuscript placement" : "比对简牍的陈列位置"}</figcaption></figure>
                </div>
              )}
              {kind === "potala" && position === 0 && (
                <div className="project-media snow-prints">
                  <figure><ResponsiveImage name="potala" alt={photoCaption} sizes="(max-width: 700px) 93vw, 48vw" /><figcaption>{photoCaption}</figcaption></figure>
                  <figure><ResponsiveImage name="potala-gallery" alt={en ? "Inside the Snow City exhibition" : "雪城专题展览室内"} sizes="(max-width: 700px) 80vw, 35vw" />
                    <figcaption>{en ? "Inside the Snow City exhibition" : "雪城专题展览 · 室内"}</figcaption></figure>
                </div>
              )}
              {kind === "liye" && position === 2 && <ProjectStudy english={en} />}
              {kind === "liye" && position === 3 && <>
                <CaseReader english={en} />
                <figure className="projection-print"><img src={asset("/brand/liye-projection.webp")}
                  srcSet={asset("/brand/liye-projection-640.webp") + " 640w, " + asset("/brand/liye-projection.webp") + " 1080w"}
                  sizes="(max-width: 700px) 91vw, 55vw" width={1080} height={650} loading="lazy"
                  alt={en ? "A gold map of Qin filling the curved screen" : "金色秦地图投影于碗幕之上"} />
                  <figcaption>{en ? "Liye · a second scene in the immersive cinema" : "里耶 · 碗幕影院另一幕"}</figcaption></figure>
              </>}
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
          <img className="next-project-photo" src={asset(next.image)} alt="" width={240} height={140} loading="lazy" />
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
