"use client";
import { useCallback, useEffect, useRef, type RefObject } from "react";

/** Direct horizontal dragging; the browser retains vertical pan and pinch zoom. */
export function useSwipeRail(railRef: RefObject<HTMLDivElement | null>, count: number) {
  const navigate = useRef<((index: number) => void) | null>(null);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const mobile = matchMedia("(max-width: 767px)");
    rail.classList.add("has-swipe-control");
    let settling: number | null = null;
    let gesture: {
      pointer: number; x: number; y: number; left: number; index: number;
      width: number; horizontal: boolean; delta: number;
      lastX: number; lastTime: number; velocity: number;
    } | null = null;
    const restoreSnap = () => {
      if (settling === null || Math.abs(rail.scrollLeft - settling * rail.clientWidth) >= 1) return;
      settling = null;
      rail.classList.remove("is-dragging");
    };
    const settle = (index: number) => {
      settling = Math.max(0, Math.min(count - 1, index));
      // Restore native snapping only at the destination. Restoring it at release
      // would first snap a short drag backwards before the forward transition.
      rail.classList.add("is-dragging");
      rail.scrollTo({
        left: settling * rail.clientWidth,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
      restoreSnap();
    };
    const release = () => {
      const g = gesture;
      gesture = null;
      if (g && rail.hasPointerCapture(g.pointer)) rail.releasePointerCapture(g.pointer);
      return g;
    };
    const finish = (commit: boolean, now = Infinity) => {
      const g = release();
      if (!g) return;
      const distance = Math.abs(g.delta);
      const threshold = Math.min(64, Math.max(40, g.width * .16));
      const flick = distance >= 24 && now - g.lastTime < 120 &&
        Math.abs(g.velocity) >= .35 && g.velocity * g.delta > 0;
      const step = commit && g.horizontal && (distance >= threshold || flick)
        ? (g.delta < 0 ? 1 : -1) : 0;
      settle(g.index + step);
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary) { finish(false); return; }
      if (!mobile.matches || event.button !== 0 ||
        (event.target instanceof Element && event.target.closest("a,button,input,select,textarea"))) return;
      release();
      settling = null;
      const left = rail.scrollLeft;
      // Stop a previous transition where it is, so a new gesture never inherits momentum.
      rail.classList.add("is-dragging");
      rail.scrollTo({ left, behavior: "instant" });
      gesture = {
        pointer: event.pointerId, x: event.clientX, y: event.clientY,
        left, index: Math.max(0, Math.min(count - 1, Math.round(left / rail.clientWidth))),
        width: rail.clientWidth, horizontal: false, delta: 0,
        lastX: event.clientX, lastTime: event.timeStamp, velocity: 0,
      };
    };
    const move = (event: PointerEvent) => {
      const g = gesture;
      if (!g || event.pointerId !== g.pointer) return;
      const dx = event.clientX - g.x, dy = event.clientY - g.y;
      if (!g.horizontal) {
        if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy) * 1.15) return;
        g.horizontal = true;
        rail.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      const elapsed = event.timeStamp - g.lastTime;
      if (elapsed > 0) g.velocity = (event.clientX - g.lastX) / elapsed;
      g.lastX = event.clientX;
      g.lastTime = event.timeStamp;
      g.delta = dx;
      rail.scrollLeft = Math.max(
        Math.max(0, g.index - 1) * g.width,
        Math.min(Math.min(count - 1, g.index + 1) * g.width, g.left - dx),
      );
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId === gesture?.pointer) finish(true, event.timeStamp);
    };
    const abort = () => finish(false);
    const lost = (event: PointerEvent) => {
      // Ignore implicit capture transferring from an image/text child to the rail.
      if (event.target === rail && event.pointerId === gesture?.pointer) abort();
    };
    const resize = () => {
      release();
      settling = null;
      rail.classList.remove("is-dragging");
    };
    navigate.current = index => {
      release();
      settling = null;
      const left = rail.scrollLeft;
      rail.classList.add("is-dragging");
      rail.scrollTo({ left, behavior: "instant" });
      settle(index);
    };
    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move, { passive: false });
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", abort);
    rail.addEventListener("lostpointercapture", lost);
    rail.addEventListener("scroll", restoreSnap, { passive: true });
    rail.addEventListener("scrollend", restoreSnap);
    window.addEventListener("resize", resize);
    return () => {
      release();
      navigate.current = null;
      rail.classList.remove("is-dragging", "has-swipe-control");
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("pointerup", up);
      rail.removeEventListener("pointercancel", abort);
      rail.removeEventListener("lostpointercapture", lost);
      rail.removeEventListener("scroll", restoreSnap);
      rail.removeEventListener("scrollend", restoreSnap);
      window.removeEventListener("resize", resize);
    };
  }, [railRef, count]);
  return useCallback((index: number) => {
    if (navigate.current) navigate.current(index);
    else railRef.current?.scrollTo({ left: index * railRef.current.clientWidth, behavior: "instant" });
  }, [railRef]);
}
