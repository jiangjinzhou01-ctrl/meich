"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type PointerEvent, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { asset } from "@/lib/content";
import { languagePair } from "@/lib/routes";

const editions = [
  {
    key: "liye", year: "2025", path: "/cases/liye-qin-slips/",
    name: ["里耶古城（秦简）博物馆", "Liye Qin Manuscript Museum"],
    role: ["创意设计与实施制作", "Creative design and production"],
  },
  {
    key: "baishi", year: "2023", path: "/cases/brochure-2026-qi-baishi/",
    name: ["湖南美术馆 · 齐白石精品展", "Hunan Art Museum · Qi Baishi"],
    role: ["多媒体设计与施工", "Multimedia design and installation"],
  },
  {
    key: "huxiang", year: "2022", path: "/cases/brochure-2026-hearing-huxiang/",
    name: ["听见湖湘 · 湖南音乐文物与故事", "Hearing Huxiang · Musical Artefacts"],
    role: ["多媒体创意设计与施工", "Multimedia design and installation"],
  },
] as const;

function PrintedCover({ number, en }: { number: number; en: boolean }) {
  const item = editions[number];
  return (
    <div className={"printed-cover print-" + item.key} aria-hidden="true">
      <div className="print-imprint"><strong>MGC</strong><span>{item.year}</span></div>
      {item.key === "liye" ? (
        <div className="print-liye-art">
          <div className="slip-title" lang="zh-CN">大秦迁陵</div><div className="slip-subtitle" lang="zh-CN">简读中华</div>
          <img className="printed-slip slip-long" src={asset("/brand/liye-slip-long.webp")} width={59} height={631} alt="" />
          <img className="printed-slip slip-short" src={asset("/brand/liye-slip-short.webp")} width={61} height={488} alt="" />
        </div>
      ) : item.key === "baishi" ? (
        <div className="print-baishi-art">
          <div className="baishi-title" lang="zh-CN">客中月光<br/><em>照家山</em></div>
          <img src={asset("/brand/baishi-640.webp")} width={640} height={469} alt="" />
        </div>
      ) : (
        <div className="print-huxiang-art">
          <strong className="sound-title" lang="zh-CN">听见</strong>
          <img src={asset("/brand/huxiang-640.webp")} width={640} height={427} alt="" />
          <strong className="sound-title sound-second" lang="zh-CN">湖湘</strong>
        </div>
      )}
      <div className="print-credit"><strong>{item.name[en ? 1 : 0]}</strong><span>{item.role[en ? 1 : 0]}</span></div>
    </div>
  );
}

type Gesture = { id: number; x: number; y: number; started: number; horizontal: boolean; plate: HTMLAnchorElement | null };
export function ExhibitionCover({ english: en = false }: { english?: boolean }) {
  const [active, setActive] = useState(0);
  const table = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const item = editions[active];
  const lang = en ? 1 : 0;
  const prefix = en ? "/en" : "";
  const caseLink = (i: number) => languagePair(editions[i].path)[en ? "en" : "zh"];
  const shift = (delta: number) => setActive((current) => (current + delta + editions.length) % editions.length);

  function begin(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick.current = false;
    const plate = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>(".atlas-plate") : null;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, started: event.timeStamp, horizontal: false, plate };
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 7) return;
      if (Math.abs(dy) > Math.abs(dx)) { gesture.current = null; return; }
      drag.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }
    event.currentTarget.style.setProperty("--drag", Math.max(-140, Math.min(140, dx * .64)) + "px");
  }
  function end(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    gesture.current = null;
    const dx = event.clientX - drag.x;
    suppressClick.current = drag.horizontal;
    if (drag.horizontal && !cancelled && Math.abs(dx) > 38) shift(dx < 0 ? 1 : -1);
    delete event.currentTarget.dataset.dragging;
    event.currentTarget.style.removeProperty("--drag");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!cancelled && !drag.horizontal && event.pointerType === "touch" && drag.plate &&
      event.timeStamp - drag.started < 500 && Math.hypot(dx, event.clientY - drag.y) < 9) {
      // Browsers may discard the compatibility click on the first tap after a swipe.
      event.preventDefault();
      suppressClick.current = true;
      drag.plate.click();
    }
  }
  function openPlate(event: MouseEvent<HTMLAnchorElement>, i: number) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (i !== active) { event.preventDefault(); setActive(i); }
  }
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault();
      table.current?.querySelector<HTMLAnchorElement>('[data-slot="active"]')?.click();
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(editions.length - 1);
    else shift(event.key === "ArrowRight" ? 1 : -1);
    table.current?.focus({ preventScroll: true });
  }

  return (
    <section className="atlas-opening home-opening" aria-label={en ? "Exhibition atlas" : "展览图录"}>
      <header className="container atlas-mast">
        <h1>{en ? <>Exhibition <em>atlas</em></> : <>展览<em>图录</em></>}</h1>
        <div className="atlas-intro">
          <p>{en ? "Exhibition design and digital production for museums and cultural spaces, by MGC Digital in Changsha." : "美创数字，以展览设计、数字影像与互动制作，连接馆藏和走进展厅的人。"}</p>
          <div className="editorial-actions atlas-actions">
            <Link className="editorial-primary" href={prefix + "/cases/"}>{en ? "Project index" : "浏览全部项目"}</Link>
            <Link className="editorial-secondary" href={prefix + "/contact/"}>{en ? "Enquiries" : "项目咨询"}</Link>
          </div>
        </div>
      </header>

      <div className="print-table" ref={table} role="region" aria-label={en ? "Browse project covers" : "翻阅项目封面"} tabIndex={0}
        onPointerDown={begin} onPointerMove={move} onPointerUp={(e) => end(e)} onPointerCancel={(e) => end(e, true)}
        onPointerLeave={(e) => { if (!gesture.current?.horizontal) end(e, true); }}
        onLostPointerCapture={(e) => { if (e.target === e.currentTarget) end(e, true); }}
        onKeyDown={keys} onDragStart={(e) => e.preventDefault()} onClickCapture={(e) => {
          if (suppressClick.current && e.detail > 0) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; }
        }}>
        {editions.map((entry, i) => {
          const order = (i - active + editions.length) % editions.length;
          const slot = order === 0 ? "active" : order === 1 ? "next" : "previous";
          return <Link key={entry.key} href={caseLink(i)} className="atlas-plate" data-slot={slot}
            aria-current={slot === "active" ? "true" : undefined}
            aria-label={(en ? slot === "active" ? "Open project · " : "Select cover · " : slot === "active" ? "进入项目 · " : "选择封面 · ") + entry.name[lang]}
            onClick={(e) => openPlate(e, i)} prefetch={false}>
            <PrintedCover number={i} en={en} />
          </Link>;
        })}
      </div>

      <div className="container atlas-desk">
        <div className="atlas-controls">
          <button onClick={() => shift(-1)} aria-label={en ? "Previous cover" : "上一张封面"}><ArrowLeft size={20}/></button>
          <span aria-hidden="true">{String(active + 1).padStart(2,"0")} <i>/</i> 03</span>
          <button onClick={() => shift(1)} aria-label={en ? "Next cover" : "下一张封面"}><ArrowRight size={20}/></button>
        </div>
        <p className="desk-instruction"><MoveHorizontal size={17}/>{en ? "Drag to browse" : "左右拖动图版"}</p>
        <Link className="open-edition" href={caseLink(active)} aria-live="polite">
          <span>{item.name[lang]}</span><strong>{en ? "Open project" : "翻开项目"}<ArrowUpRight size={16}/></strong>
        </Link>
      </div>
    </section>
  );
}
