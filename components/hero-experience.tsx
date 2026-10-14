import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ResponsiveImage } from "./responsive-image";
import { RevealText } from "./reveal";
export function HeroExperience({ english: en = false }: { english?: boolean }) {
  return (
    <section
      className="cinematic-hero"
      data-scene="Culture × Experience"
      data-nav-tone="dark"
    >
      <ResponsiveImage
        name="gaomiao"
        alt={
          en
            ? "Gaomiao Site Museum, an actual MGC exhibition project"
            : "高庙遗址博物馆真实展陈空间"
        }
        priority
        sizes="100vw"
        className="scene-media"
      />
      <div className="scene-shade" />
      <div className="container hero-opening">
        <RevealText as="h1" level="cinematic" immediate lines={[
          en ? "Cultural depth." : "文化的深度，",
          en ? "New AI expression." : "AI 的新表达。",
        ]} />
        <RevealText level="editorial" immediate delay={230} className="hero-signature">Culture × AI</RevealText>
        <RevealText immediate delay={340} className="hero-intro">
          {en
            ? "Cultural research, design and technology. Made into experience."
            : "以文化为起点，连接设计、技术与空间体验。"}
        </RevealText>
        <Link href={en ? "/en/cases/" : "/cases/"} className="scene-link" data-reveal="interaction" data-motion-enter style={{ "--motion-delay": "450ms" } as React.CSSProperties}>
          {en ? "Explore work" : "查看案例"}
          <ArrowUpRight size={21} />
        </Link>
      </div>
      <div className="hero-bottom container">
        <a href="#artifact">
          {en ? "Discover" : "向下探索"}
          <ArrowDown size={16} />
        </a>
        <Link href={en ? "/en/cases/gaomiao/" : "/cases/gaomiao/"}>
          {en ? "Gaomiao Site Museum" : "高庙遗址博物馆"}
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
