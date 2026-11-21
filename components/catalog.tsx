"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Plus, Search, X } from "lucide-react";
import type { CatalogFilter, CatalogItem } from "@/lib/source";

const pageSize = 12;
const noFilters: CatalogFilter[] = [];
const initialState = { query: "", selected: {} as Record<string, string>, limit: pageSize };
const domainAliases: Record<string, [string, string]> = {
  display: ["数字展示", "Digital Exhibitions"],
  heritage: ["数字文博", "Digital Museums & Heritage"],
  creative: ["数字文创", "Cultural & Creative Experiences"],
  operations: ["数字运营", "Digital Operations"],
};

function normalize(value: string) {
  return value.normalize("NFKC").trim().toLowerCase();
}

export function Catalog({
  items,
  filters = noFilters,
  english = false,
  id = "catalog-results",
  searchLabel,
  projectIndex = false,
  paramPrefix = "",
}: {
  items: CatalogItem[];
  filters?: CatalogFilter[];
  english?: boolean;
  id?: string;
  searchLabel?: string;
  projectIndex?: boolean;
  paramPrefix?: string;
}) {
  const searchId = useId();
  const [state, setState] = useState(initialState);
  const restoration = useRef<{ top: number; path: string } | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const restoreKey = "mgcCatalog:" + id;
  const domains = useMemo(() => Array.from(new Set(items.map((item) => item.domain).filter(Boolean))), [items]);
  const facets = useMemo(() => filters.filter((filter) =>
    filter.name !== "q" && filter.name !== "domain" &&
    filter.options.some((option) => option.value && items.some((item) => item.tags[filter.name]?.includes(option.value))),
  ), [filters, items]);

  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(window.location.search);
      const selected: Record<string, string> = {};
      const domain = params.get(paramPrefix + "domain") || "";
      const domainLabel = domainAliases[domain]?.[english ? 1 : 0] || domain;
      if (domains.includes(domainLabel)) selected.domain = domainLabel;
      for (const { name, options } of facets) {
        const value = params.get(paramPrefix + name)
          || (name === "format" ? params.get(paramPrefix + "form") : "");
        if (value && options.some((option) => option.value === value)) selected[name] = value;
      }
      const shown = Number(params.get(paramPrefix + "shown"));
      const limit = Number.isSafeInteger(shown) && shown > pageSize
        ? Math.min(shown, Math.max(items.length, pageSize))
        : pageSize;
      restoration.current = window.history.state?.[restoreKey] || null;
      setState({ query: params.get(paramPrefix + "q") || "", selected, limit });
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [domains, english, facets, items.length, paramPrefix, restoreKey]);

  useEffect(() => {
    const saved = restoration.current;
    if (!saved) return;
    const frame = window.requestAnimationFrame(() => {
      const links = grid.current?.querySelectorAll<HTMLAnchorElement>("a[data-catalog-path]");
      const link = Array.from(links || []).find((item) => item.dataset.catalogPath === saved.path);
      if (!link) return;
      restoration.current = null;
      link.focus({ preventScroll: true });
      window.scrollTo({ top: saved.top, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  function save(next: typeof initialState) {
    const url = new URL(window.location.href);
    for (const key of ["q", "shown", "domain", "form", ...facets.map((facet) => facet.name)]) {
      url.searchParams.delete(paramPrefix + key);
    }
    if (next.query.trim()) url.searchParams.set(paramPrefix + "q", next.query.trim());
    for (const [key, value] of Object.entries(next.selected)) {
      if (value) url.searchParams.set(paramPrefix + key, value);
    }
    if (next.limit > pageSize) url.searchParams.set(paramPrefix + "shown", String(next.limit));
    const historyState = { ...window.history.state };
    delete historyState[restoreKey];
    window.history.replaceState(historyState, "", url);
    restoration.current = null;
    setState(next);
  }

  function remember(event: MouseEvent<HTMLAnchorElement>, path: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    window.history.replaceState(
      { ...window.history.state, [restoreKey]: { top: window.scrollY, path } },
      "",
      window.location.href,
    );
  }

  function clear() {
    save(initialState);
    searchInput.current?.focus({ preventScroll: true });
  }

  const { query, selected, limit } = state;
  const term = normalize(query);
  const results = items.filter((item) => (
    (!term || normalize([item.title, item.description, item.venue, ...item.labels].join(" ")).includes(term)) &&
    (!selected.domain || item.domain === selected.domain) &&
    facets.every(({ name }) => !selected[name] || item.tags[name]?.includes(selected[name]))
  ));
  const active = !!term || Object.values(selected).some(Boolean);
  const label = searchLabel || (english ? "Search catalog" : "搜索目录");

  return (
    <div className={projectIndex ? "catalog catalog-projects" : "catalog"} id={id}>
      <div className="catalog-top">
        <form className="catalog-search" role="search" aria-label={label} onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor={searchId}>{label}</label>
          <input
            ref={searchInput}
            id={searchId}
            value={query}
            onChange={(event) => save({ query: event.target.value, selected, limit: pageSize })}
            placeholder={projectIndex
              ? english ? "Search by project, venue or service" : "搜索「里耶」或「博物馆」"
              : english ? "Search by name or topic" : "搜索名称、内容或场景"}
            type="search"
          />
          <button type="submit" aria-label={label}><Search size={20} aria-hidden="true" /></button>
        </form>
        {domains.length > 1 && (
          <div className="catalog-domains" aria-label={english ? "Business areas" : "业务领域"} role="group">
            {[["", english ? "All" : "全部"], ...domains.map((name) => [name, name])].map(([value, text]) => (
              <button type="button" key={value} aria-pressed={(selected.domain || "") === value}
                onClick={() => save({ query, selected: { ...selected, domain: value }, limit: pageSize })}>
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
      {facets.length > 0 && (
        <details className="catalog-filter-panel" open={facets.some(({ name }) => selected[name]) || undefined}>
          <summary>{english ? "More filters" : "更多筛选"}</summary>
          <div className="catalog-filter-grid">
            {facets.map(({ name, label, options }) => (
              <label key={name}>
                {label}
                <select value={selected[name] || ""} onChange={(event) =>
                  save({ query, selected: { ...selected, [name]: event.target.value }, limit: pageSize })
                }>
                  {options.map(({ value, label }) => <option key={value || "all"} value={value || ""}>{label}</option>)}
                </select>
              </label>
            ))}
          </div>
        </details>
      )}
      <div className="catalog-status">
        <p role="status">{english ? `${results.length} results` : `找到 ${results.length} 项`}</p>
        {active && (
          <button type="button" onClick={clear}>
            {english ? "Clear filters" : "清除筛选"}
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="catalog-grid" ref={grid}>
        {results.slice(0, limit).map((item) => (
          <Link className="catalog-card" href={item.path + "/"} key={item.path} prefetch={false}
            data-catalog-path={item.path} onClick={(event) => remember(event, item.path)}>
            {item.image && (
              <div className="catalog-image">
                <img src={item.image} alt="" width={800} height={520} loading="lazy" decoding="async" />
              </div>
            )}
            <span className="catalog-category">{[item.domain, item.format].filter(Boolean).join(" · ")}</span>
            <h2>{item.title}<ArrowUpRight size={19} aria-hidden="true" /></h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
      {!results.length && (
        <div className="catalog-empty">
          <h2>{english ? "No matching content" : "没有找到匹配内容"}</h2>
          <p>{english ? "Try another keyword or clear the filters." : "换一个关键词，或者清除筛选条件。"}</p>
        </div>
      )}
      {results.length > limit && (
        <button type="button" className="button editorial-secondary catalog-more"
          onClick={() => save({ query, selected, limit: limit + pageSize })}>
          {english ? "Load more" : "加载更多"}<Plus size={17} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
