import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button, SectionLabel, ContactCTA } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
import { ProjectCard } from "@/components/project-card";
import { Process } from "@/components/process";
import { services, projects, asset } from "@/lib/content";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-content">
          <SectionLabel>湖南美创数字科技有限公司</SectionLabel>
          <h1>
            文化的深度，
            <br />
            <span className="hero-emphasis">
              AI 的新表达。
              <svg viewBox="0 0 180 12" aria-hidden="true">
                <path d="M3 8 Q85 -1 177 7" />
              </svg>
            </span>
          </h1>
          <p>
            美创数字，专注文化与科技融合。
            <br />
            连接文化研究、创意设计与 AI，创造可感知的新体验。
          </p>
          <div className="hero-capabilities">
            数字展示 · 数字文博 · 数字文创 · 数字运营
          </div>
          <div className="hero-buttons">
            <Button href="/services/">探索我们的能力</Button>
            <Button href="/contact/" secondary>
              与我们合作
            </Button>
          </div>
        </div>
        <div className="hero-photograph">
          <div className="hero-photo-frame">
            <Image
              src={asset("/brand/liye.webp")}
              alt="美创参与设计制作的里耶古城（秦简）博物馆主题展厅：文化叙事、空间设计与数字展示融为一体"
              width={1080}
              height={659}
              sizes="(max-width: 800px) 90vw, 50vw"
              priority
              fetchPriority="high"
            />
          </div>
          <div className="hero-photo-caption">
            <span>CULTURE × CREATIVE × AI</span>
            <Link href="/work/liye-qin-slips/">
              里耶古城（秦简）博物馆 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="featured-scene container" aria-label="美创精选项目">
        <Link href="/work/gaomiao/" className="scene-link">
          <div className="scene-image" data-reveal="scale">
            <Image
              src={asset("/brand/gaomiao.webp")}
              alt="高庙遗址博物馆真实展陈空间：文化图像与数字影像融入展厅"
              width={1920}
              height={959}
              sizes="90vw"
              loading="lazy"
            />
          </div>
          <div className="scene-caption">
            <div>
              <span>文化，进入体验。</span>
              <h2>高庙遗址博物馆</h2>
            </div>
            <span className="scene-view">
              查看项目 <span aria-hidden="true">↗</span>
            </span>
          </div>
        </Link>
      </section>
      <section id="intro" className="intro-section section container">
        <div className="intro-top"></div>
        <div className="intro-body">
          <h2 data-reveal="mask">
            文化与科技，
            <br />
            在体验中相遇。
          </h2>
          <div data-reveal="line">
            <p>
              从文化内容出发，让创意有根，让技术有方向。
              <br />
              连接文化研究、空间设计与数字表达，
              <br />
              让历史、艺术与生活，拥有新的相遇方式。
            </p>
            <Link className="text-link" href="/about/">
              认识美创数字 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="brand-words">
          {["Culture.", "Create.", "Connect."].map((w, i) => (
            <span
              key={w}
              data-reveal="word"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {w}
            </span>
          ))}
        </div>
      </section>
      <section className="services-section section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>
                从一个想法，
                <br />
                到一段文化体验。
              </h2>
            </div>
            <Link className="text-link" href="/services/">
              全部服务 <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="services-grid">
            {services.slice(0, 4).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <p className="content-note">
            围绕数字展示、数字文博、数字文创与数字运营，组合适合场景的服务。
          </p>
        </div>
      </section>
      <section className="section container work-section">
        <div className="section-heading">
          <div>
            <SectionLabel>精选项目</SectionLabel>
            <h2>
              让价值，
              <br />
              看得见。
            </h2>
          </div>
          <div>
            <p>让文化内容，通过空间、影像与互动被理解。</p>
            <Link className="text-link" href="/work/">
              查看项目 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="project-grid">
          {projects.slice(0, 2).map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <p className="content-note">项目与图片选自美创现有官网公开资料。</p>
      </section>
      <section className="section container ai-culture-section">
        <div>
          <SectionLabel>CULTURE × AI</SectionLabel>
          <h2>
            让 AI，
            <br />
            走进文化现场。
          </h2>
          <p>
            从文化主题影像，到智慧导览与个性化互动。
            <br />
            以具体场景验证技术，保留文化内容的根脉。
          </p>
        </div>
        <div className="ai-culture-links">
          {[
            {
              title: "AI 文化主题拍照",
              text: "让观众参与影像表达，留下自己的文化记忆。",
              href: "/products/ai-photo/",
            },
            {
              title: "AI 互动服务系统",
              text: "连接文化知识与观众提问，延伸智慧文博服务。",
              href: "/products/museum-ai-guide/",
            },
            {
              title: "个性化文化体验",
              text: "研发探索 · AI影像、互动与文化场景的新连接。",
              href: "/research/directions/ai-personalised-cultural-experiences/",
            },
          ].map((item) => (
            <Link href={item.href} key={item.href}>
              <h3>
                {item.title}
                <span aria-hidden="true">↗</span>
              </h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-text">
            <p data-reveal="word">文化，为创造提供根脉。</p>
            <p data-reveal="word">创意，让故事有了表达。</p>
            <p data-reveal="word">技术，让表达成为体验。</p>
          </div>
          <div className="philosophy-footer">
            <Link className="text-link" href="/technology/">
              了解技术体系 <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <Process />
      <ContactCTA />
    </>
  );
}
