// Production-export acceptance. Optional Playwright tooling is never a runtime dependency.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
const { chromium } = createRequire(import.meta.url)(
  process.env.MGC_PLAYWRIGHT_MODULE || "playwright",
);
const port = process.env.MGC_V3_QA_PORT || "3013";
const base = "/meich";
const origin = `http://127.0.0.1:${port}`;
const report = {
  createdAt: new Date().toISOString(),
  environment:
    "Production static export /meich; headless Chromium; Linux; emulated widths and touch. Not physical devices or Safari.",
  widths: [320, 360, 390, 412, 430, 768, 1024, 1440, 1920],
  tests: [],
  responsive: [],
  errors: [],
  screenshots: [],
};
const directory = process.env.MGC_REDESIGN_QA_DIR || "qa-results/redesign";
await fs.mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: port, NEXT_PUBLIC_BASE_PATH: base },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
async function test(name, fn) {
  try {
    const evidence = await fn();
    report.tests.push({ name, result: "passed", evidence });
    console.log("PASS", name);
  } catch (error) {
    report.tests.push({ name, result: "failed", error: error.stack });
    console.log("FAIL", name, error.message);
  }
}
const cases = [
  "/cases/gaomiao/",
  "/cases/liye-qin-slips/",
  "/cases/potala-snow-city/",
];
const englishCases = [
  "/en/cases/gaomiao/",
  "/en/cases/brochure-2026-liye-qin-slips/",
  "/en/cases/brochure-2026-potala-snow-city/",
];
async function visit(page, route) {
  const response = await page.goto(origin + base + route, {
    waitUntil: "networkidle",
  });
  assert.equal(response.status(), 200, route);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector(".motion-root[data-navigation]");
}
async function shot(page, name) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `${directory}/${name}.jpg`,
    type: "jpeg",
    quality: 87,
  });
  report.screenshots.push(name + ".jpg");
}
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("Preview readiness timeout")),
      10000,
    );
    server.stdout.on("data", (d) => {
      if (d.toString().includes("Preview:")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("error", reject);
  });
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.MGC_CHROMIUM_PATH || undefined,
    args: process.env.MGC_CHROMIUM_ARGS
      ? JSON.parse(process.env.MGC_CHROMIUM_ARGS)
      : [],
  });
  report.browser = browser.version();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    permissions: ["clipboard-read", "clipboard-write"],
  });
  context.setDefaultTimeout(8000);
  const page = await context.newPage();
  page.on("pageerror", (e) => report.errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      /hydration|uncaught|React|referenceerror/i.test(m.text()) &&
      !(
        m.text().includes("404 (Not Found)") &&
        page.url().includes("/missing-v3-page/")
      )
    )
      report.errors.push(m.text());
  });
  await test("24 core routes × 9 widths: overflow, language, headings, images and metadata", async () => {
    const routes = [
      "/",
      "/en/",
      ...cases,
      ...englishCases,
      "/services/",
      "/en/services/",
      "/culture-ai/",
      "/en/culture-ai/",
      "/research/",
      "/en/research/",
      "/contact/",
      "/en/contact/",
      "/cases/",
      "/products/",
      "/en/products/",
      "/about/",
      "/en/about/",
      "/en/cases/",
      "/insights/",
      "/cases/brochure-2026-changsha-museum/",
    ];
    for (const route of routes) {
      await visit(page, route);
      for (const width of report.widths) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
        await page.waitForFunction(() =>
          [...document.querySelectorAll("img")]
            .filter((i) => i.loading !== "lazy" || i.complete)
            .every((i) => i.complete && i.naturalWidth > 0),
        );
        const result = await page.evaluate(() => ({
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelectorAll("main h1").length,
          lang: document.documentElement.lang,
          brokenImages: [...document.querySelectorAll("img")].filter(
            (i) =>
              (i.loading !== "lazy" || i.complete) && (!i.complete || i.naturalWidth === 0),
          ).length,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          description: document.querySelector('meta[name="description"]')
            ?.content,
        }));
        assert(
          result.scrollWidth <= width + 1,
          `${route} at ${width}: ${result.scrollWidth}`,
        );
        assert.equal(result.h1, 1, route);
        assert.equal(result.lang, route.startsWith("/en/") ? "en" : "zh-CN");
        assert.equal(result.brokenImages, 0, route);
        assert(
          result.canonical?.startsWith(
            "https://jiangjinzhou01-ctrl.github.io/meich/",
          ),
          route,
        );
        assert(result.description, route);
        report.responsive.push({ route, ...result });
      }
      console.log("ROUTE", route, "widths", report.widths.length);
    }
    return { pages: routes.length, widths: report.widths.length, observations: report.responsive.length };
  });

  await test("Homepage copy and project actions are immediately visible", async () => {
    const withoutJS = await browser.newContext({ javaScriptEnabled: false });
    const view = await withoutJS.newPage();
    const evidence = [];
    for (const width of [320, 390, 768, 1440]) {
      const height = width < 768 ? 720 : 920;
      await view.setViewportSize({ width, height });
      await view.goto(origin + base + "/", { waitUntil: "load" });
      const actions = view.locator(".home-opening .editorial-actions a");
      assert.equal(await actions.count(), 2);
      for (const action of await actions.all()) {
        const bounds = await action.boundingBox();
        assert(bounds.y >= 0 && bounds.y + bounds.height <= height, "CTA above the fold");
      }
      assert(await view.locator(".home-opening h1").isVisible());
      assert.equal(await view.locator(".atlas-plate").count(), 3);
      assert(await view.locator(".atlas-plate img").evaluateAll((images) => images.every((img) => img.naturalWidth > 0)));
      assert.match(await view.locator(".atlas-plate[data-slot=active]").getAttribute("href"), /liye-qin-slips/);
      evidence.push({ width, height });
    }
    await withoutJS.close();
    return evidence;
  });

  await test("The printed project covers respond to keys, drag, touch and direct entry", async () => {
    await page.setViewportSize({ width: 1440, height: 920 });
    await visit(page, "/");
    await page.emulateMedia({ reducedMotion: "reduce" });
    const table = page.locator(".print-table");
    const current = table.locator("[data-slot=active]");
    await table.focus();
    await page.keyboard.press("ArrowRight");
    assert.match(await current.getAttribute("href"), /qi-baishi/);
    await page.keyboard.press("End");
    assert.match(await current.getAttribute("href"), /hearing-huxiang/);
    await page.getByRole("button", { name: "下一张封面" }).click();
    assert.match(await current.getAttribute("href"), /liye-qin-slips/);
    const rect = await current.boundingBox();
    const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 110, y + 4, { steps: 8 });
    await page.mouse.up();
    assert.match(await current.getAttribute("href"), /qi-baishi/);
    assert.equal(new URL(page.url()).pathname, base + "/");
    await table.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/cases/brochure-2026-qi-baishi/");
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, "/en/");
    const touch = await context.newCDPSession(page);
    const plate = await current.boundingBox();
    const sx = plate.x + plate.width / 2, sy = plate.y + plate.height / 2;
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: sx, y: sy }] });
    for (const delta of [12, 30, 60, 100]) await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: sx - delta, y: sy + 2 }] });
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.match(await current.getAttribute("href"), /en.*qi-baishi/);
    await current.tap();
    await page.waitForURL("**/en/cases/brochure-2026-qi-baishi/");
    await touch.detach();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    return { editions: 3, keyboard: true, mouseDrag: true, touch: true, tapAfterDrag: true };
  });

  await test("Project index preview follows focus and keeps the requested view across reloads", async () => {
    await page.setViewportSize({ width: 1440, height: 920 });
    await visit(page, "/cases/");
    const catalog = page.locator(".catalog-projects");
    const cards = catalog.locator("[data-catalog-path]");
    await cards.nth(1).focus();
    const path = await cards.nth(1).getAttribute("href");
    assert.equal(await catalog.locator(".archive-viewer a").getAttribute("href"), path);
    await catalog.getByRole("button", { name: "图像", exact: true }).click();
    assert.match(page.url(), /view=images/);
    await page.reload();
    await page.waitForSelector('.catalog-projects[data-layout="plates"]');
    await catalog.getByRole("button", { name: "目录", exact: true }).click();
    assert.equal(await catalog.getAttribute("data-layout"), "list");
    return { focusPreview: true, viewRestoration: true };
  });

  await test("Mobile menu keyboard focus, Escape, theme, and client navigation", async () => {
    await page.setViewportSize({ width: 390, height: 650 });
    await visit(page, "/");
    const trigger = page.locator(".menu-toggle");
    const menu = page.locator("#mobile-menu");
    for (let attempt = 0; attempt < 3; attempt++) {
      await trigger.click();
      assert.equal(await trigger.getAttribute("aria-expanded"), "true");
      assert(await menu.evaluate((el) => el.open && el.contains(document.activeElement)));
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab");
        assert(await menu.evaluate((el) => el.contains(document.activeElement) || document.activeElement === document.body));
      }
      await page.keyboard.press("Escape");
      assert.equal(await menu.evaluate((el) => el.open), false);
      assert(await trigger.evaluate((el) => document.activeElement === el));
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    }
    await trigger.click();
    const theme = menu.locator(".mobile-menu-actions button");
    await theme.click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await theme.click();
    await menu.getByRole("link", { name: "业务与产品" }).click();
    await page.waitForURL("**/services/");
    assert.equal(await menu.evaluate((el) => el.open), false);
    return { openCloseCycles: 3, focusRestored: true, route: page.url() };
  });
  await test("Culture: 4 stages × 3 lenses, keyboard, stable panels and source-image focus", async () => {
    const evidence = [];
    for (const width of [320, 390, 768, 1440])
      for (const route of ["/culture-ai/", "/en/culture-ai/"]) {
        await page.setViewportSize({ width, height: 1000 });
        await visit(page, route);
        const stages = page.locator(".installation-tabs [role=tab]");
        const selected = stage => page.waitForFunction(stage => document.querySelectorAll(".installation-tabs [role=tab]")[stage].getAttribute("aria-selected") === "true" && !document.querySelector(".installation-visual-rail").classList.contains("is-dragging"), stage);
        let heights = [];
        for (const stage of [0, 1, 2, 3, 1, 0]) {
          await stages.nth(stage).click();
          await selected(stage);
          assert.equal(
            await stages.nth(stage).getAttribute("aria-selected"),
            "true",
          );
          assert.equal(await page.locator(".installation-reading").count(), 1);
          if (stage < 2)
            for (let lens = 0; lens < 3; lens++) {
              await page.locator(".lens-controls button").nth(lens).click();
              assert.equal(
                await page
                  .locator(".installation-scene")
                  .getAttribute("data-detail"),
                String(lens),
              );
              assert.equal(
                await page
                  .locator(".lens-controls button")
                  .nth(lens)
                  .getAttribute("aria-pressed"),
                "true",
              );
            }
          heights.push(
            await page
              .locator(".installation-scene")
              .evaluate((el) => el.offsetHeight),
          );
        }
        assert(
          Math.max(...heights) - Math.min(...heights) <= 2,
          `Unstable scene ${width}: ${heights}`,
        );
        await stages.first().focus();
        await page.keyboard.press("End");
        await selected(3);
        assert.equal(await stages.last().getAttribute("aria-selected"), "true");
        await page.keyboard.press("Home");
        await selected(0);
        assert.equal(
          await stages.first().getAttribute("aria-selected"),
          "true",
        );
        const trigger = page.locator(
          ".installation-inspect .image-inspect-trigger",
        );
        await trigger.click();
        await page.waitForSelector(".installation-inspect dialog[open]");
        assert.equal(
          await page.evaluate(() => document.body.style.overflow),
          "hidden",
        );
        await page
          .locator(".installation-inspect .image-inspector-toolbar button")
          .first()
          .click();
        assert(
          await page.locator(".installation-inspect .original-size").count(),
        );
        await page.keyboard.press("Escape");
        await page.waitForFunction(
          () => !document.querySelector(".installation-inspect dialog").open,
        );
        assert(await trigger.evaluate((el) => document.activeElement === el));
        evidence.push({ width, route, heights });
      }
    return evidence;
  });

  await test("Flagship projects: chapter navigation, visual evidence, archives and next project", async () => {
    const observations = [];
    for (const route of [...cases, ...englishCases]) {
      await page.setViewportSize({ width: route.startsWith("/en/") ? 390 : 1440, height: 900 });
      await visit(page, route);
      const chapters = page.locator(".case-reading-rail a");
      const count = await chapters.count();
      assert(count === 3 || count === 4);
      const target = await chapters.nth(1).getAttribute("href");
      await chapters.nth(1).click();
      await page.waitForFunction((hash) => location.hash === hash && document.querySelector('a[href="' + hash + '"]')?.getAttribute("aria-current") === "step", target);
      assert.equal(await page.locator(".project-main-plate img").count(), 1);
      if (route.includes("liye")) {
        await page.locator(".study-controls button").nth(2).click();
        assert.equal(await page.locator(".study-controls button").nth(2).getAttribute("aria-pressed"), "true");
        const original = page.locator(".project-study .image-inspect-trigger");
        await original.click();
        await page.waitForSelector(".project-study dialog[open]");
        await page.keyboard.press("Escape");
        assert(await original.evaluate((el) => document.activeElement === el));
        await page.locator(".case-reading-hotspots button").last().click();
        assert.equal(await page.locator(".case-reading-hotspots button").last().getAttribute("aria-pressed"), "true");
      } else if (route.includes("potala")) {
        assert.equal(await page.locator(".project-media figure").count(), 2);
      } else {
        assert.equal(await page.locator(".project-records img").count(), 4);
      }
      await page.locator(".project-resources > details > summary").click();
      assert(await page.locator(".project-resources details").first().evaluate((el) => el.open));
      await page.locator(".project-resources > details > summary").click();
      assert.match(await page.locator(".project-enquiry").getAttribute("href"), /\/contact\/\?project=/);
      assert.match(await page.locator(".project-next-link").getAttribute("href"), /\/cases\//);
      observations.push({ route, chapters: count });
    }
    return observations;
  });
  await test("Search Liye, read its case, restore filters, switch language, carry project into enquiry", async () => {
    const observations = [];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await visit(page, "/");
      await page.locator(".home-opening .editorial-primary").click();
      await page.waitForURL("**/cases/");
      const listing = page.locator(".catalog-projects");
      const input = listing.getByRole("searchbox");
      await listing.getByRole("button", { name: "数字展示", exact: true }).click();
      await input.fill("里耶");
      const result = listing.locator('[data-catalog-path="/cases/liye-qin-slips"]');
      await result.waitFor();
      assert.equal(await result.count(), 1);
      assert.match(page.url(), /[?&]q=/);
      await result.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      const position = await page.evaluate(() => scrollY);
      await result.click();
      await page.waitForURL("**/cases/liye-qin-slips/");
      assert.match(await page.locator("h1").textContent(), /里耶/);
      await page.goBack();
      await page.waitForFunction(() => document.querySelector(".catalog-projects input").value === "里耶");
      assert.equal(await listing.getByRole("button", { name: "数字展示", exact: true }).getAttribute("aria-pressed"), "true");
      await page.waitForFunction((top) => Math.abs(scrollY - top) <= 12, position);
      await input.fill("MGC-no-matching-project");
      await listing.locator(".catalog-empty").waitFor();
      await listing.getByRole("button", { name: "清除筛选" }).click();
      assert.equal(await input.inputValue(), "");
      await input.fill("里耶");
      await result.click();
      await page.waitForURL("**/cases/liye-qin-slips/");
      await page.locator(".language-switch").click();
      await page.waitForURL("**/en/cases/brochure-2026-liye-qin-slips/");
      assert.match(await page.locator("h1").textContent(), /Liye/);
      await page.locator(".language-switch").click();
      await page.waitForURL("**/cases/liye-qin-slips/");
      await page.locator(".project-enquiry").click();
      await page.waitForURL("**/contact/?project=liye-qin-slips");
      await page.waitForFunction(() => document.querySelector("#message").value.includes("里耶"));
      await page.locator("#message").fill("我们想讨论馆藏陈列与互动展项。");
      assert.match(await page.locator("#message").inputValue(), /馆藏/);
      observations.push({ width, restoredScroll: position, enquiry: true });
    }
    return observations;
  });
  await test("Search, filters, empty state and URL persistence", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, "/services/");
    let input = page.locator(".journey-form input");
    await input.fill("MGC-unmatched-V3-2026");
    await input.press("Enter");
    await page.waitForSelector(".journey-empty");
    await page.locator(".journey-empty button").click();
    await input.fill("博物馆");
    await input.press("Enter");
    await page.waitForSelector(".journey-result");
    const resultCount = await page.locator(".journey-result").count();
    assert(resultCount > 0);
    await visit(page, "/products/");
    await page.locator(".journey-facets summary").click();
    await page
      .locator(".journey-facets select")
      .first()
      .selectOption({ index: 1 });
    const selected = await page
      .locator(".journey-facets select")
      .first()
      .inputValue();
    await page.reload();
    await page.waitForFunction(
      (value) =>
        document.querySelector(".journey-facets select")?.value === value,
      selected,
    );
    return { searchResults: resultCount, persistedFilter: selected };
  });
  await test("Contact: local-only validation, focus, copy, download, clipboard failure and project context", async () => {
    const evidence = [];
    for (const route of ["/contact/", "/en/contact/"]) {
      await visit(page, route);
      await page.locator("button[type=submit]").click();
      assert.equal(await page.locator(".error-summary li").count(), 5);
      assert(
        await page
          .locator(".error-summary")
          .evaluate((e) => document.activeElement === e),
      );
      await page.locator("#name").fill("V3 QA");
      await page.locator("#company").fill("Acceptance test");
      await page.locator("#contact").fill("qa@example.invalid");
      await page
        .locator("#message")
        .fill("This is a local-only browser acceptance test.");
      await page.locator("#consent").check();
      await page.locator("button[type=submit]").click();
      assert(
        (await page.locator(".form-feedback strong").textContent()).match(
          /尚未发送|not been sent/,
        ),
      );
      assert(
        await page
          .locator(".form-feedback")
          .evaluate((e) => document.activeElement === e),
      );
      await page.locator(".brief-actions button").first().click();
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      assert(clipboard.includes("qa@example.invalid"));
      const downloadPromise = page.waitForEvent("download");
      await page.locator(".brief-actions button").last().click();
      const download = await downloadPromise;
      const content = await fs.readFile(await download.path(), "utf8");
      assert(content.includes("qa@example.invalid"));
      assert(content.match(/本地副本|local copy/));
      evidence.push({
        route,
        errors: 5,
        localOnly: true,
        download: download.suggestedFilename(),
        copied: true,
      });
    }
    await page.evaluate(() => {
      navigator.clipboard.writeText = async () => {
        throw new Error("QA denied clipboard");
      };
    });
    await page.locator(".brief-actions button").first().click();
    assert(
      (await page.locator(".form-feedback").textContent()).includes(
        "Clipboard unavailable",
      ),
    );
    await visit(page, "/contact/?project=gaomiao");
    assert((await page.locator("#message").inputValue()).includes("高庙"));
    return evidence;
  });

  await test("Brand film loads on demand and stops on close", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    const videoPath = "**/brand/company-films/company.mp4";
    let requests = 0;
    await page.route(videoPath, (route) => {
      requests++;
      return route.fulfill({ status: 204, body: "" });
    });
    await visit(page, "/about/");
    assert.equal(await page.locator(".film-dialog video").count(), 0);
    assert.equal(requests, 0);
    const film = page.waitForRequest(videoPath);
    await page.locator(".film-trigger").click();
    await film;
    assert.equal(await page.locator(".film-dialog video").getAttribute("preload"), "metadata");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector(".film-dialog").open && !document.querySelector(".film-dialog video"));
    return { loadsOnDemand: true, removesPlayerOnClose: true };
  });

  await test("Reduced motion, keyboard navigation and legacy project URL", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await visit(page, "/culture-ai/");
    const stages = page.locator(".installation-tabs [role=tab]");
    await stages.first().focus();
    await page.keyboard.press("End");
    await page.waitForFunction(() => document.querySelectorAll(".installation-tabs [role=tab]")[3].getAttribute("aria-selected") === "true");
    await page.goto(origin + base + "/work/liye-qin-slips/?source=qa#case-context");
    await page.waitForURL("**/cases/liye-qin-slips/?source=qa#case-context");
    assert.equal(await page.locator("main h1").count(), 1);
    assert(await page.locator("#case-context").count());
    await page.goto(origin + base + "/missing-v3-page/");
    assert(await page.locator("main").innerText());
    await page.emulateMedia({ reducedMotion: "no-preference" });
    return { oldLinkWorks: true, queryAndAnchorPreserved: true };
  });
  await test("Production screenshots and browser errors", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [width, label] of [[1440, "desktop"], [390, "mobile"]]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      for (const [route, name] of [["/", "home"], ["/cases/", "case-index"], ["/cases/liye-qin-slips/", "liye"], ["/services/", "services"], ["/contact/", "contact"], ["/about/", "about"], ["/research/", "research"], ["/cases/potala-snow-city/", "snow-city"], ["/cases/gaomiao/", "gaomiao"]]) {
        await visit(page, route);
        await shot(page, name + "-" + label);
      }
    }
    assert.deepEqual(report.errors, []);
    return { screenshots: report.screenshots };
  });
} catch (error) {
  report.tests.push({
    name: "Browser setup",
    result: "failed",
    error: error.stack,
  });
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  report.passed = report.tests.filter((t) => t.result === "passed").length;
  report.failed = report.tests.filter((t) => t.result === "failed").length;
  await fs.writeFile(
    directory + "/browser.json",
    JSON.stringify(report, null, 2),
  );
  console.log(`Website QA: ${report.passed} passed, ${report.failed} failed`);
  if (report.failed) process.exitCode = 1;
}
