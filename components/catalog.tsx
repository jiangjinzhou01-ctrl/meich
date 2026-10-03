"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { CatalogItem, CatalogFilter } from "@/lib/source";
export function Catalog({
  items,
  filters = [],
  english = false,
}: {
  items: CatalogItem[];
  filters?: CatalogFilter[];
  english?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState(12);
  const domains = useMemo(
    () => Array.from(new Set(items.map((i) => i.domain).filter(Boolean))),
    [items],
  );
  useEffect(() => {
    const u = new URLSearchParams(location.search);
    setQuery(u.get("q") || "");
    const params = Object.fromEntries(u.entries());
    if (params.form) {
      params.format = params.form;
      delete params.form;
    }
    delete params.shown;
    delete params.library;
    setSelected(params);
  }, []);
  function update(name: string, value: string) {
    setSelected((s) => ({ ...s, [name]: value }));
    setLimit(12);
    const u = new URL(location.href);
    value ? u.searchParams.set(name, value) : u.searchParams.delete(name);
    history.replaceState(null, "", u);
  }
  const results = items.filter((i) => {
    if (
      query &&
      !`${i.title} ${i.description} ${i.labels.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
      return false;
    const domainAlias: Record<string, string> = english
      ? {
          display: "Digital Exhibitions",
          heritage: "Digital Museums & Heritage",
          creative: "Cultural & Creative Experiences",
          operations: "Digital Operations",
        }
      : {
          display: "数字展示",
          heritage: "数字文博",
          creative: "数字文创",
          operations: "数字运营",
        };
    if (
      selected.domain &&
      i.domain !== (domainAlias[selected.domain] || selected.domain)
    )
      return false;
    for (const [key, value] of Object.entries(selected)) {
      if (!value || key === "q" || key === "domain") continue;
      if (!(i.tags[key] || []).includes(value)) return false;
    }
    return true;
  });
  const active =
    Object.entries(selected).some(([k, v]) => k !== "q" && v) || query;
  return (
    <div className="catalog" id="catalog-results">
      <div className="catalog-top">
        <div
          className="catalog-domains"
          aria-label={english ? "Business areas" : "业务领域"}
        >
          <button
            aria-pressed={!selected.domain}
            onClick={() => update("domain", "")}
          >
            {english ? "All" : "全部领域"}
          </button>
          {domains.map((d) => (
            <button
              key={d}
              aria-pressed={selected.domain === d}
              onClick={() => update("domain", d)}
            >
              {d}
            </button>
          ))}
        </div>
        <form
          className="catalog-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            update("q", query);
          }}
        >
          <label className="sr-only" htmlFor="catalog-search">
            {english ? "Search" : "搜索目录"}
          </label>
          <input
            id="catalog-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(12);
            }}
            placeholder={
              english ? "Search by name or topic" : "搜索名称、内容或场景"
            }
            type="search"
          />
          <button aria-label={english ? "Search" : "搜索"}>
            <Search size={19} aria-hidden="true" />
          </button>
        </form>
      </div>
      {!!filters.length && (
        <details className="catalog-filter-panel" open>
          <summary>
            {english ? "Filter by tags" : "按场馆、场景与能力筛选"}
          </summary>
          <div className="catalog-filter-grid">
            {filters.map((f) => (
              <label key={f.name}>
                {f.label}
                <select
                  value={selected[f.name] || ""}
                  onChange={(e) => update(f.name, e.target.value)}
                >
                  {f.options.map((o, i) => (
                    <option key={`${o.value}-${i}`} value={o.value || ""}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </details>
      )}
      <div className="catalog-status">
        <p role="status">
          {english
            ? `${results.length} results`
            : `找到 ${results.length} 项内容`}
        </p>
        {active && (
          <button
            onClick={() => {
              setSelected({});
              setQuery("");
              setLimit(12);
              history.replaceState(null, "", location.pathname);
            }}
          >
            {english ? "Clear filters" : "清除筛选"}
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="catalog-grid">
        {results.slice(0, limit).map((i) => (
          <Link className="catalog-card" href={`${i.path}/`} key={i.path}>
            {i.image && (
              <div className="catalog-image">
                <img
                  src={i.image}
                  alt={i.title}
                  width={800}
                  height={520}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <span className="catalog-category">
              {i.domain}
              {i.format ? ` · ${i.format}` : ""}
            </span>
            <h2>
              {i.title}
              <span aria-hidden="true">↗</span>
            </h2>
            <p>{i.description}</p>
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="catalog-empty">
          <h2>{english ? "No matching content" : "没有找到匹配内容"}</h2>
          <p>
            {english
              ? "Try another keyword or clear filters."
              : "换一个关键词，或清除筛选后继续探索。"}
          </p>
        </div>
      )}
      {results.length > limit && (
        <button
          className="button catalog-more"
          onClick={() => setLimit((n) => n + 12)}
        >
          {english ? "Load more" : "加载更多"}
          <span aria-hidden="true">＋</span>
        </button>
      )}
    </div>
  );
}
