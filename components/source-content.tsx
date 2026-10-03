import Link from "next/link";
import {
  sourceImage,
  sourceLink,
  type SourcePage,
  type SourceBlock,
} from "@/lib/source";
import { sourceSite } from "@/lib/content";
export function SourceContent({
  page,
  blocks = page.blocks,
}: {
  page: SourcePage;
  blocks?: SourceBlock[];
}) {
  const usedIds = new Set<string>();
  function headingId(id?: string) {
    if (!id || usedIds.has(id)) return undefined;
    usedIds.add(id);
    return id;
  }
  const cardTitles = new Set(page.cards.map((c) => c.title));
  return (
    <div className="source-content">
      {blocks.map((b, i) => {
        const key = `${b.type}-${i}`;
        if (b.type === "h2")
          return (
            <h2 key={key} id={headingId(b.id)}>
              {b.text}
            </h2>
          );
        if (b.type === "h3")
          return (
            <h3 key={key} id={headingId(b.id)}>
              {b.text}
            </h3>
          );
        if (b.type === "p")
          return b.text === page.description ||
            cardTitles.has(b.text || "") ? null : (
            <p key={key}>{b.text}</p>
          );
        if (b.type === "image" && b.src)
          return (
            <figure key={key}>
              <a
                href={b.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`${page.lang === "en" ? "View original image" : "查看原图"}：${b.alt}`}
              >
                <img
                  src={sourceImage(b.src)}
                  alt={b.alt || page.title}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>{b.alt}</figcaption>
            </figure>
          );
        if (b.type === "video" && b.src)
          return (
            <figure key={key}>
              <video
                controls
                playsInline
                preload="none"
                poster={b.poster ? sourceImage(b.poster) : undefined}
                aria-label={page.title}
              >
                <source src={b.src} type="video/mp4" />
                {page.lang === "en"
                  ? "Your browser cannot play this video."
                  : "浏览器暂不支持内嵌视频。"}
              </video>
              <figcaption>
                <a href={b.src} target="_blank" rel="noreferrer">
                  {page.lang === "en"
                    ? "Watch in a new window"
                    : "独立窗口观看"}{" "}
                  ↗
                </a>
              </figcaption>
            </figure>
          );
        if (b.type === "embed" && b.src)
          return (
            <div className="source-embed" key={key}>
              <iframe
                src={b.src}
                title={b.title || page.title}
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
              />
              <a
                className="text-link"
                href={b.src}
                target="_blank"
                rel="noreferrer"
              >
                {page.lang === "en" ? "Open experience" : "打开体验"} ↗
              </a>
            </div>
          );
        if (b.type === "ul" || b.type === "ol" || b.type === "facts") {
          const Tag = b.type === "ol" ? "ol" : "ul";
          return (
            <Tag key={key}>
              {b.items?.map((x, j) => (
                <li key={j}>{x}</li>
              ))}
            </Tag>
          );
        }
        if (b.type === "details")
          return (
            <details key={key}>
              <summary>{b.title}</summary>
              <p>{b.text}</p>
            </details>
          );
        if (b.type === "table")
          return (
            <div className="source-table" key={key}>
              <table>
                <tbody>
                  {b.rows?.map((r, j) => (
                    <tr key={j}>
                      {r.map((v, k) => (
                        <td key={k}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        if (b.type === "link" && b.href) {
          if (page.cards.some((c) => b.href?.endsWith(c.path))) return null;
          const href = sourceLink(b.href);
          const external = /^https?:/.test(href);
          return (
            <p key={key}>
              {external ? (
                <a
                  className="text-link source-action"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {b.text}
                </a>
              ) : (
                <Link
                  className="text-link source-action"
                  href={
                    href.startsWith("/meich/")
                      ? href.slice("/meich".length)
                      : href
                  }
                >
                  {b.text}
                </Link>
              )}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}
export function OriginalSubmission({
  path,
  english = false,
  research = false,
  contact = false,
}: {
  path: string;
  english?: boolean;
  research?: boolean;
  contact?: boolean;
}) {
  return (
    <section
      className="submission-portal"
      id={research ? "participate" : contact ? "cooperate" : "partner-apply"}
    >
      <h2>
        {english
          ? "Start a conversation"
          : research
            ? "参与这项探索。"
            : "向我们介绍你。"}
      </h2>
      <p>
        {english
          ? "Use MGC’s existing secure submission service. Your application remains connected to the current team workflow."
          : "通过美创现有正式收件服务提交资料，申请与后续跟进继续进入品牌工作台。"}
      </p>
      <a
        className="button"
        href={`${sourceSite}${path}${research ? "#participate" : contact ? "#cooperate" : "#partner-apply"}`}
        target="_blank"
        rel="noreferrer"
      >
        {english
          ? "Open application"
          : research
            ? "进入研发参与报名"
            : "提交生态伙伴申请"}{" "}
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
