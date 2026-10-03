"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { asset, services } from "@/lib/content";
const english = [
  [
    "Digital exhibitions",
    "Spatial storytelling, immersive films and interactive exhibits.",
  ],
  ["Digital museums", "3D capture, visitor services and online collections."],
  [
    "Cultural creation",
    "Cultural research, IP development and everyday objects.",
  ],
  [
    "Digital operations",
    "Content, cultural spaces and ongoing visitor engagement.",
  ],
];
const visuals = [
  "/brand/liye-details.webp",
  "/brand/museum-platform.webp",
  "/brand/creative.webp",
  "/brand/operations.webp",
];
export function CapabilityIndex({
  english: en = false,
}: {
  english?: boolean;
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="capability-index">
      <div className={`capability-canvas capability-${active}`}>
        <img
          key={active}
          src={asset(visuals[active])}
          srcSet={
            active === 2
              ? undefined
              : `${asset(visuals[active].replace(".webp", "-640.webp"))} 640w, ${asset(visuals[active])} ${[1080, 1400, 626, 768][active]}w`
          }
          sizes="(max-width: 767px) 80vw, 40vw"
          alt={
            en
              ? `MGC ${english[active][0]} reference`
              : [
                  "秦简文字转写与重点解读版面",
                  "智慧博物馆平台官方配图",
                  "美创文创产品实物",
                  "美创文化空间运营项目",
                ][active]
          }
          width={1080}
          height={764}
          loading="lazy"
        />
        {active === 0 && (
          <div className="manuscript-rails" aria-hidden="true">
            {["文化", "内容", "释读", "设计", "表达"].map((t, i) => (
              <span key={t} style={{ "--rail": i } as React.CSSProperties}>
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="capability-caption">
          {en
            ? [
                "From manuscript to interpretation",
                "From collection to digital resources",
                "From cultural elements to objects",
                "From visits to ongoing connections",
              ][active]
            : [
                "从简牍，到可以被理解的内容",
                "从馆藏，到可连接的数字资源",
                "从文化元素，到日常之物",
                "从一次参观，到持续的文化连接",
              ][active]}
        </div>
      </div>
      <div className="capability-rows">
        {services.map((s, i) => (
          <div
            key={s.id}
            className={`capability-row ${active === i ? "selected" : ""}`}
          >
            <button onClick={() => setActive(i)} aria-pressed={active === i}>
              <span className="capability-name">
                {en ? english[i][0] : s.title}
              </span>
              <span className="capability-en">{s.en}</span>
              <span className="capability-description">
                {en ? english[i][1] : s.description}
              </span>
            </button>
            <Link
              href={`${en ? "/en" : ""}/services/#${s.id}`}
              prefetch={false}
              aria-label={en ? `Explore ${english[i][0]}` : `了解${s.title}`}
            >
              <ArrowUpRight size={22} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
