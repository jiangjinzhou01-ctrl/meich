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
const directory = "docs/qa/v3.0";
await fs.mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: port, NEXT_PUBLIC_BASE_PATH: base },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
  await delay(850);
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
      !(
        m.text().includes("404 (Not Found)") &&
        page.url().includes("/missing-v3-page/")
      )
    )
      report.errors.push(m.text());
  });
  await test("18 core routes × 9 widths: overflow, language, headings, images and metadata", async () => {
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
    ];
    for (const route of routes) {
      await visit(page, route);
      for (const width of report.widths) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
        await page.waitForFunction(() =>
          [...document.querySelectorAll("img")]
            .filter((i) => i.loading !== "lazy")
            .every((i) => i.complete && i.naturalWidth > 0),
        );
        const result = await page.evaluate(() => ({
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelectorAll("main h1").length,
          lang: document.documentElement.lang,
          brokenImages: [...document.querySelectorAll("img")].filter(
            (i) =>
              i.loading !== "lazy" && (!i.complete || i.naturalWidth === 0),
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
    return { pages: 18, widths: 9, observations: report.responsive.length };
  });
  await test("Hero CTA, photography, narrow landscape and no JavaScript", async () => {
    const evidence = [];
    for (const route of ["/", "/en/"])
      for (const [width, height] of [
        [320, 740],
        [390, 844],
        [430, 932],
        [1440, 1000],
        [1920, 1080],
        [844, 390],
      ]) {
        await page.setViewportSize({ width, height });
        await visit(page, route);
        const state = await page.evaluate(() => {
          const image = document.querySelector(".hero-photograph"),
            action = document.querySelector(".hero-action"),
            h = document.querySelector(".hero-opening h1");
          return {
            image: image.getBoundingClientRect().toJSON(),
            action: action.getBoundingClientRect().toJSON(),
            heading: h.getBoundingClientRect().toJSON(),
            source: document.querySelector(".hero-photograph img").currentSrc,
            opacity: getComputedStyle(action).opacity,
          };
        });
        assert.equal(state.opacity, "1");
        assert(state.heading.top >= state.image.bottom);
        assert(state.action.right <= width);
        if (height >= 740)
          assert(
            state.action.bottom <= height,
            route + " CTA below viewport at " + width,
          );
        evidence.push({
          route,
          width,
          height,
          actionBottom: state.action.bottom,
          source: state.source,
        });
      }
    const nojs = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const p = await nojs.newPage();
    await p.goto(origin + base + "/");
    assert(await p.locator("h1").isVisible());
    assert(await p.locator(".hero-action").isVisible());
    assert.equal(
      await p.locator(".hero-photograph img").evaluate((i) => i.naturalWidth),
      640,
    );
    await nojs.close();
    return { evidence, noJavaScript: true };
  });
  await test("Mobile menu: focus containment, Escape, rapid close, scroll restore, language and theme", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, "/");
    for (const wait of [40, 110, 600]) {
      await page.locator(".menu-toggle").click();
      await delay(wait);
      assert.equal(
        await page.evaluate(() => document.body.style.overflow),
        "hidden",
      );
      await page.keyboard.press("Tab");
      assert(
        await page
          .locator(".mobile-menu")
          .evaluate((el) => el.contains(document.activeElement)),
      );
      await page.keyboard.press("Escape");
      await page.waitForFunction(
        () => !document.querySelector(".mobile-menu").open,
      );
      assert(
        await page
          .locator(".menu-toggle")
          .evaluate((el) => document.activeElement === el),
      );
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    }
    await page.locator(".menu-toggle").click();
    await page.locator(".mobile-bottom button").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => !document.querySelector(".mobile-menu").open,
    );
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.locator(".language-switch").click();
    await page.waitForURL("**/en/");
    await page.waitForFunction(() => document.documentElement.lang === "en");
    await page.locator(".menu-toggle").click();
    await page.locator(".mobile-bottom button").click();
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => !document.querySelector(".mobile-menu").open,
    );
    return { cycles: 3, persistentTheme: true, language: true };
  });
  await test("Culture: 4 stages × 3 lenses, keyboard, stable panels and source-image focus", async () => {
    const evidence = [];
    for (const width of [320, 390, 768, 1440])
      for (const route of ["/culture-ai/", "/en/culture-ai/"]) {
        await page.setViewportSize({ width, height: 1000 });
        await visit(page, route);
        const stages = page.locator(".installation-tabs [role=tab]");
        let heights = [];
        for (const stage of [0, 1, 2, 3, 1, 0]) {
          await stages.nth(stage).click();
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
        assert.equal(await stages.last().getAttribute("aria-selected"), "true");
        await page.keyboard.press("Home");
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
  await test("Three flagship cases: source plates, fast chapter navigation, backtracking and next project", async () => {
    const observations = [];
    for (const width of [360, 430, 1440])
      for (const route of [...cases, ...englishCases]) {
        await page.setViewportSize({ width, height: 1000 });
        await visit(page, route);
        const links = page.locator(".case-reading-rail a"),
          count = await links.count();
        await links.last().click();
        await delay(850);
        assert.equal(
          await links.last().getAttribute("aria-current"),
          "step",
          route + " last",
        );
        await links.first().click();
        await delay(850);
        assert.equal(
          await links.first().getAttribute("aria-current"),
          "step",
          route + " first",
        );
        for (const i of [count - 1, 1, 0]) {
          await links.nth(i).evaluate((e) => e.click());
          await delay(40);
        }
        await delay(900);
        assert.equal(
          await links.first().getAttribute("aria-current"),
          "step",
          route + " rapid reverse",
        );
        const buttons = page.locator(".study-controls button");
        for (let i = 0; i < (await buttons.count()); i++) {
          await buttons.nth(i).click();
          assert.equal(
            await buttons.nth(i).getAttribute("aria-pressed"),
            "true",
          );
        }
        await page.locator(".project-study .image-inspect-trigger").click();
        await page.waitForSelector(".project-study dialog[open]");
        await page.keyboard.press("Escape");
        await page.locator(".case-film-result > details > summary").click();
        assert(
          (await page
            .locator(".case-film-result > details")
            .getAttribute("open")) !== null,
        );
        assert((await page.locator(".case-capability-links a").count()) === 2);
        assert(
          (await page.locator(".case-next").getAttribute("href")).startsWith(
            base,
          ),
        );
        await page.reload();
        assert.equal(await page.locator("main h1").count(), 1);
        observations.push({
          route,
          width,
          chapters: count,
          views: await buttons.count(),
        });
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
  await test("Touch journey, reversed rail selection and opt-in film", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, "/");
    const phases = page.locator(".artifact-mobile-index a");
    await phases.nth(4).tap();
    await page.waitForFunction(
      () => document.querySelector(".artifact-journey").dataset.active === "4",
    );
    await phases.nth(1).tap();
    await page.waitForFunction(
      () => document.querySelector(".artifact-journey").dataset.active === "1",
    );
    await phases.nth(1).focus();
    await page.keyboard.press("End");
    await page.waitForFunction(
      () => document.querySelector(".artifact-journey").dataset.active === "4",
    );
    await page.waitForFunction(() => {
      const rail = document.querySelector(".artifact-steps");
      return Math.abs(rail.scrollLeft - 4 * rail.clientWidth) < 2;
    });
    const rail = await page
      .locator(".artifact-steps")
      .evaluate((el) => ({ left: el.scrollLeft, width: el.clientWidth }));
    assert(Math.abs(rail.left - 4 * rail.width) < 2);
    const filmPage = await context.newPage();
    // Validate the UI without transferring the external 97MB film.
    await filmPage.route("**/brand/company-films/company.mp4", (route) =>
      route.abort(),
    );
    await visit(filmPage, "/");
    assert.equal(await filmPage.locator("video").count(), 0);
    await filmPage.locator(".film-trigger").click();
    const video = await filmPage
      .locator(".film-dialog video")
      .evaluate((el) => ({ controls: el.controls, autoplay: el.autoplay }));
    assert.equal(video.controls, true);
    assert.equal(video.autoplay, false);
    await filmPage.keyboard.press("Escape");
    await filmPage.waitForFunction(
      () => !document.querySelector(".film-dialog").open,
    );
    assert.equal(await filmPage.locator("video").count(), 0);
    await filmPage.close();
    return {
      touchSelection: [4, 1],
      keyboardEnd: true,
      rail,
      optInFilmUI: true,
      externalPlayback: "not tested; transfer intentionally blocked",
    };
  });
  await test("Reduced motion, live preference change, keyboard and deep-link compatibility", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of [
      "/",
      "/en/",
      ...cases,
      "/culture-ai/",
      "/services/",
      "/research/",
      "/contact/",
    ]) {
      await visit(page, route);
      const hidden = await page
        .locator("main [data-motion-enter]")
        .evaluateAll(
          (els) => els.filter((e) => +getComputedStyle(e).opacity !== 1).length,
        );
      assert.equal(hidden, 0, route);
    }
    await visit(page, "/culture-ai/");
    await page.locator(".installation-tabs [role=tab]").first().focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page
        .locator(".installation-tabs [role=tab]")
        .nth(1)
        .getAttribute("aria-selected"),
      "true",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await visit(page, "/");
    await page.locator(".quiet-manifesto").scrollIntoViewIfNeeded();
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".quiet-manifesto h2")
        .evaluate((e) => getComputedStyle(e).opacity),
      "1",
    );
    await page.goto(origin + base + "/work/gaomiao/?source=qa#case-context");
    await page.waitForURL("**/cases/gaomiao/?source=qa#case-context");
    await page.reload();
    assert.equal(await page.locator("h1").count(), 1);
    await page.goto(origin + base + "/missing-v3-page/");
    assert(await page.locator("main").innerText());
    await page.emulateMedia({ reducedMotion: "no-preference" });
    return {
      reduce: true,
      keyboard: true,
      oldPathPreservesQueryAndHash: true,
      notFound: true,
    };
  });
  await test("Production screenshots, lazy media and console", async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await visit(page, "/");
    await shot(page, "home-desktop");
    await page
      .locator(".selected-work")
      .evaluate((e) =>
        scrollTo({ top: e.offsetTop - 72, behavior: "instant" }),
      );
    await shot(page, "work-desktop");
    for (const route of cases) {
      await visit(page, route);
      await page
        .locator(".project-study")
        .evaluate((e) =>
          scrollTo({ top: e.offsetTop - 150, behavior: "instant" }),
        );
      await shot(page, route.split("/")[2] + "-desktop");
    }
    await visit(page, "/culture-ai/");
    await page
      .locator(".installation-scene")
      .evaluate((e) =>
        scrollTo({ top: e.offsetTop - 150, behavior: "instant" }),
      );
    await shot(page, "culture-desktop");
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [route, name] of [
      ["/", "home-mobile"],
      ["/en/", "home-english-mobile"],
      ["/services/", "services-mobile"],
      ["/contact/", "contact-mobile"],
    ]) {
      await visit(page, route);
      await shot(page, name);
    }
    await visit(page, "/culture-ai/");
    await page
      .locator(".installation-scene")
      .evaluate((e) =>
        scrollTo({ top: e.offsetTop - 130, behavior: "instant" }),
      );
    await shot(page, "culture-mobile");
    await visit(page, "/cases/liye-qin-slips/");
    await page
      .locator(".project-study")
      .evaluate((e) =>
        scrollTo({ top: e.offsetTop - 142, behavior: "instant" }),
      );
    await shot(page, "liye-mobile");
    assert.deepEqual(report.errors, []);
    return { screenshots: report.screenshots, applicationErrors: 0 };
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
    "docs/qa/v3.0-browser.json",
    JSON.stringify(report, null, 2),
  );
  console.log(`V3 QA: ${report.passed} passed, ${report.failed} failed`);
  if (report.failed) process.exitCode = 1;
}
