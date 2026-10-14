import type { CSSProperties, ReactNode } from "react";

export type RevealLevel = "cinematic" | "editorial" | "content" | "interaction";

/** Semantic text only; never blurs a section, image, form or large content container. */
export function RevealText({
  as: Tag = "p", level = "content", children, lines, immediate = false,
  delay, className,
}: {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  level?: RevealLevel;
  children?: ReactNode;
  lines?: ReactNode[];
  immediate?: boolean;
  delay?: number;
  className?: string;
}) {
  const attributes = {
    "data-reveal": level,
    "data-motion-enter": immediate ? "" : undefined,
    style: delay === undefined ? undefined : { "--motion-delay": `${delay}ms` } as CSSProperties,
  };
  if (lines) return <Tag className={className} data-reveal-group="lines">
    {lines.map((line, i) => <span className="motion-line" key={i} {...attributes}
      data-reveal-order={i} style={{ "--motion-delay": `${(delay || 0) + i * 110}ms` } as CSSProperties}>{line}</span>)}
  </Tag>;
  return <Tag className={className} {...attributes}>{children}</Tag>;
}

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className} data-reveal-group="">{children}</div>;
}
