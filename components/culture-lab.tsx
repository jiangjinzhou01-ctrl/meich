"use client";
import { languagePair } from "@/lib/routes";
import Link from "next/link";
import { useId, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { ImageInspector } from "./image-inspector";
import { ResponsiveImage } from "./responsive-image";
const lenses = [
  {
    title: "简牍实物",
    en: "Object",
    text: "先观察简牍的形制与文字痕迹。此处展示的是公开释读版面，并非文物原件的数字扫描。",
    enText:
      "Observe the manuscript form and marks. This is a published interpretation layout, not a digital scan of the object.",
    position: "25%",
  },
  {
    title: "现代转写",
    en: "Transcription",
    text: "现代汉字转写降低阅读门槛。对照版面中的古今文字，理解展览如何帮助观众阅读。",
    enText:
      "Modern transcription makes the writing accessible. Compare the historical marks and modern text in the published layout.",
    position: "50%",
  },
  {
    title: "重点解读",
    en: "Context",
    text: "转写之外，重点解读连接人物、政务与日常。三重释义是该项目公开介绍的展陈方法。",
    enText:
      "Commentary connects writing with people, administration and daily life. This three-layer approach is described in the published project.",
    position: "75%",
  },
];
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
    image: "liye",
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
  const [detail, setDetail] = useState(0);
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
      {standalone ? (
        <div className="container installation-standalone-intro">
          <h2>
            {en
              ? "Four stages. One cultural source."
              : "四个阶段，一份文化资料。"}
          </h2>
          <p>
            {en
              ? "Choose a stage, compare the reading lenses, then inspect the original record."
              : "选择阶段、切换阅读视角，再打开原图对照细节。"}
          </p>
        </div>
      ) : (
        <div className="container installation-title" data-reveal-group>
          <p data-reveal="content" data-reveal-order="0">
            Culture × AI
          </p>
          <h2 data-reveal="editorial">
            {en ? "Another way\ninto culture." : "重新理解，\n才能重新表达。"}
          </h2>
        </div>
      )}
      <div className="installation-controls container">
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
          onClick={() => {
            setDetail(0);
            move(0);
          }}
          aria-label={en ? "Reset interpretation" : "重置演示"}
        >
          <RotateCcw size={18} />
        </button>
      </div>
      <div
        className={"installation-scene installation-" + active}
        data-detail={detail}
        style={
          {
            "--detail-position": lenses[detail].position,
          } as React.CSSProperties
        }
      >
        {stages.map((s, i) => (
          <div
            key={i}
            className={"installation-media " + (active === i ? "active" : "")}
            aria-hidden={active !== i}
          >
            <ResponsiveImage
              name={s.image}
              alt={
                i <= 1
                  ? en
                    ? "Published Liye manuscript interpretation layout"
                    : "里耶秦简公开释读版面"
                  : i === 2
                    ? en
                      ? "Liye exhibition design, actual project"
                      : "里耶博物馆真实展陈设计"
                    : en
                      ? "Liye immersive cinema, actual project"
                      : "里耶博物馆真实碗幕影院"
              }
              sizes="100vw"
            />
          </div>
        ))}
        <div className="installation-shade" />
        <div className="installation-inspect">
          <ImageInspector
            name={s.image}
            label={
              en ? "Liye / published project record" : "里耶秦简 / 公开项目资料"
            }
            english={en}
          />
        </div>
        <div className="installation-plate-label">
          {en ? "PROJECT RECORD / LIYE" : "项目资料 / 里耶秦简"}{" "}
          <span>
            0{active + 1} / 04 · {en ? stages[active].en : stages[active].title}
          </span>
        </div>
        <div className="container installation-content">
          <div className="installation-object">
            <span>{en ? "Cultural source" : "文化对象"}</span>
            <strong>{en ? "Liye Qin manuscripts" : "里耶秦简"}</strong>
          </div>
          <div
            className="installation-reading"
            data-motion-scope="interaction"
            role="tabpanel"
            id={id + "-panel"}
            aria-labelledby={id + "-tab-" + active}
            tabIndex={0}
            key={active}
          >
            <h3>{en ? s.enHeading : s.heading}</h3>
            <p>{en ? s.enText : s.text}</p>
            {active > 1 && (
              <div className="installation-lenses stage-source-note">
                <p className="lens-label">
                  {en ? "Image & interpretation" : "资料与表达的对应"}
                </p>
                <p>
                  {active === 2
                    ? en
                      ? "The photograph shows the exhibition setting. The project describes an approach that connects objects, transcription and commentary."
                      : "图中为真实展厅。项目公开介绍的“三重释义”，连接实物、转写与重点解读。"
                    : en
                      ? "The photograph records the actual bowl-screen cinema. It shows how digital film extends interpretation into a shared viewing space."
                      : "图中为真实碗幕影院。数字影像把展厅中的文化释读延伸为共同观看的空间体验。"}
                </p>
                <Link
                  className="scene-link"
                  href={
                    (en
                      ? languagePair("/cases/liye-qin-slips/").en
                      : "/cases/liye-qin-slips/") +
                    "#" +
                    (active === 2 ? "case-chapter-2" : "case-chapter-3")
                  }
                >
                  {en ? "Read this project chapter" : "阅读对应项目章节"}
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            )}
            {active <= 1 && (
              <div className="installation-lenses">
                <p className="lens-label">
                  {en
                    ? "Explore the three layers of interpretation"
                    : "选择一个视角，对照释读资料"}
                </p>
                <div
                  className="lens-controls"
                  role="group"
                  aria-label={en ? "Reading lenses" : "释读视角"}
                >
                  {lenses.map((lens, i) => (
                    <button
                      key={lens.en}
                      type="button"
                      aria-pressed={detail === i}
                      aria-controls={id + "-lens-note"}
                      onClick={() => setDetail(i)}
                    >
                      {en ? lens.en : lens.title}
                    </button>
                  ))}
                </div>
                <p
                  id={id + "-lens-note"}
                  className="lens-explanation"
                  aria-live="polite"
                >
                  {en ? lenses[detail].enText : lenses[detail].text}
                </p>
              </div>
            )}
            <span className="installation-note">
              {en
                ? "Curated project records / no live AI connection"
                : "公开项目资料导览 / 未连接实时 AI"}
            </span>
          </div>
        </div>
      </div>
      <div className="installation-footer container" data-reveal-group>
        <p data-reveal="content">
          {en
            ? "Based on published project materials. No live recognition, generation or scanning."
            : "依据公开项目资料组织，不提供实时识别、生成或扫描。"}
        </p>
        <Link
          href={
            en
              ? languagePair("/cases/liye-qin-slips/").en
              : "/cases/liye-qin-slips/"
          }
          className="scene-link"
          data-reveal="interaction"
        >
          {en ? "Read the project" : "阅读项目"}
          <ArrowUpRight size={18} />
        </Link>
        <Link className="scene-link" href={(en ? "/en" : "") + "/research/"}>
          {en ? "Research & evidence" : "研究与公开证据"}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
