import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { company } from "@/lib/content";
import { getSourcePage } from "@/lib/source";
import { FilmDialog } from "./film-dialog";
import { ResponsiveImage } from "./responsive-image";
import { SourceContent } from "./source-content";
import { ContactCTA, PageHero } from "./ui";

export function AboutPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const source = getSourcePage(prefix + "/about");
  return (
    <>
      <PageHero
        label=""
        path={prefix + "/about/"}
        title={en ? "About MGC Digital" : "关于美创数字"}
        description={en
          ? "Based in Changsha, MGC Digital brings cultural research, exhibition design, digital production and museum software together."
          : company + "立足长沙，面向博物馆、展馆和文旅场所，连接文化研究、展陈设计、数字内容制作与智慧软件。"}
      >
        <div className="service-page-links">
          <Link className="editorial-link" href={prefix + "/insights/"}>
            {en ? "Company news" : "美创动态"}<ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="editorial-link" href={en ? "/en/collaboration/" : "/careers/"}>
            {en ? "Join or collaborate" : "人才与协作"}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </PageHero>
      <section className="container company-overview">
        <figure className="company-photo">
          <ResponsiveImage name="reception" alt={en ? "MGC Digital’s Changsha office reception" : "美创数字长沙办公空间"} sizes="(max-width: 760px) 92vw, 55vw" priority />
          <figcaption>{en ? "MGC Digital · Changsha office" : "美创数字 · 长沙办公空间"}</figcaption>
        </figure>
        <div className="company-history">
          <h2>{en ? "Our practice in Changsha" : "从长沙出发"}</h2>
          <p>{en
            ? "Cultural researchers, designers, digital producers and software teams work together on the same project. Their work runs from understanding the material through to the visitor experience."
            : "内容研究、空间设计、数字制作与软件开发在同一个项目里协作，从读懂资料一路做到观众能在现场使用的体验。"}</p>
          <dl>
            <div><dt>2008</dt><dd>{en ? "Start of the brand’s practice" : "品牌实践起点"}</dd></div>
            <div><dt>2015</dt><dd>{en ? "Legal entity established" : "工商主体成立"}</dd></div>
          </dl>
          <FilmDialog english={en} />
        </div>
      </section>
      {source && (
        <section className="container company-archive" id="profile">
          <details>
            <summary>{en ? "Company profile, team and published records" : "公司概况、创始人与专家团队资料"}</summary>
            <SourceContent page={source} excludeIds={["profile"]} />
          </details>
        </section>
      )}
      <ContactCTA english={en} />
    </>
  );
}
