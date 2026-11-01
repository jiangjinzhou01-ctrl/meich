"use client";
import { useEffect, useRef, useState } from "react";
import { Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { asset } from "@/lib/content";

/** Native dialog preserves focus and Escape behavior; the original record is never resampled. */
export function ImageInspector({
  name,
  label,
  english: en = false,
}: {
  name: string;
  label: string;
  english?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else dialog.current?.close();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    setOpen(false);
    setDetail(false);
  }
  return (
    <>
      <a
        href={asset("/brand/" + name + ".webp")}
        className="image-inspect-trigger"
        aria-haspopup="dialog"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Maximize2 size={16} />
        {en ? "Inspect source image" : "查看资料原图"}
      </a>
      <dialog
        ref={dialog}
        className="image-inspector"
        aria-label={label}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="image-inspector-toolbar">
          <strong>{label}</strong>
          <button
            type="button"
            onClick={() => setDetail(!detail)}
            aria-pressed={detail}
          >
            {detail ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            {detail
              ? en
                ? "Fit"
                : "适应窗口"
              : en
                ? "Original size"
                : "原始尺寸"}
          </button>
          <button
            type="button"
            onClick={close}
            aria-label={en ? "Close image" : "关闭原图"}
            autoFocus
          >
            <X size={22} />
          </button>
        </div>
        <div
          className={
            "image-inspector-scroll " + (detail ? "original-size" : "")
          }
          tabIndex={0}
          aria-label={en ? "Scrollable source image" : "可滚动的资料原图"}
        >
          {open && <img src={asset("/brand/" + name + ".webp")} alt={label} />}
        </div>
        <p>
          {en
            ? "Published project material. Original resolution and source marks retained. In original size, scroll to inspect details."
            : "公开项目资料，保留原始清晰度及来源标记。原始尺寸下可横向、纵向滚动查看。"}
        </p>
      </dialog>
    </>
  );
}
