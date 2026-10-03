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
      <section className="container section">
        <SearchJourney items={searchIndex(en)} english={en} />
      </section>
      <ArtifactJourney english={en} />
      <ContactCTA english={en} />
    </>
  );
}
