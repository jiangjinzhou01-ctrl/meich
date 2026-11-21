"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { address, company, phone, phoneHref } from "@/lib/content";
import { englishRoutes } from "@/lib/languages";
import { languagePair } from "@/lib/routes";
import { BrandMark } from "./brand";

const sections = [
  { href: "/cases/", zh: "项目案例", en: "Projects", routes: ["cases", "work", "videos"] },
  { href: "/services/", zh: "业务与产品", en: "Services & products", routes: ["services", "solutions", "products"] },
  { href: "/research/", zh: "研发", en: "Research", routes: ["research", "technology", "culture-ai", "experiences"] },
  { href: "/about/", zh: "关于美创", en: "About MGC", routes: ["about", "insights", "collaboration", "careers"] },
];

export function Navbar() {
  const path = usePathname();
  const en = /^\/en(?:\/|$)/.test(path);
  const prefix = en ? "/en" : "";
  const section = path.slice(prefix.length).split("/")[1];
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const pair = languagePair(path);
  const languageHref = en ? pair.zh : englishRoutes.has(pair.en) ? pair.en : "/en/";
  const languageLabel = en ? "切换中文" : "Switch to English";

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);
  useEffect(() => {
    document.documentElement.lang = en ? "en" : "zh-CN";
    if (dialog.current?.open) {
      dialog.current.close();
      document.body.style.overflow = previousOverflow.current;
      setOpen(false);
    }
  }, [path, en]);

  function theme() {
    const next = dark ? "light" : "dark";
    setDark(!dark);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("meichuang-theme", next);
    } catch {}
  }
  function openMenu() {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    setOpen(true);
  }
  function closeMenu() {
    dialog.current?.close();
    document.body.style.overflow = previousOverflow.current;
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  function followMenuLink(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      closeMenu();
    }
  }
  const themeLabel = dark
    ? en ? "Switch to light theme" : "切换浅色主题"
    : en ? "Switch to dark theme" : "切换深色主题";
  const homeLabel = en ? "MGC Digital home" : "美创数字首页";
  const contactLabel = en ? "Project enquiries" : "项目咨询";

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <Link className="brand" href={prefix + "/"} aria-label={homeLabel}>
            <BrandMark />
          </Link>
          <nav className="desktop-nav" aria-label={en ? "Main navigation" : "主导航"}>
            {sections.map((item) => (
              <Link key={item.href} href={prefix + item.href} prefetch={false}
                aria-current={item.routes.includes(section) ? "page" : undefined}>
                {en ? item.en : item.zh}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link className="language-switch" href={languageHref} aria-label={languageLabel} prefetch={false}>
              {en ? "中文" : "EN"}
            </Link>
            <button className="icon-button theme-toggle" onClick={theme} aria-label={themeLabel}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link className="nav-cta" href={prefix + "/contact/"}>
              {contactLabel}<ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <button ref={trigger} className="icon-button menu-toggle" onClick={openMenu}
              aria-expanded={open} aria-controls="mobile-menu"
              aria-label={en ? "Open navigation" : "打开导航菜单"}>
              <Menu size={23} />
            </button>
          </div>
        </div>
      </header>
      <dialog className="mobile-menu" id="mobile-menu" ref={dialog}
        aria-label={en ? "Site navigation" : "网站导航"}
        onCancel={(event) => { event.preventDefault(); closeMenu(); }}>
        <div className="mobile-top">
          <Link className="brand" href={prefix + "/"} onClick={followMenuLink} aria-label={homeLabel}>
            <BrandMark />
          </Link>
          <button className="icon-button" onClick={closeMenu} autoFocus
            aria-label={en ? "Close navigation" : "关闭导航菜单"}>
            <X size={24} />
          </button>
        </div>
        <nav className="mobile-primary" aria-label={en ? "Main navigation" : "主导航"}>
          {sections.map((item) => (
            <Link key={item.href} href={prefix + item.href} prefetch={false} onClick={followMenuLink}
              aria-current={item.routes.includes(section) ? "page" : undefined}>
              {en ? item.en : item.zh}
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-actions">
          <Link className="nav-cta" href={prefix + "/contact/"} onClick={followMenuLink}>
            {contactLabel}<ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link href={languageHref} onClick={followMenuLink} aria-label={languageLabel}>
            {en ? "简体中文" : "English"}
          </Link>
          <button className="icon-button" onClick={theme} aria-label={themeLabel}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </dialog>
    </>
  );
}

const footerGroups = [
  {
    zh: "项目与业务", en: "Projects and services",
    links: [
      ["/cases/", "项目案例", "Projects"],
      ["/services/", "业务能力", "Services"],
      ["/solutions/", "场景方案", "Solutions"],
      ["/products/", "产品目录", "Products"],
    ],
  },
  {
    zh: "研发与体验", en: "Research and experiences",
    links: [
      ["/research/", "研发方向", "Research"],
      ["/culture-ai/", "Culture × AI", "Culture × AI"],
      ["/videos/", "项目影像", "Films"],
      ["/experiences/", "线上体验", "Online experiences"],
    ],
  },
  {
    zh: "关于美创", en: "About MGC",
    links: [
      ["/about/", "公司与团队", "Company and team"],
      ["/insights/", "美创动态", "News and insights"],
      ["/collaboration/", "人才与协作", "Careers and collaboration"],
      ["/contact/", "项目咨询", "Project enquiries"],
    ],
  },
];

export function Footer() {
  const en = /^\/en(?:\/|$)/.test(usePathname());
  const prefix = en ? "/en" : "";
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-intro">
            <Link className="brand" href={prefix + "/"} aria-label={en ? "MGC Digital home" : "美创数字首页"}>
              <BrandMark />
            </Link>
            <a className="footer-phone" href={phoneHref}>{phone}<ArrowUpRight size={17} aria-hidden="true" /></a>
            <p className="footer-address">{en ? "Building 2, Meixi Lake International R&D Center, 76 Meixihu Road, Changsha, China" : address}</p>
          </div>
          <div className="footer-links">
            {footerGroups.map((group) => (
              <div key={group.en}>
                <h2>{en ? group.en : group.zh}</h2>
                {group.links.map(([href, zh, label]) => (
                  <Link key={href} href={prefix + href} prefetch={false}>{en ? label : zh}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {en ? "MGC Digital" : company}</span>
          <div>
            <Link href={prefix + "/privacy/"}>{en ? "Privacy" : "隐私说明"}</Link>
            <Link href="/admin/">{en ? "Workspace" : "内容工作台"}</Link>
            <button onClick={() => window.scrollTo({ top: 0 })}>{en ? "Back to top ↑" : "回到顶部 ↑"}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { MotionProvider } from "./motion";
