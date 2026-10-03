"use client";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Search, X } from "lucide-react";
import type { SearchEntry, SearchKind } from "@/lib/search";
import type { CatalogFilter } from "@/lib/source";
const kinds: SearchKind[] = ["case", "service", "research", "product"];
const names = {
  case: ["案例", "Cases"],
  service: ["服务", "Services"],
  research: ["研究", "Research"],
  product: ["产品", "Products"],
};
export function SearchJourney({
  items,
  english: en = false,
  initialKind,
  filters = [],
}: {
  items: SearchEntry[];
  english?: boolean;
  initialKind?: SearchKind;
  filters?: CatalogFilter[];
}) {
  const id = useId(),
    resultsRef = useRef<HTMLElement>(null),
    input = useRef<HTMLInputElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draft, setDraft] = useState(""),
    [query, setQuery] = useState(""),
    [focus, setFocus] = useState(false),
    [submitted, setSubmitted] = useState(false),
    [guiding, setGuiding] = useState(false),
    [filter, setFilter] = useState<SearchKind | "">(initialKind || ""),
    [facets, setFacets] = useState<Record<string, string>>({}),
    [limit, setLimit] = useState(9),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    const p = new URLSearchParams(location.search),
      q = p.get("q") || "";
    setFacets(
      Object.fromEntries([
        ...filters.map((f) => [f.name, p.get(f.name) || ""]),
        ["domain", p.get("domain") || ""],
      ]),
    );
    if (q) {
      setDraft(q);
      setQuery(q);
      setSubmitted(true);
      setFilter("");
    }
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const matches = useMemo(() => {
    let q = query.trim().toLowerCase();
    if (!en)
      q = ({ museum: "博物馆", xr: "vr" } as Record<string, string>)[q] || q;
    const domain: Record<string, string> = {
      display: en ? "Digital Exhibitions" : "数字展示",
      heritage: en ? "Digital Museums & Heritage" : "数字文博",
      creative: en ? "Cultural & Creative Experiences" : "数字文创",
      operations: en ? "Digital Operations" : "数字运营",
    };
    const tokens = q.split(/\s+/).filter(Boolean);
    const relevance = (i: SearchEntry) => tokens.reduce((score, t) => {
      const contains = (text: string) => text.toLowerCase().includes(t);
      return score + (contains(i.title) ? 8 : 0)
        + (contains(i.labels.join(" ") + " " + i.domain) ? 4 : 0)
        + (contains(i.description) ? 2 : 0);
    }, 0);
    return items.filter(
      (i) =>
        Object.entries(facets).every(
          ([k, v]) =>
            !v ||
            (k === "domain"
              ? i.domain === (domain[v] || v)
              : (i.tags[k] || []).includes(v)),
        ) &&
        tokens.every((t) => (i.keywords + " " + i.title).toLowerCase().includes(t)),
    ).sort((a, b) => relevance(b) - relevance(a));
  }, [items, query, en, facets]);
  const results = matches.filter((i) => !filter || i.kind === filter);
  function submit(value = draft) {
    if (timer.current) clearTimeout(timer.current);
    value = value.trim();
    setDraft(value);
    setQuery(value);
    setSubmitted(true);
    setGuiding(true);
    setFocus(false);
    setFilter("");
    setLimit(9);
    setRevision((n) => n + 1);
    input.current?.blur();
    const u = new URL(location.href);
    value ? u.searchParams.set("q", value) : u.searchParams.delete("q");
    history.replaceState(null, "", u);
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    timer.current = setTimeout(
      () => {
        setGuiding(false);
        resultsRef.current?.scrollIntoView({
          behavior: reduce ? "instant" : "smooth",
          block: "start",
        });
        resultsRef.current?.focus({ preventScroll: true });
      },
      reduce ? 0 : 280,
    );
  }
  function clear() {
    if (timer.current) clearTimeout(timer.current);
    setDraft("");
    setQuery("");
    setFacets({});
    setSubmitted(false);
    setGuiding(false);
    setFilter(initialKind || "");
    setLimit(9);
    const u = new URL(location.href);
    ["q", "domain", ...filters.map((f) => f.name)].forEach((k) =>
      u.searchParams.delete(k),
    );
    history.replaceState(null, "", u);
    input.current?.focus();
  }
  function facet(name: string, value: string) {
    setFacets((f) => ({ ...f, [name]: value }));
    setLimit(9);
    const u = new URL(location.href);
    value ? u.searchParams.set(name, value) : u.searchParams.delete(name);
    history.replaceState(null, "", u);
  }
  return (
    <div
      className={
        "search-journey " +
        (focus ? "journey-focus " : "") +
        (submitted ? "journey-submitted" : "")
      }
      id="explore"
      data-scene={en ? "Search" : "探索内容"}
    >
      <div className="search-sticky">
        <div className="search-heading">
          <h2>{en ? "Follow your curiosity." : "从一个关键词，找到可能。"}</h2>
          <p>
            {en
              ? "Explore projects, services, products and research."
              : "连接案例、服务、产品与研究。"}
          </p>
        </div>
        <form
          role="search"
          className="journey-form"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label htmlFor={id + "-input"} className="sr-only">
            {en ? "Search cultural experiences" : "搜索文化体验"}
          </label>
          <Search size={23} aria-hidden="true" />
          <input
            ref={input}
            id={id + "-input"}
            type="search"
            value={draft}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              en ? "Try museum, interaction, AI…" : "试试：博物馆、互动、AI…"
            }
          />
          {draft && (
            <button
              type="button"
              className="icon-button"
              onClick={clear}
              aria-label={en ? "Clear search" : "清除搜索"}
            >
              <X size={19} />
            </button>
          )}
          <button
            type="submit"
            className="journey-submit"
            aria-label={en ? "Find results" : "探索结果"}
          >
            <ArrowDown size={22} />
            <span>{en ? "Explore" : "探索"}</span>
          </button>
        </form>
        <div className="search-suggestions">
          {(en
            ? ["Museum", "Interaction", "AI", "VR"]
            : ["博物馆", "数字文博", "互动", "AI"]
          ).map((q) => (
            <button key={q} onClick={() => submit(q)}>
              {q}
              <ArrowUpRight size={13} />
            </button>
          ))}
        </div>
      </div>
      {!!filters.length && (
        <details className="journey-facets">
          <summary>
            {en
              ? "Filter by place, theme and capability"
              : "按场馆、场景与能力筛选"}
          </summary>
          <div>
            {filters.map((f) => (
              <label key={f.name}>
                {f.label}
                <select
                  value={facets[f.name] || ""}
                  onChange={(e) => facet(f.name, e.target.value)}
                >
                  {f.options.map((o, i) => (
                    <option key={i} value={o.value || ""}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          {Object.values(facets).some(Boolean) && (
            <button className="text-link" onClick={clear}>
              {en ? "Clear filters" : "清除筛选"}
              <X size={16} />
            </button>
          )}
        </details>
      )}
      <div
        className={"search-guidance " + (guiding ? "is-guiding" : "")}
        aria-hidden="true"
      >
        <span>
          {submitted
            ? matches.length + (en ? " results" : " 项结果")
            : en
              ? "Explore below"
              : "向下探索"}
        </span>
        <i />
      </div>
      <section
        className="journey-results"
        ref={resultsRef}
        tabIndex={-1}
        aria-label={en ? "Search results" : "搜索结果"}
        aria-busy={guiding}
      >
        <div className="journey-status">
          <p role="status" aria-live="polite">
            {query
              ? query + " / " + results.length + (en ? " results" : " 项内容")
              : en
                ? "Explore the archive"
                : "探索内容库"}
          </p>
          <div className="result-types">
            <button
              aria-pressed={!filter}
              onClick={() => {
                setFilter("");
                setLimit(9);
              }}
            >
              {en ? "All" : "全部"}
              <small>{matches.length}</small>
            </button>
            {kinds.map((k) => {
              const n = matches.filter((i) => i.kind === k).length;
              return n ? (
                <button
                  key={k}
                  aria-pressed={filter === k}
                  onClick={() => {
                    setFilter(k);
                    setLimit(9);
                  }}
                >
                  {names[k][en ? 1 : 0]}
                  <small>{n}</small>
                </button>
              ) : null;
            })}
          </div>
        </div>
        <div className="journey-results-list" key={revision + "-" + filter}>
          {results.slice(0, limit).map((i, n) => (
            <Link
              key={i.path}
              href={i.path.includes("#") ? i.path : i.path + "/"}
              prefetch={false}
              className={"journey-result result-" + i.kind}
              style={
                {
                  "--result-delay": Math.min(n, 6) * 60 + "ms",
                } as React.CSSProperties
              }
            >
              {i.image && i.kind !== "service" && i.kind !== "research" && (
                <div className="result-image">
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
              <div className="result-copy">
                <span>
                  {names[i.kind][en ? 1 : 0]}
                  {i.domain ? " / " + i.domain : ""}
                </span>
                <h3>
                  {i.title}
                  <ArrowUpRight size={20} />
                </h3>
                <p>{i.description.slice(0, 145)}</p>
              </div>
            </Link>
          ))}
        </div>
        {!results.length && (
          <div className="journey-empty">
            <h3>{en ? "No matching content." : "还没有找到匹配内容。"}</h3>
            <p>
              {en
                ? "Try a broader topic, or reset the search."
                : "试试更宽泛的文化主题，或重新探索内容库。"}
            </p>
            <button className="text-link" onClick={clear}>
              {en ? "Reset search" : "重新探索"}
              <ArrowUpRight size={18} />
            </button>
          </div>
        )}
        {results.length > limit && (
          <button
            className="text-link results-more"
            onClick={() => setLimit((n) => n + 9)}
          >
            {en ? "Load more" : "加载更多"}
            <ArrowDown size={18} />
          </button>
        )}
      </section>
    </div>
  );
}
