"use client";
import { useState } from "react";
import { ResponsiveImage } from "./responsive-image";
export function CaseReader({ english: en = false }: { english?: boolean }) {
  const [active, setActive] = useState(0);
  const labels = en
    ? ["Spatial narrative", "Digital film", "Visitor experience"]
    : ["空间叙事", "数字影像", "观看体验"];
  const text = en
    ? [
        "The cinema combines the viewing surface with the visitor's position to create immersive space.",
        "Cultural interpretation continues from exhibition text into digital film.",
        "Space, light and moving images connect the visitor with the manuscript story.",
      ]
    : [
        "碗幕的观看界面与观众位置共同组织沉浸空间。",
        "文化释读从展厅文字延伸到数字影像。",
        "空间、光影与动态内容连接观众与秦简故事。",
      ];
  return (
    <figure className={"case-readable reading-" + active} data-nav-tone="dark" data-scene={en ? "Liye / Spatial experience" : "里耶 / 空间体验"}>
      <div className="case-readable-media">
        <ResponsiveImage
          name="liye-cinema"
          alt={en ? "Actual Liye museum cinema" : "里耶博物馆真实碗幕影院"}
          sizes="100vw"
        />
        <div className="case-reading-hotspots">
          {labels.map((label, i) => (
            <button
              key={label}
              aria-label={label}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={"case-hotspot hotspot-" + i}
            >
              <span>{i + 1}</span>
              <strong>{label}</strong>
            </button>
          ))}
        </div>
      </div>
      <figcaption className="container case-reading-caption">
        <strong>{labels[active]}</strong>
        <p aria-live="polite">{text[active]}</p>
      </figcaption>
    </figure>
  );
}
