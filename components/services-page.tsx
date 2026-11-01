import { languagePair } from "@/lib/routes";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { projectEnglish } from "@/lib/english-content";
import { projectNames } from "./project-card";
import { PageHero, ContactCTA } from "./ui";
import { ServiceIndex } from "./service-index";
import { SearchJourney } from "./search-journey";
import { ArtifactJourney } from "./artifact-journey";
import { searchIndex } from "@/lib/search";
export function ServicesPage({ english: en = false }: { english?: boolean }) {
  return (
    <>
      <PageHero
        label={en ? "Expertise" : "服务能力"}
        title={
          en ? (
            <>
              Understand culture.
              <br />
              Shape its expression.
            </>
          ) : (
            <>
              理解文化，
              <br />
              再决定如何表达。
            </>
          )
        }
        description={
          en
            ? "From research to space, digital content and implementation. Connected capabilities working on the same story."
            : "从文化研究到空间体验，从数字内容到现场实施。不同能力，围绕同一个故事共同工作。"
        }
        path={en ? "/en/services/" : "/services/"}
      />
      <ServiceIndex english={en} />
      <section className="container section service-project-proof">
        <div className="section-heading">
          <div>
            <p className="section-label">
              {en ? "Published responsibilities" : "以真实职责，说明能力"}
            </p>
            <h2 data-reveal="editorial">
              {en
                ? "See the work behind the expertise."
                : "服务，如何进入真实项目。"}
            </h2>
          </div>
        </div>
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={
              en
                ? languagePair("/cases/" + p.slug + "/").en
                : "/cases/" + p.slug + "/"
            }
            className="service-project-row"
          >
            <span>{en ? projectNames[p.slug] : p.title}</span>
            <p>{en ? projectEnglish[p.slug].role : p.service}</p>
            <span className="service-project-source">
              {en ? "Published project record" : "依据公开项目资料"}
              <ArrowUpRight size={18} />
            </span>
          </Link>
        ))}
        <p className="service-project-boundary">
          {en
            ? "Project responsibilities follow published records. A new project’s scope, deliverables and technical configuration are agreed during consultation."
            : "项目职责依据公开资料整理。新项目的服务范围、交付内容与技术配置，在具体沟通后确认。"}
        </p>
      </section>
      <section className="container section service-search-section">
        <SearchJourney items={searchIndex(en)} english={en} />
      </section>
      <ArtifactJourney english={en} />
      <ContactCTA english={en} />
    </>
  );
}
