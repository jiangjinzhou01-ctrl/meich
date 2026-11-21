import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { catalogFor, getSourcePage } from "@/lib/source";
import { Catalog } from "./catalog";
import { DigitizationStudy } from "./digitization-study";
import { EvidenceList } from "./evidence";
import { SourceContent } from "./source-content";
import { ContactCTA, PageHero } from "./ui";

export function ResearchPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const source = getSourcePage(prefix + "/research");
  const materials = catalogFor(prefix + "/research");
  return (
    <>
      <PageHero
        label=""
        title={en ? "Research and development" : "研发与公开记录"}
        description={en
          ? "We explore how 3D capture, museum software and interactive media can support preservation, research and exhibitions."
          : "围绕文物三维采集、智慧博物馆软件与多媒体交互，探索数字资料在保存、研究和展陈中的用法。"}
        path={prefix + "/research/"}
      >
        <div className="service-page-links">
          <Link className="editorial-link" href={prefix + "/research/technology/"}>
            {en ? "Technology" : "技术体系"}<ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="editorial-link" href={prefix + "/culture-ai/"}>
            {en ? "Explore Culture × AI" : "体验 Culture × AI"}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </PageHero>
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
      <section className="container editorial-research-section">
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
