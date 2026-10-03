"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, X, ArrowUpRight } from "lucide-react";
import { BrandMark } from "./brand";
import { company, navigation, phone, phoneHref, address } from "@/lib/content";
import { englishRoutes } from "@/lib/languages";
import { languagePair } from "@/lib/routes";

export function Navbar() {
  const path = usePathname();
  const en = path.startsWith("/en");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dark, setDark] = useState(false);
  const [scene, setScene] = useState("");
  const [tone, setTone] = useState("light");
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const links = en
    ? [
        { label: "Expertise", href: "/en/services/" },
        { label: "Work", href: "/en/cases/" },
        { label: "Culture × AI", href: "/en/culture-ai/" },
        { label: "Research", href: "/en/research/" },
        { label: "About", href: "/en/about/" },
      ]
    : navigation;
  const pair = languagePair(path);
  const candidate = en ? pair.zh : pair.en;
  const addedEn = [
    "/en/services/",
    "/en/solutions/",
    "/en/culture-ai/",
    "/en/research/",
    "/en/research/technology/",
  ];
  const languageHref =
    en || englishRoutes.has(candidate) || addedEn.includes(candidate)
      ? candidate
      : "/en/";
  const more = en
    ? [
        ["Solutions", "/en/solutions/"],
        ["Products", "/en/products/"],
        ["Insights", "/en/insights/"],
        ["Films", "/en/videos/"],
        ["Experiences", "/en/experiences/"],
        ["Collaboration", "/en/collaboration/"],
      ]
    : [
        ["解决方案", "/solutions/"],
        ["产品目录", "/products/"],
        ["洞察与动态", "/insights/"],
        ["视频中心", "/videos/"],
        ["线上体验", "/experiences/"],
        ["人才与协作", "/collaboration/"],
      ];
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  useEffect(() => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setClosing(false);
    setOpen(false);
    document.documentElement.lang = en ? "en" : "zh-CN";
  }, [path, en]);
  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);
  useEffect(() => {
    if (!dialog.current) return;
    if (open) dialog.current.showModal();
    else dialog.current.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    let observer: IntersectionObserver;
    const connect = () => {
      observer?.disconnect();
      const nodes = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
      const update = () => {
        const current = nodes
          .filter(
            (n) =>
              n.getBoundingClientRect().top <= 85 &&
              n.getBoundingClientRect().bottom > 75,
          )
          .at(-1);
        setScene(current?.dataset.scene || "");
        setTone(current?.dataset.navTone || "light");
      };
      observer = new IntersectionObserver(update, {
        rootMargin: `0px 0px -${Math.max(0, innerHeight - 86)}px 0px`,
        threshold: 0,
      });
      nodes.forEach((n) => observer.observe(n));
      update();
    };
    connect();
    addEventListener("resize", connect);
    return () => {
      observer?.disconnect();
      removeEventListener("resize", connect);
    };
  }, [path]);
  function theme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("meichuang-theme", next ? "dark" : "light");
    } catch {}
  }
  function finishClose() {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    dialog.current?.close();
    setClosing(false);
    setOpen(false);
    toggle.current?.focus();
  }
  function close() {
    if (closing) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(finishClose, 400);
  }
  function openMenu() {
    const rect = toggle.current?.getBoundingClientRect();
    if (!rect || !dialog.current) return;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 4;
    dialog.current.style.setProperty("--menu-x", `${x}px`);
    dialog.current.style.setProperty("--menu-y", `${y}px`);
    dialog.current.style.setProperty("--menu-radius", `${radius}px`);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setClosing(false);
    setOpen(true);
  }
  return (
    <>
      <header className="navbar" data-tone={tone}>
        <div className="nav-inner container">
          <Link
            className="brand"
            href={en ? "/en/" : "/"}
            aria-label={`${company}，首页`}
            prefetch={false}
          >
            <BrandMark />
          </Link>
          <span className="nav-location" aria-hidden="true">
            {scene}
          </span>
          <nav
            className="desktop-nav"
            aria-label={en ? "Main navigation" : "主导航"}
          >
            {links.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                prefetch={false}
                className={path.startsWith(n.href) ? "active" : ""}
                aria-current={path.startsWith(n.href) ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link
              className="language-switch"
              href={languageHref}
              prefetch={false}
              aria-label={en ? "切换中文" : "Switch to English"}
            >
              {en ? "中" : "EN"}
            </Link>
            <button
              className="icon-button theme-toggle"
              onClick={theme}
              aria-label={dark ? "切换浅色主题" : "切换深色主题"}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              href={en ? "/en/contact/" : "/contact/"}
              className="nav-cta"
              prefetch={false}
            >
              {en ? "Contact" : "商务合作"}
              <ArrowUpRight size={16} />
            </Link>
            <button
              ref={toggle}
              className="icon-button menu-toggle"
              onClick={openMenu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={en ? "Open navigation" : "打开导航菜单"}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <dialog
        className="mobile-menu"
        ref={dialog}
        id="mobile-menu"
        data-closing={closing}
        aria-label={en ? "Site navigation" : "网站导航"}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && closing) finishClose();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className="mobile-top">
          <BrandMark />
          <button
            className="icon-button"
            onClick={close}
            aria-label={en ? "Close navigation" : "关闭导航菜单"}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mobile-primary">
          {links.map((n) => (
            <Link href={n.href} key={n.href} onClick={close} prefetch={false}>
              {n.label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
        <details className="mobile-secondary">
          <summary>{en ? "More from MGC" : "更多探索"}</summary>
          <div>
            {more.map(([label, href]) => (
              <Link href={href} key={href} onClick={close} prefetch={false}>
                {label}
              </Link>
            ))}
          </div>
        </details>
        <Link
          className="button mobile-contact"
          href={en ? "/en/contact/" : "/contact/"}
          onClick={close}
          prefetch={false}
        >
          {en ? "Contact" : "商务合作"}
          <ArrowUpRight size={18} />
        </Link>
        <div className="mobile-bottom">
          <Link href={languageHref} onClick={close}>
            {en ? "简体中文" : "English"}
          </Link>
          <button onClick={theme}>
            {dark
              ? en
                ? "Light mode"
                : "浅色模式"
              : en
                ? "Dark mode"
                : "深色模式"}
          </button>
        </div>
      </dialog>
    </>
  );
}

export function Footer() {
  const en = usePathname().startsWith("/en");
  const prefix = en ? "/en" : "";
  const groups = [
    {
      title: en ? "Explore" : "体验与能力",
      items: [
        [en ? "Expertise" : "服务能力", `${prefix}/services/`],
        [en ? "Solutions" : "解决方案", `${prefix}/solutions/`],
        [en ? "Products" : "产品目录", `${prefix}/products/`],
        [en ? "Work" : "项目案例", `${prefix}/cases/`],
      ],
    },
    {
      title: en ? "Culture × AI" : "文化与技术",
      items: [
        ["Culture × AI", `${prefix}/culture-ai/`],
        [en ? "Research" : "创新与研发", `${prefix}/research/`],
        [en ? "Films" : "视频中心", `${prefix}/videos/`],
        [en ? "Experiences" : "线上体验", `${prefix}/experiences/`],
      ],
    },
    {
      title: en ? "MGC" : "关于美创",
      items: [
        [en ? "About" : "公司与团队", `${prefix}/about/`],
        [en ? "Insights" : "洞察与动态", `${prefix}/insights/`],
        [en ? "Collaboration" : "协作与共创", `${prefix}/collaboration/`],
        [en ? "Contact" : "商务合作", `${prefix}/contact/`],
      ],
    },
  ];
  return (
    <footer className="footer" data-scene={en ? "MGC" : "美创数字"}>
      <div className="container">
        <div className="footer-top">
          <div className="footer-intro">
            <Link
              href={en ? "/en/" : "/"}
              className="brand footer-brand"
              aria-label="美创数字，首页"
            >
              <BrandMark />
            </Link>
            <p>
              {en
                ? "Culture, understood. Experience, reimagined."
                : "文化的深度，AI 的新表达。"}
            </p>
            <a className="footer-phone" href={phoneHref}>
              {phone}
              <ArrowUpRight size={20} />
            </a>
            <p className="footer-address">
              {en
                ? "76 Meixihu Road, Building 2, Meixihu International R&D Center, Changsha, China"
                : address}
            </p>
          </div>
          <div className="footer-links">
            {groups.map((g) => (
              <div key={g.title}>
                <span>{g.title}</span>
                {g.items.map(([label, href]) => (
                  <Link key={href} href={href} prefetch={false}>
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">
          Culture × AI
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company}
          </span>
          <div>
            <Link href={`${prefix}/privacy/`}>
              {en ? "Privacy" : "隐私说明"}
            </Link>
            <Link href="/admin/">
              {en ? "Brand workspace" : "品牌工作台"} ↗
            </Link>
            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "instant"
                    : "smooth",
                })
              }
            >
              {en ? "Back to top" : "回到顶部"} ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Progressive reveal: server-rendered content stays visible until observers are ready. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.05 },
    );
    const seen = new WeakSet<Element>();
    const register = () =>
      container.querySelectorAll("[data-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < innerHeight) {
          el.classList.add("is-visible");
          return;
        }
        el.classList.add("reveal-ready");
        observer.observe(el);
      });
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
