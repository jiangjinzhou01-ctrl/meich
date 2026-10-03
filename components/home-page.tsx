import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroExperience } from "./hero-experience";
import { FilmDialog } from "./film-dialog";
import { ArtifactJourney } from "./artifact-journey";
import { CultureLab } from "./culture-lab";
import { ResponsiveImage } from "./responsive-image";
import { ProjectCard } from "./project-card";
import { EvidenceList } from "./evidence";
import { ContactCTA } from "./ui";
import { projects, asset } from "@/lib/content";
export function HomePage({ english: en = false }: { english?: boolean }) {
  const pre = en ? "/en" : "";
  return (
    <>
      <HeroExperience english={en} />
      <section
        className="quiet-manifesto"
        data-scene={en ? "Cultural understanding" : "理解文化"}
      >
        <img
          className="archive-underlay"
          src={asset("/brand/liye-details.webp")}
          alt=""
          width={1080}
          height={764}
          loading="lazy"
        />
        <div className="container">
          <p className="manifesto-lead" data-reveal>
            {en
              ? "Technology does not replace culture."
              : "技术不是文化的替代。"}
          </p>
          <h2 data-reveal>
            {en
              ? "It gives culture\nnew ways to speak."
              : "它让文化，\n拥有新的表达方式。"}
          </h2>
          <p className="manifesto-body">
            {en
              ? "We begin with content, connecting cultural research, creative design, digital production and implementation."
              : "我们从内容出发，连接文化研究、创意设计、数字生产与工程实施。让历史被理解，让体验真正发生。"}
          </p>
        </div>
      </section>
      <section
        className="reel-scene"
        data-nav-tone="dark"
        data-scene={en ? "Culture in space" : "文化进入空间"}
      >
        <ResponsiveImage
          name="liye-cinema"
          alt={en ? "Actual Liye museum cinema" : "里耶古城秦简博物馆碗幕影院"}
          sizes="100vw"
          className="scene-media"
        />
        <div className="scene-shade" />
        <div className="container reel-scene-content">
          <h2>{en ? "Culture,\nall around you." : "文化，\n不止于观看。"}</h2>
          <FilmDialog english={en} />
        </div>
      </section>
      <ArtifactJourney english={en} />
      <section
        className="selected-work"
        data-scene={en ? "Selected work" : "精选案例"}
      >
        <div className="container work-introduction">
          <h2>
            {en ? "Culture, made tangible." : "文化的深度，成为真实的体验。"}
          </h2>
          <Link className="text-link" href={pre + "/cases/"}>
            {en ? "All work" : "全部案例"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="selected-work-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} english={en} />
          ))}
        </div>
      </section>
      <CultureLab english={en} />
      <section
        className="research-preview"
        data-nav-tone="dark"
        data-scene="Research"
      >
        <div className="research-preview-media">
          <ResponsiveImage
            name="liye-details"
            alt={en ? "Liye manuscript interpretation" : "里耶秦简释读资料"}
            sizes="100vw"
          />
        </div>
        <div className="container research-preview-content">
          <p className="research-label">Research & Development</p>
          <h2>
            {en
              ? "A question today.\nAn experience tomorrow."
              : "今天的研究，\n成为明天的体验。"}
          </h2>
          <p>
            {en
              ? "3D digitization, museum software and interactive systems. Research grounded in cultural questions."
              : "文物三维数字化、智慧软件与互动系统。从文化现场的问题出发，把研究连接到应用。"}
          </p>
          <Link className="scene-link" href={pre + "/research/"}>
            {en ? "Explore research" : "走进研发"}
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
      <section
        className="container section home-evidence"
        data-scene="Evidence"
      >
        <h2>{en ? "Evidence, in the open." : "能力，有公开的来处。"}</h2>
        <EvidenceList english={en} compact />
        <Link href={pre + "/research/#evidence"} className="text-link">
          {en ? "Read public records" : "查看公开记录"}
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <section
        className="container section home-about"
        data-scene={en ? "About MGC" : "关于美创"}
      >
        <div className="home-about-title">
          <h2>
            {en
              ? "A continuing\ncultural practice."
              : "从文化出发，\n持续创造。"}
          </h2>
          <p>
            {en
              ? "Based in Changsha. Connecting research, creativity, digital production and engineering."
              : "立足长沙，连接文化研究、创意设计、数字生产与工程交付。"}
          </p>
          <Link className="text-link" href={pre + "/about/"}>
            {en ? "Meet MGC" : "认识美创"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="home-about-record">
          <ResponsiveImage
            name="reception"
            alt={en ? "MGC office reception" : "美创数字长沙办公空间"}
            sizes="(max-width:767px) 100vw,50vw"
          />
          <dl>
            <div>
              <dt>2008</dt>
              <dd>{en ? "Brand practice begins" : "品牌实践起点"}</dd>
            </div>
            <div>
              <dt>2015</dt>
              <dd>{en ? "Legal entity established" : "工商主体成立"}</dd>
            </div>
            <div>
              <dt>2024</dt>
              <dd>
                {en ? "Provincial technology center" : "省级企业技术中心认定"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <ContactCTA english={en} />
    </>
  );
}
