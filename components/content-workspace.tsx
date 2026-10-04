"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Download, Upload, Save, Trash2 } from "lucide-react";
import { asset } from "@/lib/content";
import { ContentDraft, DraftKind, isContentDraft, newContentDraft } from "@/lib/content-drafts";

const storageKey = "mgc-editor-drafts-v1";
export function ContentWorkspace() {
  const [draft, setDraft] = useState<ContentDraft>(() => newContentDraft("project"));
  const [saved, setSaved] = useState<ContentDraft[]>([]);
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(false);
  const [revision, setRevision] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const importInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(data)) setSaved(data.filter(isContentDraft));
    } catch { setNotice("暂时无法读取本机草稿，可以使用 JSON 导入内容。"); }
  }, []);
  function change(key: "title" | "slug" | "summary" | "category" | "date" | "location", value: string) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  function kind(value: DraftKind) {
    setDraft(current => ({ ...current, kind: value, category: value === "project" ? "数字展示" : "企业动态" }));
    setRevision(value => value + 1);
  }
  function persist(items: ContentDraft[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      setSaved(items);
      return true;
    } catch { setNotice("草稿未能保存。图片可能较大，请改用图片地址，或下载 JSON 保留内容。"); return false; }
  }
  function save() {
    if (!validate()) return;
    const current = { ...draft, updatedAt: new Date().toISOString() };
    if (persist([current, ...saved.filter(d => d.id !== current.id)])) {
      setDraft(current);
      setNotice("草稿已保存到当前浏览器，尚未发布到官网。");
    }
  }
  function download() {
    if (!validate()) return;
    const current = { ...draft, updatedAt: new Date().toISOString() };
    const url = URL.createObjectURL(new Blob([JSON.stringify(current, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `mgc-${current.kind}-${current.slug}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("内容 JSON 已下载，可以用于后续后台接入或草稿备份。");
  }
  function validate() {
    if (form.current?.checkValidity()) return true;
    setPreview(false);
    setNotice("请先填写标题、URL 标识、简介和分类。");
    window.requestAnimationFrame(() => form.current?.reportValidity());
    return false;
  }
  async function importDraft(file?: File) {
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error();
      const data: unknown = JSON.parse(await file.text());
      if (!isContentDraft(data)) throw new Error();
      setDraft(data);
      setPreview(false);
      setNotice("内容已导入，可继续编辑；保存后才会写入本机草稿。");
    } catch { setNotice("文件格式不匹配，请导入从此工作台下载的内容 JSON。"); }
  }
  function uploadCover(file?: File) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type) || file.size > 2 * 1024 * 1024) {
      setNotice("请选择不超过 2MB 的 JPG、PNG、WebP 或 AVIF 预览图；也可以填写正式图片地址。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft(current => ({ ...current, cover: { ...current.cover, url: String(reader.result) } }));
      setNotice("封面已加入草稿预览。");
    };
    reader.onerror = () => setNotice("图片未能读取，请重新选择文件。");
    reader.readAsDataURL(file);
  }
  return (
    <section className="content-workspace container">
      <div className="content-workspace-heading">
        <Link href="/admin/" className="text-link">品牌工作台 <ArrowUpRight size={16} /></Link>
        <h1 className="page-title-motion">让内容，长成新的表达。</h1>
        <p>项目与新闻的编辑和预览。草稿保存在当前浏览器，正式审核与发布待后台接入。</p>
      </div>
      <div className="content-workspace-toolbar">
        <div role="tablist" aria-label="内容类型">
          {(["project", "insight"] as const).map(value => (
            <button key={value} role="tab" id={`editor-${value}`} aria-controls="content-editor" aria-selected={draft.kind === value}
              tabIndex={draft.kind === value ? 0 : -1} onClick={() => kind(value)}
              onKeyDown={event => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  const next = value === "project" ? "insight" : "project";
                  kind(next); document.getElementById(`editor-${next}`)?.focus();
                }
              }}>{value === "project" ? "项目案例" : "新闻与洞察"}</button>
          ))}
        </div>
        <div className="content-tools">
          <button type="button" onClick={() => { setDraft(newContentDraft(draft.kind)); setPreview(false); setNotice("已新建空白草稿。"); }}><Plus size={16} />新建</button>
          <button type="button" onClick={() => importInput.current?.click()}><Upload size={16} />导入 JSON</button>
          <input ref={importInput} type="file" accept=".json,application/json" hidden onChange={event => { void importDraft(event.target.files?.[0]); event.target.value = ""; }} />
        </div>
      </div>
      <div className="content-editor-grid">
        <aside className="content-draft-list" aria-label="本机草稿">
          <h2>本机草稿 <span>{saved.length}</span></h2>
          {saved.length === 0 && <p>保存的内容会出现在这里。</p>}
          {saved.map(item => (
            <div key={item.id} className={draft.id === item.id ? "selected" : ""}>
              <button type="button" onClick={() => { setDraft(item); setPreview(false); setNotice("已打开本机草稿。"); }}>
                <small>{item.kind === "project" ? "项目" : "新闻"} · {item.date || "未填写日期"}</small>
                <strong>{item.title}</strong>
              </button>
              <button type="button" aria-label={`删除草稿：${item.title}`} onClick={() => {
                if (persist(saved.filter(d => d.id !== item.id))) setNotice("已删除本机草稿。");
              }}><Trash2 size={15} /></button>
            </div>
          ))}
        </aside>
        <div id="content-editor" role="tabpanel" aria-labelledby={`editor-${draft.kind}`}>
          <div className="content-mode-switch">
            <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>编辑内容</button>
            <button type="button" aria-pressed={preview} onClick={() => { setPreview(true); setRevision(r => r + 1); }}>查看页面预览 <ArrowUpRight size={16} /></button>
          </div>
          <form ref={form} onSubmit={event => { event.preventDefault(); save(); }} className={preview ? "content-editor-form preview-mode" : "content-editor-form"}>
            <div className="content-fields">
              <label>标题<input required maxLength={100} value={draft.title} onChange={e => change("title", e.target.value)} placeholder="项目或文章的正式标题" /></label>
              <label>URL 标识<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} value={draft.slug} onChange={e => change("slug", e.target.value)} placeholder="例如 liye-qin-slips" /><small>使用小写英文、数字与短横线。</small></label>
              <label className="content-field-wide">简介<textarea required maxLength={300} rows={3} value={draft.summary} onChange={e => change("summary", e.target.value)} placeholder="用一段话交代文化内容、项目背景或文章主题。" /></label>
              <label>分类<input required value={draft.category} onChange={e => change("category", e.target.value)} /></label>
              <label>日期<input type="date" value={draft.date} onChange={e => change("date", e.target.value)} /></label>
              {draft.kind === "project" && <label className="content-field-wide">项目地点<input value={draft.location} onChange={e => change("location", e.target.value)} placeholder="以经确认的项目资料填写" /></label>}
              <label className="content-field-wide">封面地址<input value={draft.cover.url.startsWith("data:") ? "" : draft.cover.url} onChange={e => setDraft(current => ({ ...current, cover: { ...current.cover, url: e.target.value } }))} placeholder="https://… 或网站图片路径" /></label>
              <label>上传封面预览图<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => { uploadCover(event.target.files?.[0]); event.target.value = ""; }} /><small>本机草稿预览图最大 2MB。</small></label>
              <label>图片说明<input value={draft.cover.alt} onChange={e => setDraft(current => ({ ...current, cover: { ...current.cover, alt: e.target.value } }))} placeholder="描述真实画面，供无障碍阅读使用" /></label>
            </div>
            <div className="content-sections">
              <h2>{draft.kind === "project" ? "项目叙事" : "文章正文"}</h2>
              {draft.sections.map((section, i) => (
                <fieldset key={i}>
                  <legend>第 {i + 1} 段</legend>
                  <label>章节标题<input value={section.heading} onChange={e => setDraft(current => ({ ...current, sections: current.sections.map((s, n) => n === i ? { ...s, heading: e.target.value } : s) }))} placeholder={draft.kind === "project" ? "例如：文化起点、数字设计、现场体验" : "可留空"} /></label>
                  <label>正文<textarea rows={5} value={section.body} onChange={e => setDraft(current => ({ ...current, sections: current.sections.map((s, n) => n === i ? { ...s, body: e.target.value } : s) }))} placeholder="段落之间使用空行分隔。" /></label>
                  {draft.sections.length > 1 && <button type="button" className="text-link" onClick={() => setDraft(current => ({ ...current, sections: current.sections.filter((_, n) => n !== i) }))}>删除此段 <Trash2 size={14} /></button>}
                </fieldset>
              ))}
              <button type="button" className="text-link" onClick={() => setDraft(current => ({ ...current, sections: [...current.sections, { heading: "", body: "" }] }))}>添加叙事段落 <Plus size={16} /></button>
            </div>
            <div className="content-save-actions">
              <button type="button" className="button" onClick={save}><Save size={17} />保存本机草稿</button>
              <button type="button" className="text-link" onClick={download}><Download size={17} />下载内容 JSON</button>
            </div>
          </form>
          {preview && <article className="content-page-preview" key={`${draft.id}-${revision}`} aria-label="内容页面预览">
            <div className={`content-preview-hero ${draft.kind}`}>
              <img src={draft.cover.url || asset("/brand/gaomiao.webp")} alt={draft.cover.alt || (draft.cover.url ? "内容封面预览" : "高庙遗址博物馆示例素材，尚未设置内容封面")} />
              <div>
                <span>{draft.category} / {draft.kind === "project" ? "PROJECT" : "INSIGHT"}</span>
                <h2>{draft.title || "给文化，一种新的表达。"}</h2>
                <p>{draft.summary || "填写简介后，在这里查看内容与画面如何共同进入页面。"}</p>
              </div>
            </div>
            <div className="content-preview-body">
              <p className="content-preview-meta">{[draft.location, draft.date].filter(Boolean).join(" · ") || "内容预览 / 未发布"}</p>
              {!draft.cover.url && <p className="content-preview-note">当前封面为已有项目的示例素材，请为新内容设置真实封面。</p>}
              {draft.sections.map((section, i) => <section key={i}>
                {section.heading && <h3>{section.heading}</h3>}
                {(section.body || "在编辑界面添加正文，即可预览段落节奏。").split(/\n\s*\n/).map((text, n) => <p key={n}>{text}</p>)}
              </section>)}
              <Link className="text-link" href={draft.kind === "project" ? "/cases/" : "/insights/"}>查看现有{draft.kind === "project" ? "案例" : "新闻"}版式 <ArrowUpRight size={16} /></Link>
            </div>
          </article>}
          <p className="content-editor-notice" role="status" aria-live="polite">{notice || "草稿与预览不会更改官网线上内容。"}</p>
        </div>
      </div>
    </section>
  );
}
