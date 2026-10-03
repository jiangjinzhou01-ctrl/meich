"use client";
import { useRef, useEffect, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
// Custom spatial M: two structural columns and three connecting modules.
const silhouette = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [1, 1],
  [2, 2],
  [3, 1],
];
const blocks = [0, 1].flatMap((z) => silhouette.map(([x, y]) => [x, y, z]));
export function DigitalSystem() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        el.dataset.active = String(entries[0].isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    const visibility = () => {
      el.dataset.active = String(
        !document.hidden && el.getBoundingClientRect().bottom > 0,
      );
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div
      className={`digital-art ${paused ? "paused" : ""}`}
      ref={ref}
      role="group"
      aria-label="为美创定制的模块化 M 形结构，表达文化、创意与数字技术的连接"
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches ||
          paused
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        ref.current?.style.setProperty(
          "--mx",
          `${(e.clientX - r.left - r.width / 2) / 40}deg`,
        );
        ref.current?.style.setProperty(
          "--my",
          `${-(e.clientY - r.top - r.height / 2) / 50}deg`,
        );
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--mx", "0deg");
        ref.current?.style.setProperty("--my", "0deg");
      }}
    >
      <div className="art-grid" aria-hidden="true" />
      <div className="assembly" aria-hidden="true">
        <div className="cube-system">
          {blocks.map(([x, y, z], i) => (
            <div
              key={i}
              className={`cube ${z === 1 && ((x === 2 && y === 2) || (x === 0 && y === 3)) ? "brand-block" : ""}`}
              style={
                { "--x": x, "--y": y, "--z": z, "--i": i } as CSSProperties
              }
            >
              <i className="face front" />
              <i className="face back" />
              <i className="face left" />
              <i className="face right" />
              <i className="face top" />
              <i className="face bottom" />
            </div>
          ))}
        </div>
      </div>
      <button
        className="icon-button art-toggle"
        aria-label={paused ? "播放品牌动效" : "暂停品牌动效"}
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? (
          <Play size={16} aria-hidden="true" />
        ) : (
          <Pause size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
export function ServiceGraphic({ kind }: { kind: string }) {
  return (
    <div className={`service-graphic graphic-${kind}`} aria-hidden="true">
      {Array.from({ length: kind === "enterprise" ? 5 : 4 }, (_, i) => (
        <i key={i} style={{ "--n": i } as CSSProperties} />
      ))}
      <span />
    </div>
  );
}
