"use client";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { resistedPosition, sampledVelocity, swipeSpring } from "@/lib/swipe-physics";

export function useSwipeRail(railRef: RefObject<HTMLDivElement | null>, count: number) {
  const navigate = useRef<((index: number) => void) | null>(null);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const mobile = matchMedia("(max-width: 767px)");
    rail.classList.add("has-swipe-control");
    let frame = 0;
    let position = rail.scrollLeft;
    let gesture: {
      pointer: number; x: number; y: number; left: number; index: number;
      width: number; horizontal: boolean; delta: number;
      samples: { position: number; time: number }[];
    } | null = null;
    const max = () => (count - 1) * rail.clientWidth;
    const paint = (x: number) => {
      position = x;
      const scroll = Math.max(0, Math.min(max(), x));
      rail.scrollLeft = scroll;
      rail.style.setProperty("--swipe-edge", `${scroll - x}px`);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const settle = (index: number, velocity = 0) => {
      stop();
      const target = Math.max(0, Math.min(count - 1, index)) * rail.clientWidth;
      const from = position, start = performance.now();
      rail.classList.add("is-dragging");
      const complete = () => {
        paint(target);
        rail.classList.remove("is-dragging");
        frame = 0;
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { complete(); return; }
      const tick = (now: number) => {
        const state = swipeSpring(from, velocity, target, (now - start) / 1000);
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) { complete(); return; }
        if ((Math.abs(state.position - target) < .25 && Math.abs(state.velocity) < 5) || now - start > 1500) {
          complete(); return;
        }
        paint(state.position);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
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
      const velocity = sampledVelocity(g.samples, now);
      const distance = Math.abs(g.delta);
      const threshold = Math.min(64, Math.max(40, g.width * .16));
      const flick = distance >= 24 && Math.abs(velocity) >= 350 && velocity * g.delta < 0;
      const step = commit && g.horizontal && (distance >= threshold || flick) ? (g.delta < 0 ? 1 : -1) : 0;
      // Same position and measured velocity at release: no fresh ease-in from zero speed.
      settle(g.index + step, commit ? velocity : 0);
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary) { finish(false); return; }
      if (!mobile.matches || event.button !== 0 ||
        (event.target instanceof Element && event.target.closest("a,button,input,select,textarea"))) return;
      release();
      if (!frame) position = rail.scrollLeft;
      stop();
      rail.classList.add("is-dragging");
      rail.scrollTo({ left: rail.scrollLeft, behavior: "instant" });
      gesture = {
        pointer: event.pointerId, x: event.clientX, y: event.clientY,
        left: position, index: Math.max(0, Math.min(count - 1, Math.round(rail.scrollLeft / rail.clientWidth))),
        width: rail.clientWidth, horizontal: false, delta: 0,
        samples: [{ position, time: event.timeStamp }],
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
      g.delta = dx;
      const x = resistedPosition(g.left - dx, Math.max(0, g.index - 1) * g.width, Math.min(count - 1, g.index + 1) * g.width);
      paint(x);
      g.samples.push({ position: x, time: event.timeStamp });
      g.samples = g.samples.filter(s => event.timeStamp - s.time <= 120);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId === gesture?.pointer) finish(true, event.timeStamp);
    };
    const abort = () => finish(false);
    const lost = (event: PointerEvent) => {
      if (event.target === rail && event.pointerId === gesture?.pointer) abort();
    };
    const resize = () => {
      release(); stop();
      rail.style.removeProperty("--swipe-edge");
      rail.classList.remove("is-dragging");
      position = rail.scrollLeft;
    };
    navigate.current = index => {
      release();
      if (!frame) position = rail.scrollLeft;
      settle(index);
    };
    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move, { passive: false });
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", abort);
    rail.addEventListener("lostpointercapture", lost);
    window.addEventListener("resize", resize);
    return () => {
      release(); stop(); navigate.current = null;
      rail.style.removeProperty("--swipe-edge");
      rail.classList.remove("is-dragging", "has-swipe-control");
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("pointerup", up);
      rail.removeEventListener("pointercancel", abort);
      rail.removeEventListener("lostpointercapture", lost);
      window.removeEventListener("resize", resize);
    };
  }, [railRef, count]);
  return useCallback((index: number) => {
    if (navigate.current) navigate.current(index);
    else railRef.current?.scrollTo({ left: index * railRef.current.clientWidth, behavior: "instant" });
  }, [railRef]);
}
