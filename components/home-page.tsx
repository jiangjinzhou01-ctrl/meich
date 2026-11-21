import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { evidence } from "@/lib/evidence";
import { company, projects, services } from "@/lib/content";
import { serviceEnglish } from "@/lib/english-content";
import { languagePair } from "@/lib/routes";
import { ProjectCard } from "./project-card";
import { ResponsiveImage } from "./responsive-image";
import { ContactCTA } from "./ui";

export function HomePage({ english: en = false }: { english?: boolean }) {
  const prefix = en ? "/en" : "";
  const [liye, potala, gaomiao] = projects;
  const liyePath = languagePair("/cases/liye-qin-slips/");
  const recognition = evidence[0];

  return (
    <div className="editorial-home" lang={en ? "en" : undefined}>
      <section className="container home-opening">
        <div className="home-opening-copy">
          <p className="editorial-kicker">{en ? "MGC Digital · Changsha" : company}</p>
          <h1 className="editorial-title">
            {en ? (
              <>Digital experiences <em>for cultural spaces</em></>
            ) : (
              <>为文化空间<em>设计数字体验</em></>
            )}
          </h1>
          <p className="home-opening-intro">
            {en
              ? "We design exhibitions, make digital content and build interactive exhibits for museums and cultural destinations."
              : "为博物馆、展馆和文旅场所设计展览、制作数字内容，并把互动展项落到现场。"}
          </p>
          <div className="editorial-actions">
            <Link className="button editorial-primary" href={prefix + "/cases/"}>
              {en ? "Explore projects" : "看项目"}
              <ArrowDownRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button editorial-secondary" href={prefix + "/contact/"}>
              {en ? "Discuss a project" : "咨询项目"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="opening-plate">
          <Link
            href={en ? liyePath.en : liyePath.zh}
            aria-label={en ? "View the Liye Qin Manuscript Museum project" : "查看里耶古城（秦简）博物馆项目"}
            className="opening-photography"
          >
            <ResponsiveImage
              className="opening-photograph"
              name="liye"
              alt={en ? "Interior of the Liye Qin Manuscript Museum" : liye.imageAlt}
              priority
              sizes="(max-width: 920px) 92vw, 58vw"
            />
            <ResponsiveImage
              className="opening-detail"
              name="liye-details"
              alt={en ? "Detail of the Liye manuscript interpretation panel" : "里耶秦简释读图局部"}
              sizes="(max-width: 600px) 120px, 200px"
            />
          </Link>
          <figcaption>
            <span className="opening-caption-title">{en ? "Liye Qin Manuscript Museum" : liye.title}</span>
            <span>{en ? "Exhibition design · 2025" : "展陈设计 · 2025"}</span>
          </figcaption>
        </figure>
      </section>

      <section className="container home-work" id="selected-work">
        <div className="editorial-section-heading">
          <h2>{en ? "Selected projects" : "精选项目"}</h2>
          <Link className="editorial-link" href={prefix + "/cases/"}>
            {en ? "Browse the project archive" : "浏览案例库"}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-project-grid">
          {[liye, gaomiao, potala].map((project) => (
            <ProjectCard key={project.slug} project={project} english={en} />
          ))}
        </div>
      </section>

      <section className="home-expertise">
        <div className="container home-expertise-grid">
          <div className="home-expertise-copy">
            <h2>{en ? "What we do" : "业务与产品"}</h2>
            <p>
              {en
                ? "Start with the collection, the venue and the visitor. Bring the design, the digital work and the delivery together."
                : "从馆藏资料、场地与观众需求出发，把内容策划、创意设计和工程实施接起来。"}
            </p>
            <Link className="editorial-link" href={prefix + "/services/"}>
              {en ? "Explore services and products" : "了解服务与交付"}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul className="expertise-list">
            {services.map((service, index) => (
              <li key={service.id}>
                <Link href={prefix + "/services/#" + service.id}>
                  <strong>{en ? service.enTitle : service.title}</strong>
                  <span>{(en ? serviceEnglish[index].items : service.items).slice(0, 2).join(" / ")}</span>
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container home-research">
        <div>
          <h2>{en ? "Research and practice" : "研发与实践"}</h2>
          <p>
            {en
              ? "Explore 3D heritage capture, museum software and new ways to interpret cultural collections."
              : "围绕文物三维采集、智慧博物馆软件和多媒体交互，探索文化资料在展示与研究中的应用。"}
          </p>
          <Link className="editorial-link" href={prefix + "/research/"}>
            {en ? "Explore MGC research" : "查看研发方向"}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="home-recognition">
          <h3>{en ? recognition.en : recognition.title}</h3>
          <p>{en ? recognition.enText : recognition.text}</p>
          <a className="editorial-link" href={recognition.url} target="_blank" rel="noreferrer">
            {en ? "Hunan industry and technology department" : recognition.source}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>
      <ContactCTA english={en} />
    </div>
  );
}
