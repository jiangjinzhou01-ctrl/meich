import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { asset } from "@/lib/content";
import { languagePair } from "@/lib/routes";
import { caseCatalogFor, catalogFilters } from "@/lib/source";
import { Catalog } from "./catalog";
import { ContactCTA } from "./ui";

const archivePlates = [
  { path: "/cases/gaomiao", src: "/brand/gaomiao-640.webp", zh: "高庙", en: "Gaomiao" },
  { path: "/cases/liye-qin-slips", src: "/brand/liye-cinema-640.webp", zh: "里耶", en: "Liye" },
  { path: "/cases/potala-snow-city", src: "/brand/potala-gallery.webp", zh: "雪城", en: "Snow City" },
];

export function CasesPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const items = caseCatalogFor(en);
  return (
    <>
      <header className="container archive-mast">
        <div className="archive-intro">
          <h1 className="section-display">{en ? "Project index" : "项目索引"}<sup aria-label={en ? items.length + " projects" : items.length + " 个项目"}>{items.length}</sup></h1>
          <p>{en ? "Find a project by museum, exhibition theme or service." : "按场馆、展览主题或美创承担的工作，查找项目。"}</p>
        </div>
        <div className="archive-plates">
          {archivePlates.map((item) => <Link key={item.path} href={languagePair(item.path)[en ? "en" : "zh"]}>
            <img src={asset(item.src)} alt="" width={240} height={160} /><span>{en ? item.en : item.zh}</span>
          </Link>)}
        </div>
      </header>
      <section className="container project-index" id="case-results">
        <Catalog items={items} filters={catalogFilters(prefix + "/cases")} english={en}
          searchLabel={en ? "Search projects" : "搜索案例"} projectIndex />
        <Link className="editorial-link" href={prefix + "/videos/"}>
          {en ? "Project films" : "浏览项目影像"}<ArrowRight size={17} />
        </Link>
      </section>
      <ContactCTA english={en} />
    </>
  );
}
