"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function CaseNavigation({
  chapters,
  english: en = false,
}: {
  chapters: string[];
  english?: boolean;
}) {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const ids = chapters.map((_, i) =>
    i === 0 ? "case-context" : "case-chapter-" + i,
  );
  useEffect(() => {
    let frame = 0;
    const nodes = ids.map((id) => document.getElementById(id));
    const update = () => {
      frame = 0;
      const anchor =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) + 130;
      let current = 0;
      nodes.forEach((node, i) => {
        if (node && node.getBoundingClientRect().top <= anchor) current = i;
      });
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
    // Chapters are fixed for the lifetime of this project route.
  }, [chapters.length]);
  useEffect(() => {
    const parent = rail.current,
      link = parent?.children[active] as HTMLElement | undefined;
    if (parent && link)
      parent.scrollTo({
        left: link.offsetLeft - parent.offsetLeft - 12,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [active]);
  function navigate(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const target = document.getElementById(ids[index]);
    if (!target) return;
    event.preventDefault();
    const header = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--nav-height",
      ),
    );
    const bar =
      rail.current?.closest("nav")?.getBoundingClientRect().height || 60;
    const top =
      target.getBoundingClientRect().top + scrollY - header - bar - 24;
    // Cancel an interrupted smooth scroll before starting the latest user request.
    window.scrollTo({ top: scrollY, behavior: "instant" });
    window.scrollTo({
      top,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    const url = new URL(location.href);
    url.hash = ids[index];
    history.replaceState(history.state, "", url);
  }
  return (
    <nav
      className="case-reading-nav"
      aria-label={en ? "Project chapters" : "项目章节"}
    >
      <div className="container case-reading-inner">
        <span
          className="case-reading-progress"
          aria-label={
            en
              ? `Chapter ${active + 1} of ${chapters.length}`
              : `第 ${active + 1} 章，共 ${chapters.length} 章`
          }
        >
          0{active + 1}
          <span> / 0{chapters.length}</span>
        </span>
        <div className="case-reading-rail" ref={rail}>
          {chapters.map((label, i) => (
            <a
              href={"#" + ids[i]}
              key={ids[i]}
              aria-current={active === i ? "step" : undefined}
              onClick={(event) => navigate(event, i)}
            >
              <small>0{i + 1}</small>
              {label}
            </a>
          ))}
        </div>
        <div className="case-reading-arrows">
          <a
            href={"#" + ids[Math.max(0, active - 1)]}
            aria-label={en ? "Previous chapter" : "上一章"}
            aria-disabled={active === 0}
            onClick={(e) => {
              if (active === 0) e.preventDefault();
              else navigate(e, active - 1);
            }}
          >
            <ArrowLeft size={18} />
          </a>
          <a
            href={"#" + ids[Math.min(chapters.length - 1, active + 1)]}
            aria-label={en ? "Next chapter" : "下一章"}
            aria-disabled={active === chapters.length - 1}
            onClick={(e) => {
              if (active === chapters.length - 1) e.preventDefault();
              else navigate(e, active + 1);
            }}
          >
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </nav>
  );
}
