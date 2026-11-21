"use client";
import { useId, useState } from "react";
import { ResponsiveImage } from "./responsive-image";
import { ImageInspector } from "./image-inspector";
const source = "liye-details";
const study = {
  label: [
    "三重释义 · 公开资料对照",
    "Three layers · published interpretation",
  ],
  views: [
    {
      title: ["简牍实物", "Object"],
      text: [
        "从释读版面观察简牍的形制与字迹。",
        "Look at the shape and marks of the manuscript in the published exhibition layout.",
      ],
      position: "0%",
    },
    {
      title: ["现代转写", "Transcription"],
      text: [
        "简牍旁边的竖排文字用现代汉字转写。",
        "The vertical text beside the manuscript transcribes the ancient writing into modern characters.",
      ],
      position: "17%",
    },
    {
      title: ["重点解读", "Context"],
      text: [
        "释读线与文字说明建立细节之间的对应关系。请打开原图对照阅读；现有资料的清晰度仍有上限。",
        "Connecting lines and commentary relate the details. Open the source image to compare them; the available record has a resolution limit.",
      ],
      position: "83%",
    },
  ],
};
export function ProjectStudy({
  english: en = false,
}: {
  english?: boolean;
}) {
  const [active, setActive] = useState(0);
  const id = useId(),
    view = study.views[active],
    lang = en ? 1 : 0;
  return (
    <figure className="project-study study-liye">
      <div
        className="study-viewport"
        style={
          {
            "--study-position": view.position,
            "--study-scale": 1.45,
          } as React.CSSProperties
        }
      >
        <ResponsiveImage
          name={source}
          alt={
            view.title[lang] +
            (en
              ? ", published project photograph or record"
              : "，公开项目摄影或资料")
          }
          sizes="(max-width:767px) 100vw,75vw"
        />
        <ImageInspector
          name={source}
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
