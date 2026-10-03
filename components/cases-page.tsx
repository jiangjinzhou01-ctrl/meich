import { PageHero, ContactCTA } from "./ui";
import { ProjectCard } from "./project-card";
import { Catalog } from "./catalog";
import { catalogFor, catalogFilters } from "@/lib/source";
import { projects } from "@/lib/content";
export function CasesPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en/cases" : "/cases";
  const highlighted = new Set(
    projects.map((p) =>
      en
        ? {
            "liye-qin-slips": "/en/cases/brochure-2026-liye-qin-slips",
            "potala-snow-city": "/en/cases/brochure-2026-potala-snow-city",
            gaomiao: "/en/cases/gaomiao",
          }[p.slug]
        : `/cases/${p.slug}`,
    ),
  );
  return (
    <>
      <PageHero
        label={en ? "Selected work" : "项目案例"}
        title={
          en ? (
            <>Culture, made tangible.</>
          ) : (
            <>
              把文化的深度，
              <br />
              变成真实的体验。
            </>
          )
        }
        description={
          en
            ? "Exhibitions, cultural spaces and digital experiences. Explore the project, the approach and our role."
            : "从文物与历史，到空间、影像和互动。看项目如何落地，也看美创具体负责什么。"
        }
        path={`${prefix}/`}
      />
      <section className="container work-list">
        <h2 className="sr-only">{en ? "Selected work" : "精选作品"}</h2>
        <div className="selected-work-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} english={en} />
          ))}
        </div>
      </section>
      <section className="container case-catalog section" id="case-results">
        <h2>{en ? "Explore the complete archive." : "继续探索完整案例库。"}</h2>
        <p className="catalog-intro">
          {en
            ? "Search by project, cultural subject, venue or capability."
            : "按项目、文化主题、场馆和能力查找作品。"}
        </p>
        <Catalog
          items={catalogFor(prefix).filter(
            (i) => !highlighted.has(i.path.replace(/\/$/, "")),
          )}
          filters={catalogFilters(prefix)}
          english={en}
        />
      </section>
      <ContactCTA english={en} />
    </>
  );
}
