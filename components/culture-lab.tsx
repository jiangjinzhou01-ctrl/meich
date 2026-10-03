"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { ResponsiveImage } from "./responsive-image";
const stages = [
  {
    title: "识别",
    en: "Recognize",
    heading: "看见文字的形与迹。",
    enHeading: "Observe the marks.",
    text: "以项目释读资料为底本，呈现简牍文字与现代汉字的对应关系。",
    enText: "Read manuscript marks alongside reviewed modern transcriptions.",
    image: "liye-details",
  },
  {
    title: "解读",
    en: "Interpret",
    heading: "从文字，走进秦人的日常。",
    enHeading: "From writing to everyday life.",
    text: "里耶秦简记录了迁陵县的政务与生活。文化研究把分散的记录组织成能够被理解的故事。",
    enText:
      "The Liye records describe administration and everyday life in Qianling County.",
    image: "liye-details",
  },
  {
    title: "表达",
    en: "Express",
    heading: "让知识，拥有可感知的形式。",
    enHeading: "Give knowledge a tangible form.",
    text: "文字、转写与重点解读连接图示和影像。AI 可以辅助表达，文化内容仍需校对。",
    enText:
      "Connect reviewed knowledge with visual expression. AI supports creation; cultural content requires review.",
    image: "cultural-study",
  },
  {
    title: "空间化",
    en: "Spatialize",
    heading: "让故事，在空间中发生。",
    enHeading: "Let the story surround you.",
    text: "从简牍释读到碗幕影院，空间、光影与数字内容共同构成一次文化体验。",
    enText:
      "From interpreted manuscripts to immersive cinema, space and digital content form an experience.",
    image: "liye-cinema",
  },
];
export function CultureLab({
  english: en = false,
  standalone = false,
}: {
  english?: boolean;
  standalone?: boolean;
}) {
  const [active, setActive] = useState(0);
  const id = useId(),
    s = stages[active];
  function move(i: number) {
    setActive(i);
    document.getElementById(id + "-tab-" + i)?.focus();
  }
  return (
    <section
      className={
        "culture-installation " + (standalone ? "standalone-installation" : "")
      }
      id="culture-lab"
      data-nav-tone="dark"
      data-scene="Culture × AI"
    >
      <div className="container installation-title">
        <p>Culture × AI</p>
        <h2>
          {en ? "Another way\ninto culture." : "重新理解，\n才能重新表达。"}
        </h2>
      </div>
      <div className={"installation-scene installation-" + active}>
        {stages.map((s, i) => (
          <div
            key={i}
            className={"installation-media " + (active === i ? "active" : "")}
          >
            <ResponsiveImage
              name={s.image}
              alt={
                i === 2
                  ? en
                    ? "Generated manuscript study, not an actual artifact"
                    : "生成简牍视觉研究，非真实文物"
                  : en
                    ? "Published Liye museum project material"
                    : "里耶秦简博物馆公开项目素材"
              }
              sizes="100vw"
            />
          </div>
        ))}
        <div className="installation-shade" />
        {active === 0 && (
          <div className="recognition-brackets" aria-hidden="true">
            <span>文字</span>
            <span>转写</span>
          </div>
        )}
        {active === 1 && (
          <div className="interpretation-words" aria-hidden="true">
            <span>{en ? "Administration" : "县政"}</span>
            <span>{en ? "Everyday life" : "日常"}</span>
            <span>{en ? "Historical context" : "时代"}</span>
          </div>
        )}
        <div className="container installation-content">
          <div className="installation-object">
            <span>{en ? "Cultural source" : "文化对象"}</span>
            <strong>{en ? "Liye Qin manuscripts" : "里耶秦简"}</strong>
          </div>
          <div
            className="installation-reading"
            role="tabpanel"
            id={id + "-panel"}
            aria-labelledby={id + "-tab-" + active}
            tabIndex={0}
            key={active}
          >
            <h3>{en ? s.enHeading : s.heading}</h3>
            <p>{en ? s.enText : s.text}</p>
            <span className="installation-note">
              {active === 2
                ? en
                  ? "Generated visual study / not a real artifact"
                  : "生成视觉研究 / 非真实文物"
                : en
                  ? "Curated concept / no live AI connection"
                  : "预置概念演示 / 未连接实时 AI"}
            </span>
          </div>
          <div className="installation-controls">
            <div
              className="installation-tabs"
              role="tablist"
              aria-label={en ? "Interpretation process" : "文化内容转化过程"}
            >
              {stages.map((s, i) => (
                <button
                  role="tab"
                  key={i}
                  id={id + "-tab-" + i}
                  aria-selected={active === i}
                  aria-controls={id + "-panel"}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      move(
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 3
                            : (active + (e.key === "ArrowRight" ? 1 : 3)) % 4,
                      );
                    }
                  }}
                >
                  {en ? s.en : s.title}
                </button>
              ))}
            </div>
            <button
              className="installation-reset"
              onClick={() => move(0)}
              aria-label={en ? "Reset interpretation" : "重置演示"}
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="installation-footer container">
        <p>
          {en
            ? "Historical knowledge is reviewed. Generative expression is clearly identified."
            : "文化知识经过校对，生成表达标明来处。"}
        </p>
        <Link
          href={
            en
              ? "/en/cases/brochure-2026-liye-qin-slips/"
              : "/cases/liye-qin-slips/"
          }
          className="scene-link"
        >
          {en ? "Read the project" : "阅读项目"}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
