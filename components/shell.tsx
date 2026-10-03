"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { RouteLoading } from "./loading";
import { BrandMark } from "./brand";
import { englishRoutes } from "@/lib/languages";
import { company, navigation } from "@/lib/content";
export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const english = path.startsWith("/en");
  const moreLinks = [
    {
      label: english ? "Experiences" : "体验与探索",
      href: english ? "/en/experiences/" : "/experiences/",
    },
    {
      label: english ? "Research" : "创新与研发",
      href: english ? "/en/research/" : "/research/",
    },
    {
      label: english ? "Collaboration" : "协作与共创",
      href: english ? "/en/collaboration/" : "/collaboration/",
    },
    {
      label: english ? "Films" : "视频中心",
      href: english ? "/en/videos/" : "/videos/",
    },
    {
      label: english ? "Insights" : "洞察与动态",
      href: english ? "/en/insights/" : "/insights/",
    },
  ];
  const enNav = [
    { label: "Home", href: "/en/" },
    { label: "Services", href: "/en/products/" },
    { label: "Work", href: "/en/cases/" },
    { label: "About", href: "/en/about/" },
  ];
  const primaryLinks = english ? enNav : navigation;
  const zhPath = path.replace(/^\/en/, "") || "/";
  const languageCandidate = english
    ? `${zhPath.replace(/\/$/, "")}/`
    : path === "/"
      ? "/en/"
      : (
          {
            "/services/": "/en/products/",
            "/solutions/": "/en/products/",
            "/work/": "/en/cases/",
            "/technology/": "/en/research/",
            "/careers/": "/en/contact/",
            "/insights/kongwu-museum-store/": "/en/insights/",
            "/insights/malanshan-exhibition/": "/en/insights/",
            "/insights/culture-in-experience/": "/en/insights/",
            "/work/liye-qin-slips/": "/en/cases/brochure-2026-liye-qin-slips/",
            "/work/potala-snow-city/":
              "/en/cases/brochure-2026-potala-snow-city/",
            "/work/gaomiao/": "/en/cases/gaomiao/",
          } as Record<string, string>
        )[path] || `/en${path}`;
  const languagePath = english
    ? languageCandidate
    : englishRoutes.has(languageCandidate)
      ? languageCandidate
      : englishRoutes.has(`/en/${path.split("/")[1]}/`)
        ? `/en/${path.split("/")[1]}/`
        : "/en/";
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();
  const previous = useRef(0);
  const navState = useRef({ scrolled: false, hidden: false });
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = { scrolled: y > 24, hidden: y > 450 && y > previous.current };
    if (next.scrolled !== navState.current.scrolled) setScrolled(next.scrolled);
    if (next.hidden !== navState.current.hidden) setHidden(next.hidden);
    navState.current = next;
    previous.current = y;
  });
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  useEffect(() => {
    setOpen(false);
    setNavigating(false);
  }, [path]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !a ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        a.target === "_blank" ||
        a.hasAttribute("download")
      )
        return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname)
        return;
      clearTimeout(timer);
      timer = setTimeout(() => setNavigating(true), 250);
    };
    document.addEventListener("click", click);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", click);
    };
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(
      () => menu.current?.querySelector<HTMLElement>("a")?.focus(),
      80,
    );
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const items = Array.from(
          menu.current?.querySelectorAll<HTMLElement>("a,button") || [],
        );
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  function theme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("meichuang-theme", next ? "dark" : "light");
    } catch {}
  }
  return (
    <>
      {navigating && <RouteLoading />}
      <header
        className={`navbar ${scrolled ? "scrolled" : ""} ${hidden && !open ? "nav-hidden" : ""}`}
      >
        <div className="nav-inner container">
          <Link className="brand" href="/" aria-label={`${company}，首页`}>
            <BrandMark />
          </Link>
          <nav className="desktop-nav" aria-label="主导航">
            {primaryLinks.map((n) => (
              <Link
                key={n.href}
                className={path === n.href ? "active" : ""}
                href={n.href}
                aria-current={path === n.href ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
            <details className="nav-more">
              <summary>{english ? "Explore" : "更多"}</summary>
              <div>
                {moreLinks.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={(e) =>
                      e.currentTarget
                        .closest("details")
                        ?.removeAttribute("open")
                    }
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </details>
          </nav>
          <div className="nav-actions">
            <Link
              className="language-switch"
              href={languagePath}
              aria-label={english ? "切换中文" : "Switch to English"}
            >
              {english ? "中" : "EN"}
            </Link>
            <button
              className="icon-button"
              onClick={theme}
              aria-label={dark ? "切换浅色主题" : "切换深色主题"}
            >
              {dark ? (
                <Sun size={19} aria-hidden="true" />
              ) : (
                <Moon size={19} aria-hidden="true" />
              )}
            </button>
            <Link
              href={english ? "/en/contact/" : "/contact/"}
              className="nav-cta"
            >
              {english ? "Let’s talk" : "商务合作"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
            <button
              ref={toggle}
              className="icon-button menu-toggle"
              onClick={() => setOpen(true)}
              aria-label="打开导航菜单"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <div
        className={`mobile-menu ${open ? "open" : ""}`}
        id="mobile-menu"
        ref={menu}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-label="网站导航"
        inert={!open}
      >
        <div className="mobile-top">
          <span>美创数字</span>
          <button
            className="icon-button"
            aria-label="关闭导航菜单"
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <nav>
          {[
            ...primaryLinks,
            ...moreLinks,
            ...(!english
              ? [
                  { label: "技术能力", href: "/technology/" },
                  { label: "加入我们", href: "/careers/" },
                ]
              : []),
            {
              label: english ? "Contact" : "联系我们",
              href: english ? "/en/contact/" : "/contact/",
            },
          ].map((n, i) => (
            <Link
              href={n.href}
              key={n.href}
              style={{ transitionDelay: `${open ? i * 25 : 0}ms` }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-bottom">CULTURE × CREATION</div>
      </div>
    </>
  );
}
export function Footer() {
  const english = usePathname().startsWith("/en");
  const groups = english
    ? [
        {
          title: "Explore",
          items: [
            ["Products", "/en/products/"],
            ["Projects", "/en/cases/"],
            ["Films", "/en/videos/"],
            ["Experiences", "/en/experiences/"],
            ["Research", "/en/research/"],
          ],
        },
        {
          title: "MGC",
          items: [
            ["About", "/en/about/"],
            ["Insights", "/en/insights/"],
            ["Contact", "/en/contact/"],
          ],
        },
        {
          title: "Connect",
          items: [
            ["Collaboration", "/en/collaboration/"],
            ["Brand workspace", "/admin/"],
            ["Privacy", "/en/privacy/"],
          ],
        },
      ]
    : [
        {
          title: "探索",
          items: [
            ["服务能力", "/services/"],
            ["产品目录", "/products/"],
            ["完整案例库", "/cases/"],
            ["视频中心", "/videos/"],
            ["体验与探索", "/experiences/"],
            ["创新与研发", "/research/"],
          ],
        },
        {
          title: "美创",
          items: [
            ["关于我们", "/about/"],
            ["洞察与动态", "/insights/"],
            ["加入我们", "/careers/"],
            ["联系我们", "/contact/"],
          ],
        },
        {
          title: "合作",
          items: [
            ["生态合作伙伴", "/collaboration/"],
            ["品牌工作台 ↗", "/admin/"],
            ["隐私说明", "/privacy/"],
          ],
        },
      ];
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link
              href="/"
              className="brand footer-brand"
              aria-label="美创数字，返回首页"
            >
              <BrandMark />
            </Link>
            <p>
              {english ? (
                <>
                  Connecting culture and technology.
                  <br />
                  Creating meaningful experiences.
                </>
              ) : (
                <>
                  连接文化与科技，
                  <br />
                  让文化成为可感知的体验。
                </>
              )}
            </p>
          </div>
          <div className="footer-links">
            {groups.map((g) => (
              <div key={g.title}>
                <span>{g.title}</span>
                {g.items.map(([label, href]) => (
                  <Link key={href} href={href}>
                    {label}
                  </Link>
                ))}
                {g === groups[2] && (
                  <>
                    <a href="tel:+8673189728572">0731-89728572</a>
                    <button
                      onClick={() =>
                        window.scrollTo({
                          top: 0,
                          behavior: matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "instant"
                            : "smooth",
                        })
                      }
                    >
                      {english ? "Back to top ↑" : "回到顶部 ↑"}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">
          MGC DIGITAL
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company}
          </span>
          <span>CULTURE × DESIGN × TECHNOLOGY</span>
        </div>
      </div>
    </footer>
  );
}
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const targets = new Map<Element, Set<Element>>();
    const registered = new WeakSet<Element>();
    // Observe the unclipped parent: a fully clipped element has no intersection.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          targets
            .get(entry.target)
            ?.forEach((element) => element.classList.add("is-visible"));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.04 },
    );
    const register = () => {
      container.querySelectorAll("[data-reveal]").forEach((element) => {
        if (registered.has(element)) return;
        registered.add(element);
        const parent = element.parentElement;
        if (!parent) return;
        const items = targets.get(parent) || new Set<Element>();
        items.add(element);
        targets.set(parent, items);
        element.classList.add("reveal-ready");
        observer.observe(parent);
      });
    };
    register();
    const mutation = new MutationObserver(register);
    mutation.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [path]);
  return (
    <div ref={root} className="route-content" key={path}>
      {children}
    </div>
  );
}
