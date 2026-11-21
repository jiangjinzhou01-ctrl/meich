import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseCatalogFor, catalogFilters } from "@/lib/source";
import { Catalog } from "./catalog";
import { ContactCTA, PageHero } from "./ui";

export function CasesPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  return (
    <>
      <PageHero
        path={prefix + "/cases/"}
        label=""
        title={en ? "Project archive" : "项目案例"}
        description={en
          ? "Explore exhibitions, museum experiences and cultural projects. Search by name, venue or service."
          : "查找展览、数字文博与文化空间项目，了解美创在真实现场做了什么。"}
      />
      <section className="container project-index" id="case-results">
        <Catalog
          items={caseCatalogFor(en)}
          filters={catalogFilters(prefix + "/cases")}
          english={en}
          searchLabel={en ? "Search projects" : "搜索案例"}
          projectIndex
        />
        <Link className="editorial-link" href={prefix + "/videos/"}>
          {en ? "Explore project films" : "浏览项目影像"}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
      <ContactCTA english={en} />
    </>
  );
}
