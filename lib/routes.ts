/** Canonical content URLs. Static aliases keep old bookmarked links working. */
export const aliases: Record<string, string> = {
  "/en/cases/brochure-2026-gaomiao-museum": "/en/cases/gaomiao",
  "/work": "/cases",
  "/work/liye-qin-slips": "/cases/liye-qin-slips",
  "/work/potala-snow-city": "/cases/potala-snow-city",
  "/work/gaomiao": "/cases/gaomiao",
  "/cases/brochure-2026-liye-qin-slips": "/cases/liye-qin-slips",
  "/cases/brochure-2026-potala-snow-city": "/cases/potala-snow-city",
  "/cases/brochure-2026-gaomiao-museum": "/cases/gaomiao",
  "/technology": "/research/technology",
  "/insights/article-c7e876af": "/insights/kongwu-museum-store",
  "/insights/article-c539eb28": "/insights/malanshan-exhibition",
};
export function canonicalPath(input: string) {
  const split = input.search(/[?#]/);
  const pathname = split < 0 ? input : input.slice(0, split);
  const rest = split < 0 ? "" : input.slice(split);
  const normalized = pathname.replace(/\/$/, "") || "/";
  const target = aliases[normalized] || normalized;
  return (target === "/" ? "/" : `${target}/`) + rest;
}
export function languagePair(input: string) {
  const route = canonicalPath(input).replace(/\/$/, "") || "/";
  const isEnglish = route === "/en" || route.startsWith("/en/");
  const map: Record<string, string> = {
    "/": "/en",
    "/services": "/en/services",
    "/solutions": "/en/solutions",
    "/cases": "/en/cases",
    "/culture-ai": "/en/culture-ai",
    "/research/technology": "/en/research/technology",
    "/cases/liye-qin-slips": "/en/cases/brochure-2026-liye-qin-slips",
    "/cases/potala-snow-city": "/en/cases/brochure-2026-potala-snow-city",
    "/cases/gaomiao": "/en/cases/gaomiao",
    "/insights/kongwu-museum-store": "/en/insights/article-c7e876af",
    "/insights/malanshan-exhibition": "/en/insights/article-c539eb28",
  };
  if (isEnglish) {
    const zh =
      Object.entries(map).find(([, en]) => en === route)?.[0] ||
      route.replace(/^\/en/, "") ||
      "/";
    return { zh: canonicalPath(zh), en: canonicalPath(route) };
  }
  return {
    zh: canonicalPath(route),
    en: canonicalPath(map[route] || `/en${route === "/" ? "" : route}`),
  };
}
