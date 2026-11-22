import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { asset, company } from "@/lib/content";
import { getSourcePage } from "@/lib/source";
import { FilmDialog } from "./film-dialog";
import { SourceContent } from "./source-content";
import { ContactCTA } from "./ui";

export function AboutPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const source = getSourcePage(prefix + "/about");
  return (
    <>
      <header className="company-mast">
        <div className="container company-mast-inner">
          <div>
            <p className="small-rule">{en ? "MGC Digital · Changsha" : company}</p>
            <h1 className="section-display">{en ? <>A studio<br />in Changsha</> : <>从长沙<br />出发。</>}</h1>
            <p>{en ? "Cultural researchers, exhibition designers, filmmakers and software developers share a studio in Changsha. Their work connects collections with the people who visit them." : "在长沙，文化研究、空间设计、数字影像和软件团队一起工作。美创的项目从一批馆藏、一处遗址或一个地方故事开始。 "}</p>
            <FilmDialog english={en} />
          </div>
          <figure><img src={asset("/brand/studio.webp")} width={1280} height={720} alt={en ? "Design team working at the Changsha office" : "设计团队在长沙工作室办公"} fetchPriority="high" />
            <figcaption>{en ? "MGC Digital · the Changsha studio" : "美创数字 · 长沙工作室"}</figcaption></figure>
        </div>
      </header>
      <section className="container studio-history">
        <h2>{en ? "The practice" : "公司沿革"}</h2>
        <dl>
          <div><dt>2008</dt><dd>{en ? "The team began working in digital exhibitions." : "团队开始从事数字展示，积累展陈与多媒体项目经验。"}</dd></div>
          <div><dt>2015</dt><dd>{en ? "Hunan MGC Digital Technology Co., Ltd. was formally established on 9 February." : "2 月 9 日，湖南美创数字科技有限公司正式成立。"}</dd></div>
        </dl>
        <div className="service-page-links">
          <Link className="folio-link" href={prefix + "/insights/"}>{en ? "Studio news" : "美创动态"}<ArrowUpRight size={17}/></Link>
          <Link className="folio-link" href={en ? "/en/collaboration/" : "/careers/"}>{en ? "Careers and collaboration" : "人才与协作"}<ArrowUpRight size={17}/></Link>
        </div>
      </section>
      {source && <section className="container company-archive" id="profile">
        <details><summary>{en ? "Company profile, founder and expert team" : "公司概况、创始人与专家团队资料"}</summary>
          <SourceContent page={source} excludeIds={["profile"]} /></details>
      </section>}
      <ContactCTA english={en} />
    </>
  );
}
