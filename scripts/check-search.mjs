import fs from "node:fs";
import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";

// Exercise the actual server index against the preserved content library.
const require = createRequire(import.meta.url);
const ts = require("typescript");
const previous = Module._extensions[".ts"];
Module._extensions[".ts"] = (module, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(compiled.outputText, filename);
};
try {
  const { searchIndex } = require("../lib/search.ts");
  const results = {};
  for (const english of [false, true]) {
    const entries = searchIndex(english);
    const term = english ? "museum" : "博物馆";
    const matches = entries.filter((e) => e.keywords.toLowerCase().includes(term));
    for (const slug of ["brochure-2026-bijie-planning", "brochure-2026-all-for-the-people"]) {
      assert(entries.some((e) => e.path.endsWith("/" + slug)), "Regression fixture must remain present");
      assert(!matches.some((e) => e.path.endsWith("/" + slug)), "Recommended museums must not make unrelated projects match");
    }
    assert(matches.some((e) => e.path.endsWith("/brochure-2026-changsha-museum")), "A real museum must remain searchable");
    assert(entries.some((e) => e.keywords.includes(english ? "construction" : "施工")), "Search must still include delivery descriptions");
    results[english ? "English" : "Chinese"] = {
      entries: entries.length,
      museumMatches: matches.length,
      relatedProjectsExcluded: true,
    };
  }
  fs.mkdirSync("docs/qa", { recursive: true });
  fs.writeFileSync("docs/qa/search-regression.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  if (previous) Module._extensions[".ts"] = previous;
  else delete Module._extensions[".ts"];
}
