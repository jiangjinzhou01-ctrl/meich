import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/content";
import { RevealText } from "./reveal";
export function Button({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-reveal="interaction"
      prefetch={false}
      className={`button ${secondary ? "secondary" : ""} ${className}`}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
export function SectionLabel({
  number,
  children,
  immediate = false,
}: {
  number?: string;
  children: ReactNode;
  immediate?: boolean;
}) {
  return (
    <div className="section-label" data-reveal="content" data-reveal-order="0" data-motion-role="eyebrow" data-motion-enter={immediate ? "" : undefined}>
      <span>{children}</span>
    </div>
  );
}
export function PageHero({
  label,
  title,
  description,
  children,
  path,
}: {
  label: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
  path?: string;
}) {
  const route =
    path ||
    (
      {
        我们的能力: "/services/",
        解决方案: "/solutions/",
        项目探索: "/cases/",
        精选项目: "/cases/",
        关于美创数字: "/about/",
        技术体系: "/research/technology/",
        观点与思考: "/insights/",
        洞察与动态: "/insights/",
        一起创造: "/careers/",
        联系我们: "/contact/",
        隐私说明: "/privacy/",
      } as Record<string, string>
    )[label];
  const english = route?.startsWith("/en/");
  return (
    <section className="page-hero container" data-reveal-group>
      {route && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: english ? "Home" : "首页",
                  item: english ? `${siteUrl}/en/` : siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: typeof title === "string" ? title : label,
                  item: `${siteUrl}${route}`,
                },
              ],
            }),
          }}
        />
      )}
      {label && <SectionLabel immediate>{label}</SectionLabel>}
      <RevealText as="h1" level="cinematic" immediate delay={90}>{title}</RevealText>
      <div className="page-hero-bottom">
        <RevealText immediate delay={180}>{description}</RevealText>
        {children}
      </div>
    </section>
  );
}
export function ContactCTA({
  english = false,
  projectHref,
}: { english?: boolean; projectHref?: string } = {}) {
  return (
    <section className="contact-cta">
      <div className="container cta-inner">
        <div>
          <h2>{english ? "Planning a cultural project?" : "正在筹备文化项目？"}</h2>
          <p>{english ? "Tell us about your venue, your audience and what you want to make." : "说说你的场地、观众和想做的事，一起梳理项目需求。"}</p>
        </div>
        <Link className="button" href={projectHref || (english ? "/en/contact/" : "/contact/")}>
          {projectHref
            ? english ? "Discuss a similar project" : "咨询类似项目"
            : english ? "Discuss a project" : "咨询项目"}
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
