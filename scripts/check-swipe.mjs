// Real Chromium touch input regression; optional QA tooling stays outside production dependencies.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
const { chromium } = createRequire(import.meta.url)(process.env.MGC_PLAYWRIGHT_MODULE || "playwright");
const port = process.env.MGC_SWIPE_QA_PORT || "3032";
const origin = `http://127.0.0.1:${port}/meich/`;
const report = { createdAt: new Date().toISOString(), environment: "Chromium CDP touch input, emulated phones; not physical Android/iOS", tests: [], errors: [] };
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: port, NEXT_PUBLIC_BASE_PATH: "/meich" }, stdio: ["ignore", "pipe", "pipe"],
});
let browser;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function test(name, work) {
  try { const evidence = await work(); report.tests.push({ name, result: "passed", evidence }); console.log("PASS", name); }
  catch (error) { report.tests.push({ name, result: "failed", error: error.stack }); console.log("FAIL", name, error.message); }
}
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Static preview readiness timeout")), 10000);
    server.stdout.on("data", data => { if (data.toString().includes("Preview:")) { clearTimeout(timer); resolve(); } });
    server.once("error", reject);
  });
  browser = await chromium.launch({ headless: true, executablePath: process.env.MGC_CHROMIUM_PATH || undefined,
    args: process.env.MGC_CHROMIUM_ARGS ? JSON.parse(process.env.MGC_CHROMIUM_ARGS) : [] });
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on("pageerror", e => report.errors.push(e.message));
  const cdp = await context.newCDPSession(page);
  const rail = page.locator(".artifact-steps");
  async function aligned(index) {
    await page.waitForFunction(index => {
      const rail = document.querySelector(".artifact-steps");
      return Math.abs(rail.scrollLeft - index * rail.clientWidth) < 2 &&
        Number(document.querySelector(".artifact-journey").dataset.active) === index;
    }, index, { timeout: 5000 });
  }
  async function reset(index) {
    await rail.evaluate((el, index) => {
      el.scrollTo({ left: index * el.clientWidth, behavior: "instant" });
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 150, behavior: "instant" });
    }, index);
    await aligned(index);
  }
  async function drag(dx, dy, duration, points = 6) {
    const box = await rail.boundingBox();
    const x = dx < 0 ? box.width - 28 : 28, y = box.y + 150;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 1 }] });
    for (let n = 1; n <= points; n++) {
      await pause(duration / points);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + dx * n / points, y: y + dy * n / points, id: 1 }] });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  for (const width of [360, 390, 412, 430]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.waitForSelector(".artifact-steps.has-swipe-control");
    await test(`${width}px: short/slow/fast/long gestures, reversal and edges`, async () => {
      const observations = [];
      for (const [name, start, dx, duration, target, points] of [
        ["small nudge returns", 0, -15, 150, 0, 6],
        ["comfortable short drag", 0, -75, 240, 1, 6],
        ["light quick flick", 0, -48, 30, 1, 3],
        ["strong flick stops at next", 0, -width + 55, 60, 1, 6],
        ["reverse short drag", 3, 75, 240, 2, 6],
        ["first edge", 0, 140, 80, 0, 6],
        ["last edge", 4, -140, 80, 4, 6],
      ]) {
        await reset(start); await drag(dx, 0, duration, points); await aligned(target);
        observations.push({ name, start, dx, duration, target, actual: await rail.evaluate(el => el.scrollLeft / el.clientWidth) });
      }
      return observations;
    });
    await test(`${width}px: vertical scrolling, direct chapters and keyboard`, async () => {
      await reset(1);
      const before = await page.evaluate(() => scrollY);
      await drag(3, -155, 180);
      await page.waitForFunction(before => scrollY > before + 60, before, { timeout: 5000 });
      await aligned(1);
      assert.equal(await rail.evaluate(el => el.classList.contains("is-dragging")), false);
      const after = await page.evaluate(() => scrollY);
      await page.locator(".artifact-mobile-index a").nth(4).tap(); await aligned(4);
      await page.locator(".artifact-mobile-index a").last().focus(); await page.keyboard.press("Home"); await aligned(0);
      return { before, after, pageScroll: after - before, directChapter: 4, keyboardHome: 0 };
    });
  }
  await test("Reduced motion and rapid reverse gestures", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await reset(0); await drag(-75, 0, 180); await aligned(1);
    await drag(75, 0, 120); await aligned(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await reset(2); await drag(-75, 0, 100);
    // Interrupt a transition with a new touch; it must not inherit the old fling.
    const start = await rail.evaluate(el => Math.round(el.scrollLeft / el.clientWidth));
    await drag(80, 0, 120); await aligned(Math.max(0, start - 1));
    return { reducedMotion: true, interruptedFrom: start, settledAt: Math.max(0, start - 1) };
  });
  await test("No-JavaScript native pan fallback", async () => {
    const fallback = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const p = await fallback.newPage(); await p.goto(origin);
    const state = await p.locator(".artifact-steps").evaluate(el => ({ controlled: el.classList.contains("has-swipe-control"), touchAction: getComputedStyle(el).touchAction, stop: getComputedStyle(el.firstElementChild).scrollSnapStop }));
    assert.equal(state.controlled, false); assert.equal(state.touchAction, "auto"); assert.equal(state.stop, "always");
    await fallback.close(); return state;
  });
  assert.deepEqual(report.errors, []);
} catch (error) { report.tests.push({ name: "Runtime", result: "failed", error: error.stack }); }
finally {
  await browser?.close(); server.kill("SIGTERM");
  report.passed = report.tests.filter(t => t.result === "passed").length;
  report.failed = report.tests.filter(t => t.result === "failed").length;
  await fs.mkdir("docs/qa", { recursive: true });
  await fs.writeFile(process.env.MGC_SWIPE_QA_REPORT || "docs/qa/swipe-regression.json", JSON.stringify(report, null, 2));
  console.log(`Swipe QA: ${report.passed} passed, ${report.failed} failed`);
  if (report.failed) process.exitCode = 1;
}
