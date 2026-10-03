"use client";
import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { asset } from "@/lib/content";
export function FilmDialog({ english: en = false }: { english?: boolean }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else {
      video.current?.pause();
      dialog.current?.close();
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      video.current?.pause();
    };
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      <button
        ref={trigger}
        className="film-trigger"
        onClick={() => setOpen(true)}
      >
        <span className="play-circle">
          <Play size={17} fill="currentColor" />
        </span>
        <span>
          {en ? "Meet MGC in motion" : "观看美创品牌影片"}
          <small>
            {en ? "Culture. People. Practice." : "文化、团队与项目现场"}
          </small>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="film-dialog"
        onCancel={() => setOpen(false)}
        aria-label={en ? "MGC brand film" : "美创品牌影片"}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="film-dialog-header">
          <span>{en ? "MGC brand film" : "美创品牌影片"}</span>
          <button
            className="icon-button"
            onClick={close}
            aria-label={en ? "Close video" : "关闭影片"}
          >
            <X size={22} />
          </button>
        </div>
        {open && (
          <video
            ref={video}
            controls
            playsInline
            preload="metadata"
            poster={asset("/brand/reception.webp")}
          >
            <source
              src="https://www.mgcdigi.com/brand/company-films/company.mp4"
              type="video/mp4"
            />
            {en
              ? "Your browser cannot play this film."
              : "浏览器无法播放这部影片。"}
          </video>
        )}
        <p>
          {en
            ? "Film provided by MGC’s existing website."
            : "影片由美创现有官网提供。"}{" "}
          <a
            href="https://www.mgcdigi.com/brand/company-films/company.mp4"
            target="_blank"
            rel="noreferrer"
          >
            {en ? "Open film" : "独立窗口观看"} ↗
          </a>
        </p>
      </dialog>
    </>
  );
}
