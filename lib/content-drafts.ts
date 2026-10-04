/** Shared editorial contract. The current UI stores drafts locally; a CMS can implement persistence later. */
export type DraftKind = "project" | "insight";
export type ContentDraft = {
  schemaVersion: 1;
  id: string;
  kind: DraftKind;
  status: "draft";
  title: string;
  slug: string;
  summary: string;
  category: string;
  date: string;
  location: string;
  cover: { url: string; alt: string };
  sections: { heading: string; body: string }[];
  updatedAt: string;
};
export function newContentDraft(kind: DraftKind): ContentDraft {
  return {
    schemaVersion: 1,
    id: globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    kind,
    status: "draft",
    title: "",
    slug: "",
    summary: "",
    category: kind === "project" ? "数字展示" : "企业动态",
    date: "",
    location: "",
    cover: { url: "", alt: "" },
    sections: [{ heading: "", body: "" }],
    updatedAt: new Date().toISOString(),
  };
}
export function isContentDraft(value: unknown): value is ContentDraft {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  const cover = d.cover as Record<string, unknown> | undefined;
  return d.schemaVersion === 1 && d.status === "draft" &&
    (d.kind === "project" || d.kind === "insight") &&
    ["id", "title", "slug", "summary", "category", "date", "location", "updatedAt"].every(key => typeof d[key] === "string") &&
    !!cover && typeof cover.url === "string" && typeof cover.alt === "string" &&
    Array.isArray(d.sections) && d.sections.every(s => s && typeof s.heading === "string" && typeof s.body === "string");
}
