"use client";
import { useCallback, useEffect, useRef, type RefObject } from "react";

/** Direct horizontal dragging; the browser retains vertical pan and pinch zoom. */
export function useSwipeRail(railRef: RefObject<HTMLDivElement | null>, count: number) {
  const cancel = useRef<(() => void) | null>(null);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const mobile = matchMedia("(max-width: 767px)");
    rail.classList.add("has-swipe-control");
    let gesture: {
      pointer: number; x: number; y: number; left: number; index: number;
      width: number; horizontal: boolean; delta: number;
      lastX: number; lastTime: number; velocity: number;
    } | null = null;
    const settle = (index: number) => {
      rail.classList.remove("is-dragging");
      rail.scrollTo({
        left: index * rail.clientWidth,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    };
    const finish = (commit: boolean, now = Infinity) => {
      const g = gesture;
      if (!g) return;
      gesture = null;
      const distance = Math.abs(g.delta);
      const threshold = Math.min(64, Math.max(40, g.width * .16));
      const flick = distance >= 24 && now - g.lastTime < 120 &&
        Math.abs(g.velocity) >= .35 && g.velocity * g.delta > 0;
      const step = commit && g.horizontal && (distance >= threshold || flick)
        ? (g.delta < 0 ? 1 : -1) : 0;
      settle(Math.max(0, Math.min(count - 1, g.index + step)));
      if (rail.hasPointerCapture(g.pointer)) rail.releasePointerCapture(g.pointer);
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary) { finish(false); return; }
      if (!mobile.matches || event.button !== 0 ||
        (event.target instanceof Element && event.target.closest("a,button,input,select,textarea"))) return;
      finish(false);
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
      // Even an exaggerated drag can expose only the adjacent chapter.
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
      // A touch starts with implicit capture on the image. Transferring that
      // capture to the rail must not be mistaken for losing our own gesture.
      if (event.target === rail && event.pointerId === gesture?.pointer) abort();
    };
    cancel.current = abort;
    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move, { passive: false });
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", abort);
    rail.addEventListener("lostpointercapture", lost);
    window.addEventListener("resize", abort);
    return () => {
      gesture = null;
      cancel.current = null;
      rail.classList.remove("is-dragging", "has-swipe-control");
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("pointerup", up);
      rail.removeEventListener("pointercancel", abort);
      rail.removeEventListener("lostpointercapture", lost);
      window.removeEventListener("resize", abort);
    };
  }, [railRef, count]);
  return useCallback(() => cancel.current?.(), []);
}
