import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects, services } from "@/lib/content";
import { projectNames, serviceEnglish } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { searchIndex } from "@/lib/search";
import { ResponsiveImage } from "./responsive-image";
import { SearchJourney } from "./search-journey";
import { ContactCTA, PageHero } from "./ui";

const examples = {
  display: {
    image: "liye",
    imageLabel: ["里耶古城（秦简）博物馆展厅", "Liye Qin Manuscript Museum exhibition"],
    title: [projects[0].title, projectNames[projects[0].slug]],
    path: "/cases/" + projects[0].slug + "/",
  },
  heritage: {
    image: "museum-platform",
    imageLabel: ["智慧博物馆平台界面", "Smart museum platform interfaces"],
    title: ["文物三维采集与数字化", "3D capture and digitisation"],
    path: "/products/museum-3d-digitization/",
  },
  creative: {
    image: "creative",
    imageLabel: ["美创数字文创设计资料", "MGC cultural products"],
    title: ["空物相生 · 博物馆文创", "Kongwu · Museum gifts"],
    path: "/products/kongwu-museum-gifts/",
  },
  operations: {
    image: "operations",
    imageLabel: ["数字运营的内容制作场景", "Content production for digital operations"],
    title: ["新媒体 IP 孵化", "New media IP development"],
    path: "/products/new-media-ip-incubation/",
  },
};

export function ServicesPage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const lang = en ? 1 : 0;
  return (
    <>
      <PageHero
        label=""
        title={en ? "Services and products" : "业务与产品"}
        description={en
          ? "Exhibition planning, digital production, on-site integration and operations for cultural venues."
          : "从展览策划、内容制作到现场集成和运营支持，按场馆与项目需求组合服务。"}
        path={prefix + "/services/"}
      >
        <div className="service-page-links">
          <Link className="editorial-link" href={prefix + "/products/"}>
            {en ? "Product directory" : "产品目录"}<ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="editorial-link" href={prefix + "/solutions/"}>
            {en ? "Solutions by setting" : "按场景找方案"}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </PageHero>
      <div className="container service-overview">
        <nav aria-label={en ? "Service areas" : "四条业务线"} className="service-anchors">
          {services.map((service) => (
            <a href={"#" + service.id} key={service.id}>
              {en ? service.enTitle : service.title}<ArrowRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
        {services.map((service, index) => {
          const example = examples[service.id as keyof typeof examples];
          const path = languagePair(example.path);
          return (
            <section className="service-delivery" id={service.id} key={service.id}>
              <figure>
                <ResponsiveImage name={example.image} alt={example.imageLabel[lang]}
                  sizes="(max-width: 760px) 92vw, 46vw" />
              </figure>
              <div className="service-delivery-copy">
                <h2>{en ? service.enTitle : service.title}</h2>
                <p>{en ? serviceEnglish[index].description : service.description}</p>
                <ul>
                  {(en ? serviceEnglish[index].items : service.items).map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="service-page-links">
                  <Link className="editorial-link" href={en ? path.en : path.zh}>
                    {example.title[lang]}<ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                  <Link className="editorial-link" href={prefix + "/products/areas/" + service.id + "/"}>
                    {en ? "View service area" : "查看业务详情"}<ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <section className="container section service-search-section" id="service-search">
        <SearchJourney items={searchIndex(en)} english={en} />
      </section>
      <ContactCTA english={en} />
    </>
  );
}
