"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ResponsiveImage } from "./responsive-image";
const phases = [
  {
    title: "文化资源",
    en: "Cultural source",
    image: "liye-details",
    text: "从秦简、文物、历史资料与文化空间，找到内容的起点。",
    enText:
      "Begin with manuscripts, objects, historical records and cultural spaces.",
  },
  {
    title: "数字采集",
    en: "Digitize",
    image: "liye-details",
    text: "扫描、摄影、三维建模与数据采集，让文化资源拥有可持续使用的数字底本。",
    enText:
      "Photography, scanning and modeling form a reusable digital resource.",
  },
  {
    title: "文化理解",
    en: "Understand",
    image: "liye",
    text: "文化研究、知识梳理与内容校对先行。AI 参与理解，研究决定表达。",
    enText:
      "Research, structure and review knowledge before choosing its expression.",
  },
  {
    title: "体验设计",
    en: "Design",
    image: "gaomiao",
    text: "视觉、交互、内容与空间，共同组织一段能够被理解的文化叙事。",
    enText:
      "Visual design, interaction and space give cultural knowledge a tangible form.",
  },
  {
    title: "现场体验",
    en: "Experience",
    image: "liye-cinema",
    text: "让研究与设计走向博物馆、数字展览、互动装置与智慧平台，完成制作、集成与实施。",
    enText:
      "Build, integrate and implement exhibitions, interactive installations and smart platforms.",
  },
];
export function ArtifactJourney({
  english: en = false,
}: {
  english?: boolean;
}) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting)
            setActive(Number((e.target as HTMLElement).dataset.phase));
        }),
      { rootMargin: "-30% 0px -35% 0px" },
    );
    root.current?.querySelectorAll("[data-phase]").forEach((e) => o.observe(e));
    return () => o.disconnect();
  }, []);
  return (
    <section
      ref={root}
      className="artifact-journey"
      id="artifact"
      data-scene="From Artifact to Experience"
    >
      <div className="container artifact-heading">
        <p>From Artifact to Experience</p>
        <h2>
          {en
            ? "A cultural resource.\nA new experience."
            : "一件文化资源，\n如何成为一段体验。"}
        </h2>
      </div>
      <div className="artifact-body">
        <div className="artifact-stage" aria-hidden="true">
          {phases.map((p, i) => (
            <div
              className={"artifact-layer " + (active === i ? "active" : "")}
              key={i}
            >
              <ResponsiveImage
                name={p.image}
                alt=""
                sizes="(max-width:767px) 100vw,65vw"
              />
            </div>
          ))}
          <span className="artifact-stage-label">
            {en ? phases[active].en : phases[active].title}
          </span>
        </div>
        <div className="artifact-steps">
          {phases.map((p, i) => (
            <article
              key={i}
              data-phase={i}
              className={active === i ? "active" : ""}
            >
              <span className="journey-index">0{i + 1}</span>
              <h3>{en ? p.en : p.title}</h3>
              <p>{en ? p.enText : p.text}</p>
              {i === 4 && (
                <Link
                  className="text-link"
                  href={en ? "/en/cases/" : "/cases/"}
                >
                  {en ? "Explore the work" : "查看真实项目"}
                  <ArrowUpRight size={18} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
