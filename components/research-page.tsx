import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, ContactCTA } from "./ui";
import { EvidenceList } from "./evidence";
import { DigitizationStudy } from "./digitization-study";
import { Catalog } from "./catalog";
import { SourceContent } from "./source-content";
import { getSourcePage, catalogFor } from "@/lib/source";
export function ResearchPage({ english: en = false }: { english?: boolean }) {
  const pre = en ? "/en" : "",
    source = getSourcePage(pre + "/research");
  return (
    <>
      <PageHero
        label="Research & Development"
        title={
          en ? (
            <>
              Research culture.
              <br />
              Build new experiences.
            </>
          ) : (
            <>
              从真实问题出发，
              <br />
              让研究走向体验。
            </>
          )
        }
        description={
          en
            ? "Digital heritage, smart museums and interactive systems. Public records connect research with practice."
            : "围绕文化遗产数字化、智慧博物馆与互动系统持续研究。公开成果与探索方向，分别呈现。"
        }
        path={pre + "/research/"}
      />
      <section
        className="research-laboratory"
        data-nav-tone="dark"
        data-scene="Research"
      >
        <div className="container research-lab-grid">
          <div>
            <p className="research-label">Cultural Digitization</p>
            <h2 data-reveal="blur">
              {en
                ? "An object.\nA digital life."
                : "保留形与迹，\n打开新的理解。"}
            </h2>
            <p>
              {en
                ? "Capture, structure and interpret cultural material. The digital resource serves preservation, research and experience."
                : "文化资源从采集、建模与资料整理出发，形成用于保护、研究与展示的数字底本。技术的选择，始终回应内容的需要。"}
            </p>
            <Link className="scene-link" href={pre + "/research/technology/"}>
              {en ? "Explore technology" : "了解技术体系"}
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <DigitizationStudy english={en} />
        </div>
      </section>
      <section
        className="container section research-evidence"
        id="evidence"
        data-scene="Evidence"
      >
        <h2 data-reveal="blur">
          {en
            ? "Public records.\nSpecific capabilities."
            : "公开记录，\n对应具体能力。"}
        </h2>
        <EvidenceList english={en} />
        <p className="content-note">
          {en
            ? "Patent entries identify published documents. Current legal status and applications require the company's latest certificates."
            : "专利条目展示公开文献与申请人记录。现行权属、法律状态与项目应用范围，以企业最新证书及项目资料核验。"}
        </p>
      </section>
      <section
        className="container section research-directions"
        id="directions"
        data-scene={en ? "Research directions" : "研究方向"}
      >
        <h2 data-reveal="blur">{en ? "Questions we are exploring." : "持续探索的方向。"}</h2>
        <p className="catalog-intro">
          {en
            ? "Research directions, separate from corporate news."
            : "围绕文化内容与现场需求展开，独立于企业动态。"}
        </p>
        <Catalog
          items={catalogFor(pre + "/research").filter((i) =>
            i.path.includes("/directions/"),
          )}
          english={en}
          id="research-directions"
          searchLabel={en ? "Search research directions" : "搜索研究方向"}
        />
      </section>
      <section
        className="container section research-directions"
        id="projects"
        data-scene={en ? "Research projects" : "研究项目"}
      >
        <h2 data-reveal="blur">{en ? "Research projects." : "研究项目与实验。"}</h2>
        <p className="catalog-intro">
          {en
            ? "Published experiments and collaborative projects."
            : "保留公开研发项目，按具体主题与协作内容展开。"}
        </p>
        <Catalog
          items={catalogFor(pre + "/research").filter((i) =>
            i.path.includes("/projects/"),
          )}
          english={en}
          id="research-projects"
          searchLabel={en ? "Search research projects" : "搜索研发项目"}
        />
      </section>
      {source && (
        <section className="container research-archive">
          <details>
            <summary>
              {en
                ? "Read the complete research archive"
                : "阅读原有研发成果与协同研究资料"}
            </summary>
            <SourceContent page={source} idPrefix="research-archive-" />
          </details>
        </section>
      )}
      <ContactCTA english={en} />
    </>
  );
}
