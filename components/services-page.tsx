import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { asset, projects, services } from "@/lib/content";
import { projectNames, serviceEnglish } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { searchIndex } from "@/lib/search";
import { SearchJourney } from "./search-journey";
import { ContactCTA } from "./ui";

const examples = [
  { image: "/brand/liye-casework.webp", caption: ["里耶 · 调试秦简展柜", "Liye · adjusting a manuscript case"], title: [projects[0].title, projectNames[projects[0].slug]], path: "/cases/liye-qin-slips/" },
  { image: "/media/a14e023294d8ed4785.webp", caption: ["藏品三维采集作业", "Digitising a collection object"], title: ["藏品三维数据采集与加工", "3D collection capture"], path: "/products/museum-3d-digitization/" },
  { image: "/brand/kongwu.webp", caption: ["空物相生 · 武汉博物馆门店", "Kongwu · the Wuhan Museum shop"], title: ["空物相生博物馆文创", "Kongwu museum gifts"], path: "/products/kongwu-museum-gifts/" },
  { image: "/brand/operations.webp", caption: ["文化空间中的影像与装置", "Moving image and installation in a cultural venue"], title: ["新媒体 IP 孵化", "New media IP development"], path: "/products/new-media-ip-incubation/" },
];

export function ServicesPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const lang = en ? 1 : 0;
  return (
    <>
      <header className="container services-mast">
        <h1 className="section-display">{en ? "Studio practice" : "业务与产品"}</h1>
        <div><p>{en ? "What does it take to make an exhibition? Follow the work from the display case to the digital collection, the museum shop and the life of the venue." : "一个展馆怎样做成？从展柜前的一次调试，到藏品采集、文创制作与开馆运营，沿着四条业务线看美创的工作。"}</p>
          <div className="service-page-links">
            <Link className="folio-link" href={prefix + "/products/"}>{en ? "Product directory" : "产品目录"}<ArrowUpRight size={16}/></Link>
            <Link className="folio-link" href={prefix + "/solutions/"}>{en ? "Solutions by setting" : "场景方案"}<ArrowUpRight size={16}/></Link>
          </div>
        </div>
      </header>
      <div className="container service-ledger">
        <nav aria-label={en ? "Service areas" : "四条业务线"} className="service-spine">
          {services.map((service) => <a href={"#" + service.id} key={service.id}><span>{en ? service.enTitle : service.title}</span><ArrowDownRight size={16}/></a>)}
        </nav>
        <div className="service-entries">
          {services.map((service, i) => {
            const example = examples[i];
            const path = languagePair(example.path);
            return <section className="service-entry" id={service.id} key={service.id}>
              <figure><img src={asset(example.image)} alt={example.caption[lang]} width={1080} height={810} loading={i ? "lazy" : "eager"} />
                <figcaption>{example.caption[lang]}</figcaption></figure>
              <div className="service-entry-text">
                <h2>{en ? service.enTitle : service.title}</h2>
                <p>{en ? serviceEnglish[i].description : service.description}</p>
                <ul>{(en ? serviceEnglish[i].items : service.items).map((item) => <li key={item}>{item}</li>)}</ul>
                <Link className="folio-link" href={en ? path.en : path.zh}>{example.title[lang]}<ArrowUpRight size={16}/></Link>
                <Link className="service-directory-link" href={prefix + "/products/areas/" + service.id + "/"}>{en ? "All services in this area" : "本业务全部产品"}<ArrowRight size={15}/></Link>
              </div>
            </section>;
          })}
        </div>
      </div>
      <section className="container section service-search-section" id="service-search">
        <SearchJourney items={searchIndex(en)} english={en} />
      </section>
      <ContactCTA english={en} />
    </>
  );
}
