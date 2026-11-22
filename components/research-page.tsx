import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { asset } from "@/lib/content";
import { catalogFor, getSourcePage } from "@/lib/source";
import { Catalog } from "./catalog";
import { DigitizationStudy } from "./digitization-study";
import { EvidenceList } from "./evidence";
import { SourceContent } from "./source-content";
import { ContactCTA } from "./ui";

export function ResearchPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const source = getSourcePage(prefix + "/research");
  const materials = catalogFor(prefix + "/research");
  return (
    <>
      <header className="research-mast">
        <div className="container research-mast-inner">
          <div>
            <p className="small-rule">{en ? "Research at MGC Digital" : "美创数字研发"}</p>
            <h1 className="section-display">{en ? <>Recording<br />the object</> : <>文物的<br />数字记录</>}</h1>
            <p>{en ? "How does an object become a record that can be examined, stored and exhibited? MGC works across 3D capture, museum software and interactive media." : "一件文物，怎样成为可以观察、保存与展示的数字资料？美创的研发从三维采集延伸到馆藏软件与交互影像。"}</p>
            <div className="service-page-links">
              <Link className="folio-link" href={prefix + "/research/technology/"}>{en ? "Technology" : "技术体系"}<ArrowUpRight size={16}/></Link>
              <Link className="folio-link" href={prefix + "/culture-ai/"}>{en ? "Explore Culture × AI" : "体验 Culture × AI"}<ArrowUpRight size={16}/></Link>
            </div>
          </div>
          <figure className="research-specimen">
            <img src={asset("/brand/nao-film.webp")} width={1280} height={720} fetchPriority="high" alt={en ? "Detail from MGC’s digital film of the bronze nao bell with elephant motifs" : "美创云观博文物影像中的象纹大铜铙"} />
            <figcaption><span>{en ? "Bronze nao bell · collection film still" : "象纹大铜铙 · 文物采集影片截帧"}</span>
              <Link href="/videos/540414323970117/">{en ? "Film (Chinese)" : "观看影片"}<ArrowUpRight size={16}/></Link></figcaption>
          </figure>
        </div>
      </header>
      <nav className="container lab-index" aria-label={en ? "Research contents" : "研发页目录"}>
        {[[ "evidence", "公开记录", "Public records" ], [ "directions", "研究方向", "Research directions" ], [ "projects", "研发项目", "Projects" ], [ "sampling", "图像采样", "Image sampling" ]].map(([id, zh, eng]) => <a key={id} href={"#" + id}>{en ? eng : zh}<ArrowRight size={15}/></a>)}
      </nav>
      <section className="container research-evidence editorial-research-section" id="evidence">
        <h2>{en ? "Public records" : "公开记录"}</h2>
        <EvidenceList english={en} />
      </section>
      <section className="container research-directions editorial-research-section" id="directions">
        <h2>{en ? "Research directions" : "研究方向"}</h2>
        <Catalog
          items={materials.filter((item) => item.path.includes("/directions/"))}
          english={en}
          id="research-directions"
          paramPrefix="direction-"
          searchLabel={en ? "Search research directions" : "搜索研究方向"}
        />
      </section>
      <section className="container research-directions editorial-research-section" id="projects">
        <h2>{en ? "Research projects" : "研发项目"}</h2>
        <Catalog
          items={materials.filter((item) => item.path.includes("/projects/"))}
          english={en}
          id="research-projects"
          paramPrefix="project-"
          searchLabel={en ? "Search research projects" : "搜索研发项目"}
        />
      </section>
      <section id="sampling" className="container editorial-research-section">
        <details className="research-demo">
          <summary>{en ? "Try the image sampling demonstration" : "打开文物图像采样示意"}</summary>
          <DigitizationStudy english={en} />
        </details>
        <Link className="editorial-link" href={prefix + "/experiences/"}>
          {en ? "Online experiences" : "更多线上体验"}<ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
      {source && (
        <section className="container research-archive">
          <details>
            <summary>{en ? "Read the complete research archive" : "查阅研发档案与协作资料"}</summary>
            <SourceContent page={source} idPrefix="research-archive-" />
          </details>
        </section>
      )}
      <ContactCTA english={en} />
    </>
  );
}
