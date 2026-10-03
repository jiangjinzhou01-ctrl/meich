"use client";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/content";
export function DigitizationStudy({
  english: en = false,
}: {
  english?: boolean;
}) {
  const [mode, setMode] = useState(0),
    [error, setError] = useState(false),
    canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current,
      c = el?.getContext("2d");
    if (!el || !c) return;
    const im = new Image();
    im.onload = () => {
      const w = 960,
        h = 640;
      el.width = w;
      el.height = h;
      c.fillStyle = "#161616";
      c.fillRect(0, 0, w, h);
      if (mode === 0) {
        c.drawImage(im, 0, 0, w, h);
        return;
      }
      const source = document.createElement("canvas");
      source.width = w;
      source.height = h;
      const s = source.getContext("2d")!;
      s.drawImage(im, 0, 0, w, h);
      try {
        const pixels = s.getImageData(0, 0, w, h).data;
        for (let y = 6; y < h; y += 10)
          for (let x = 6; x < w; x += 10) {
            const i = (y * w + x) * 4,
              gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            if (gray > 235) continue;
            const col = pixels[i] + "," + pixels[i + 1] + "," + pixels[i + 2];
            c.strokeStyle = "rgba(" + col + ",.55)";
            c.fillStyle = "rgb(" + col + ")";
            if (mode === 2) {
              c.beginPath();
              c.moveTo(x, y);
              c.lineTo(x + 10, y);
              c.lineTo(x, y + 10);
              c.stroke();
            } else {
              c.beginPath();
              c.arc(x, y, 1.4, 0, Math.PI * 2);
              c.fill();
            }
          }
      } catch {
        setError(true);
      }
    };
    im.onerror = () => setError(true);
    im.src = asset("/brand/liye-details.webp");
    return () => {
      im.onload = null;
      im.onerror = null;
    };
  }, [mode]);
  return (
    <div className="digitization-study">
      <div
        className="digitization-tabs"
        aria-label={en ? "Digitization study" : "数字化视觉研究"}
      >
        {(en ? ["Image", "Samples", "Grid"] : ["影像", "采样", "网格"]).map(
          (m, i) => (
            <button
              key={m}
              onClick={() => setMode(i)}
              aria-pressed={mode === i}
            >
              {m}
            </button>
          ),
        )}
      </div>
      {error ? (
        <img
          src={asset("/brand/liye-details.webp")}
          alt={en ? "Liye interpretation material" : "里耶释读资料"}
          width={1080}
          height={764}
        />
      ) : (
        <canvas
          ref={canvas}
          aria-label={
            en
              ? "Image-based pixel sampling demonstration"
              : "基于项目图片的像素采样演示"
          }
          role="img"
        />
      )}
      <p>
        {en
          ? "Image sampling concept. Not measured 3D point cloud or a delivered scanning system."
          : "图像采样概念示意，非实测三维点云，非交付扫描系统。"}
      </p>
    </div>
  );
}
