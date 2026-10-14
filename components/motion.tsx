"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/** One reveal observer for the entire shell. Content is readable before hydration. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const restored = useRef(false);
  const restorePosition = useRef<{ x: number; y: number } | null>(null);
  const initialized = useRef(false);
  const routeLocation = useRef("");

  useEffect(() => {
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    let scrollTimer: number | undefined;
    const persistPosition = () => {
      if (restored.current) return;
      try {
        history.replaceState({ ...history.state, __mgcMotionScroll: { x: scrollX, y: scrollY } }, "");
      } catch { history.scrollRestoration = "auto"; }
    };
    const onScroll = () => {
      if (scrollTimer !== undefined) return;
      scrollTimer = window.setTimeout(() => { scrollTimer = undefined; persistPosition(); }, 500);
    };
    const onBack = (event: PopStateEvent) => {
      if (scrollTimer !== undefined) clearTimeout(scrollTimer);
      scrollTimer = undefined;
      restored.current = true;
      restorePosition.current = event.state?.__mgcMotionScroll || null;
      // Also covers same-path history entries, which do not rerun the route effect.
      const position = restorePosition.current, href = location.href;
      const samePath = location.pathname === routeLocation.current;
      if (position) requestAnimationFrame(() => requestAnimationFrame(() => {
        if (location.href !== href) return;
        window.scrollTo({ left: position.x, top: position.y, behavior: "instant" });
        if (samePath) { restored.current = false; restorePosition.current = null; }
      }));
      else if (samePath) restored.current = false;
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      root.current?.querySelectorAll<HTMLElement>(".reveal-ready").forEach((el) => {
        el.classList.add("is-visible");
        el.classList.remove("reveal-ready");
      });
    };
    addEventListener("popstate", onBack);
    addEventListener("pageshow", onPageShow);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("click", persistPosition, true);
    addEventListener("pagehide", persistPosition);
    return () => {
      removeEventListener("popstate", onBack);
      removeEventListener("pageshow", onPageShow);
      removeEventListener("scroll", onScroll);
      removeEventListener("click", persistPosition, true);
      removeEventListener("pagehide", persistPosition);
      if (scrollTimer !== undefined) clearTimeout(scrollTimer);
      history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container) return;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const saved = history.state?.__mgcMotionScroll as { x: number; y: number } | undefined;
    const restoring = restored.current || (!initialized.current && (scrollY > 8 || navigation?.type === "back_forward" || (navigation?.type === "reload" && (saved?.y || 0) > 8)));
    const position = restoring ? restorePosition.current || saved : undefined;
    if (position) window.scrollTo({ left: position.x, top: position.y, behavior: "instant" });
    container.dataset.navigation = restoring ? "restore" : "forward";
    restored.current = false;
    initialized.current = true;
    routeLocation.current = location.pathname;
    restorePosition.current = null;

    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<HTMLElement>();
    const targets = new Map<Element, Set<HTMLElement>>();
    const active = new Set<HTMLElement>();
    const frames = new Set<number>();
    const deadlines = new Map<HTMLElement, number>();
    let observer: IntersectionObserver | undefined;
    let registrationFrame = 0;
    let stopped = false;

    const nextFrame = (callback: () => void) => {
      const id = requestAnimationFrame(() => { frames.delete(id); if (!stopped) callback(); });
      frames.add(id);
    };
    if (position) nextFrame(() => nextFrame(() => window.scrollTo({ left: position.x, top: position.y, behavior: "instant" })));
    const settle = (el: HTMLElement) => {
      el.classList.add("is-visible");
      el.classList.remove("reveal-ready");
      active.delete(el);
      const timeout = deadlines.get(el);
      if (timeout !== undefined) clearTimeout(timeout);
      deadlines.delete(el);
    };
    const reveal = (target: Element) => {
      const items = targets.get(target);
      if (!items) return;
      observer?.unobserve(target);
      targets.delete(target);
      items.forEach((el) => {
        if (!el.isConnected) return;
        // A restoration must never re-hide content the reader has already reached.
        if (preference.matches) { settle(el); return; }
        nextFrame(() => {
          el.classList.add("is-visible");
          deadlines.set(el, window.setTimeout(() => settle(el), 1600));
        });
      });
    };
    const register = () => {
      container.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Immediate entrances are CSS-driven: no second animation on top of them.
        if (el.hasAttribute("data-motion-enter") || el.closest("[data-motion-scope='interaction']")) return;
        if (el.closest("details:not([open])")) { seen.delete(el); return; }
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) { seen.delete(el); return; }
        if (preference.matches || !observer || rect.bottom <= 0 || (restoring && rect.top < innerHeight)) {
          settle(el); return;
        }
        // Completed footer / shared-shell nodes survive client navigation without replay.
        if (el.classList.contains("is-visible")) return;
        const group = el.closest<HTMLElement>("[data-reveal-group]");
        const target = group || el;
        const order = el.dataset.revealOrder === undefined
          ? el.matches(".section-label, .research-label, [data-motion-role='eyebrow']") ? 0
            : el.matches("h1,h2,h3,[data-reveal='media'],[data-reveal='scale']") ? 1
              : el.matches("a,button,[data-reveal='interaction']") ? 3 : 2
          : Number(el.dataset.revealOrder) || 0;
        if (!el.style.getPropertyValue("--motion-delay"))
          el.style.setProperty("--motion-delay", group ? `calc(${Math.min(order, 4)} * var(--motion-stagger))` : "0ms");
        el.classList.add("reveal-ready");
        active.add(el);
        const items = targets.get(target) || new Set<HTMLElement>();
        items.add(el);
        targets.set(target, items);
        observer.observe(target);
        // New content inside an already visible group should not wait for a new IO crossing.
        const bounds = group ? group.getBoundingClientRect() : rect;
        if (bounds.top < innerHeight * .95 && bounds.bottom > 0)
          nextFrame(() => reveal(target));
      });
      // Drop detached tab/route nodes rather than keeping their elements alive.
      targets.forEach((items, target) => {
        items.forEach((el) => { if (!el.isConnected) { items.delete(el); settle(el); } });
        if (!target.isConnected || !items.size) { observer?.unobserve(target); targets.delete(target); }
      });
    };
    try {
      if (typeof IntersectionObserver !== "undefined")
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target); });
        }, { threshold: 0, rootMargin: "0px 0px -5% 0px" });
      register();
    } catch {
      active.forEach(settle);
      observer?.disconnect();
      observer = undefined;
    }
    const schedule = () => {
      if (registrationFrame) return;
      registrationFrame = requestAnimationFrame(() => { registrationFrame = 0; register(); });
    };
    const mutation = new MutationObserver(schedule);
    mutation.observe(container, { childList: true, subtree: true });
    const onToggle = () => schedule();
    const onPreference = () => {
      if (preference.matches) {
        active.forEach(settle);
        observer?.disconnect();
        targets.clear();
      } else schedule();
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === "opacity" && event.target instanceof HTMLElement && event.target.classList.contains("is-visible"))
        settle(event.target);
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement)
        event.target.closest<HTMLElement>(".reveal-ready") && settle(event.target.closest<HTMLElement>(".reveal-ready")!);
    };
    // Visibility recovery releases interrupted work; it never restarts a reveal.
    const recover = () => { if (!document.hidden) active.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) settle(el);
    }); };
    container.addEventListener("toggle", onToggle, true);
    container.addEventListener("transitionend", onEnd);
    container.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", recover);
    preference.addEventListener("change", onPreference);
    return () => {
      stopped = true;
      observer?.disconnect();
      mutation.disconnect();
      frames.forEach(cancelAnimationFrame);
      cancelAnimationFrame(registrationFrame);
      deadlines.forEach(clearTimeout);
      active.forEach(settle);
      container.removeEventListener("toggle", onToggle, true);
      container.removeEventListener("transitionend", onEnd);
      container.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", recover);
      preference.removeEventListener("change", onPreference);
    };
  }, [path]);

  // No key and no wrapper transform: preserve the shell, sticky layout and scroll restoration.
  return <div ref={root} className="motion-root">{children}</div>;
}
