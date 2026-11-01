import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ResponsiveImage } from "./responsive-image";
import { RevealText } from "./reveal";

export function HeroExperience({ english: en = false }: { english?: boolean }) {
  const pre = en ? "/en" : "";
  return (
    <section className="cinematic-hero" data-scene="Culture × Experience">
      <div
        className="hero-photograph"
        data-nav-tone="dark"
        data-scene={en ? "Gaomiao / Spatial narrative" : "高庙 / 空间叙事"}
      >
        <ResponsiveImage
          name="gaomiao"
          alt={
            en
              ? "Natural light, earthen walls and the exhibition entrance at Gaomiao Site Museum"
              : "高庙遗址博物馆：自然光、夯土墙与“凤起高庙”主题展陈"
          }
          priority
          sizes="100vw"
          mobileSource="gaomiao-hero-mobile"
          className="scene-media"
        />
        <div className="hero-photo-caption container">
          <span>01 — {en ? "Culture, in place" : "文化，在场"}</span>
          <Link href={pre + "/cases/gaomiao/"}>
            {en ? "Gaomiao Site Museum" : "高庙遗址博物馆"}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="container hero-opening" data-scene="MGC Digital">
        <div className="hero-title-block">
          <p className="hero-eyebrow">
            <span aria-hidden="true" />
            MGC DIGITAL /{" "}
            {en ? "Cultural experience studio" : "美创数字 · 文化体验创造者"}
          </p>
          <RevealText
            as="h1"
            level="cinematic"
            immediate
            lines={[
              en ? "Cultural depth." : "文化的深度，",
              en ? "New AI expression." : "AI 的新表达。",
            ]}
          />
        </div>
        <div className="hero-context">
          <p className="hero-signature">Culture × Design × Technology</p>
          <p className="hero-intro">
            {en
              ? "We start with culture. Through research, design and technology, we shape experiences that connect people with place."
              : "以文化为起点，连接研究、设计与技术。让历史被理解，让体验在真实空间发生。"}
          </p>
          <div className="hero-actions">
            <Link href={pre + "/cases/"} className="text-link hero-action">
              {en ? "Explore work" : "探索真实案例"}
              <ArrowUpRight size={20} />
            </Link>
            <a
              href="#selected-work"
              className="hero-scroll"
              aria-label={en ? "Scroll to selected work" : "滚动至精选案例"}
            >
              <ArrowDown size={19} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
