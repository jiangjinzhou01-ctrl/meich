import Link from "next/link";
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
      <SectionLabel immediate>{label}</SectionLabel>
      <RevealText as="h1" level="cinematic" immediate delay={90}>{title}</RevealText>
      <div className="page-hero-bottom">
        <RevealText immediate delay={180}>{description}</RevealText>
        {children}
      </div>
    </section>
  );
}
export function ContactCTA({ english = false }: { english?: boolean } = {}) {
  return (
    <section
      className="contact-cta"
      data-scene={english ? "Contact" : "商务合作"}
    >
      <div className="container cta-inner" data-reveal-group>
        <div>
          <p className="cta-kicker" data-reveal="content" data-reveal-order="0">Culture × Technology × AI × Experience</p>
          <h2 data-reveal="editorial">
            {english ? (
              <>
                A meaningful experience.
                <br />A conversation away.
              </>
            ) : (
              <>
                让下一个想法，
                <br />
                成为真实的体验。
              </>
            )}
          </h2>
        </div>
        <Button href={english ? "/en/contact/" : "/contact/"}>
          {english ? "Contact" : "商务合作"}
        </Button>
      </div>
    </section>
  );
}
