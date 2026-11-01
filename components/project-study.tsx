"use client";
import { useId, useState } from "react";
import { ResponsiveImage } from "./responsive-image";
import { ImageInspector } from "./image-inspector";
const studies = {
  gaomiao: {
    label: ["空间观察", "Spatial observations"],
    views: [
      {
        title: ["空间全景", "The whole space"],
        text: [
          "自然光、弧形动线与主题展陈共同构成入口空间。此处以真实展厅摄影观察空间关系。",
          "Natural light, a curved visitor route and the introductory exhibition frame the entrance. Explore their relationship in the actual project photograph.",
        ],
        image: "gaomiao",
        position: "50%",
        scale: 1,
      },
      {
        title: ["主题入口", "The introduction"],
        text: [
          "“凤起高庙”主题画面与雕塑形成进入展览的视觉起点。取景来自同一张项目摄影。",
          "The exhibition title and sculpture introduce the cultural narrative. This view is a crop of the same project photograph.",
        ],
        image: "gaomiao",
        position: "18%",
        scale: 1.6,
      },
      {
        title: ["内容与动线", "Content & movement"],
        text: [
          "夯土质感的墙面、图文展板与交互终端沿空间展开。摄影仅记录可见现场，不代表设备配置清单。",
          "Earthen wall textures, interpretation panels and an interactive terminal follow the space. The photograph records the visible setting; it is not an equipment specification.",
        ],
        image: "gaomiao",
        position: "90%",
        scale: 1.6,
      },
    ],
  },
  liye: {
    label: [
      "三重释义 · 公开资料对照",
      "Three layers · published interpretation",
    ],
    views: [
      {
        title: ["简牍实物", "Object"],
        text: [
          "先观察版面中简牍的形制与字迹。此图是项目释读资料，不是文物原件扫描。",
          "Begin with the manuscript forms and marks in the published layout. This is project documentation, not a scan of the original object.",
        ],
        image: "liye-details",
        position: "0%",
        scale: 1.45,
      },
      {
        title: ["现代转写", "Transcription"],
        text: [
          "简旁的竖排转写连接古文字与现代汉字。以原版面为依据，不另行生成文字释读。",
          "The vertical transcription beside the manuscript connects the historical writing with modern characters. The source layout is preserved; no new transcription is generated.",
        ],
        image: "liye-details",
        position: "17%",
        scale: 1.45,
      },
      {
        title: ["重点解读", "Context"],
        text: [
          "释读线与文字说明建立细节之间的对应关系。请打开原图对照阅读；现有资料的清晰度仍有上限。",
          "Connecting lines and commentary relate the details. Open the source image to compare them; the available record has a resolution limit.",
        ],
        image: "liye-details",
        position: "83%",
        scale: 1.45,
      },
    ],
  },
  potala: {
    label: ["现场图版 · 建筑与文化", "Field plates · architecture & culture"],
    views: [
      {
        title: ["建筑环境", "Architectural setting"],
        text: [
          "公开案例采用的布达拉宫外景，呈现文化与空间背景。美创公开项目范围为雪城展览设计与施工，不涉及建筑本体。",
          "The exterior photograph in the published case provides cultural and spatial context. MGC’s published scope is Snow City exhibition design and construction, not the palace building itself.",
        ],
        image: "potala",
        position: "50%",
        scale: 1,
      },
      {
        title: ["历史生活场景", "Scenes of historical life"],
        text: [
          "建筑构件、实物与人物场景共同组织参观叙事。保留原有项目图版及其清晰度，不把资料图包装为高清新摄影。",
          "Architectural details, objects and staged historical scenes form a visitor narrative. The original project plate and its resolution are retained.",
        ],
        image: "potala-gallery",
        position: "50%",
        scale: 1,
      },
    ],
  },
};
export function ProjectStudy({
  kind,
  english: en = false,
}: {
  kind: keyof typeof studies;
  english?: boolean;
}) {
  const [active, setActive] = useState(0);
  const id = useId(),
    study = studies[kind],
    view = study.views[active],
    lang = en ? 1 : 0;
  return (
    <figure className={"project-study study-" + kind}>
      <div
        className="study-viewport"
        style={
          {
            "--study-position": view.position,
            "--study-scale": view.scale,
          } as React.CSSProperties
        }
      >
        <ResponsiveImage
          name={view.image}
          alt={
            view.title[lang] +
            (en
              ? ", published project photograph or record"
              : "，公开项目摄影或资料")
          }
          sizes="(max-width:767px) 100vw,75vw"
        />
        <span className="study-plate-number">
          0{active + 1} / 0{study.views.length}
        </span>
        <ImageInspector
          name={view.image}
          label={study.label[lang]}
          english={en}
        />
      </div>
      <figcaption className="study-caption">
        <p className="section-label">{study.label[lang]}</p>
        <div
          className="study-controls"
          role="group"
          aria-label={study.label[lang]}
        >
          {study.views.map((item, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={active === i}
              aria-controls={id}
              onClick={() => setActive(i)}
            >
              <span>0{i + 1}</span>
              {item.title[lang]}
            </button>
          ))}
        </div>
        <p id={id} className="study-explanation" aria-live="polite">
          {view.text[lang]}
        </p>
      </figcaption>
    </figure>
  );
}
