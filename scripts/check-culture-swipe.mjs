// Called by check:swipe against the exact Culture × AI surface, not the homepage artifact rail.
import assert from "node:assert/strict";
import fs from "node:fs/promises";

export async function checkCultureSwipes({ browser, origin, test, report, widths = [320, 360, 390, 412, 430], routes }) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  page.on("pageerror", e => report.errors.push(e.message));
  const cdp = await context.newCDPSession(page);
  const rail = page.locator(".installation-visual-rail");
  const tabs = page.locator(".installation-tabs [role=tab]");
  async function aligned(index) {
    try { await page.waitForFunction(index => {
      const rail = document.querySelector(".installation-visual-rail");
      const root = document.querySelector(".culture-installation");
      return !rail.classList.contains("is-dragging") && Math.abs(rail.scrollLeft - index * rail.clientWidth) < 2 &&
        Number(root.dataset.active) === index && root.querySelectorAll('[role=tab]')[index].getAttribute("aria-selected") === "true";
    }, index); } catch (error) {
      const state = await rail.evaluate(el => ({ left: el.scrollLeft, width: el.clientWidth, classes: el.className, active: document.querySelector(".culture-installation").dataset.active, scrollY }));
      throw new Error(`Expected Culture stage ${index}: ${JSON.stringify(state)}\n${error.stack}`);
    }
  }
  async function position() {
    await rail.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 180, behavior: "instant" }));
  }
  async function reset(index) {
    await tabs.nth(index).tap(); await aligned(index); await position();
  }
  async function drag(dx, dy = 0, duration = 180, follow = false) {
    const box = await rail.boundingBox();
    const x = box.x + (dx < 0 ? box.width - 25 : 25), y = box.y + 130;
    const started = Date.now() / 1000;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", timestamp: started, touchPoints: [{ x, y, id: 1 }] });
    const startIndex = await rail.evaluate(el => Math.round(el.scrollLeft / el.clientWidth));
    const before = await rail.evaluate(el => el.scrollLeft);
    const points = duration <= 60 ? 3 : 6;
    for (let n = 1; n <= points; n++) {
      await new Promise(resolve => setTimeout(resolve, duration / points));
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", timestamp: started + duration * n / points / 1000, touchPoints: [{ x: x + dx * n / points, y: y + dy * n / points, id: 1 }] });
    }
    if (follow) {
      const moved = await rail.evaluate(el => el.scrollLeft) - before;
      assert(moved > 20, "The actual Culture image must move before the finger is released");
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", timestamp: started + duration / 1000, touchPoints: [] });
    return startIndex;
  }
  try {
    for (const width of widths) {
      const targets = routes || (width === 390 ? ["", "en/", "culture-ai/", "en/culture-ai/"] : ["", "culture-ai/"]);
      for (const route of targets) {
        await test(`Culture touch ${width}px /${route}: swipe all stages, reverse, edges and controls`, async () => {
          await page.setViewportSize({ width, height: 844 });
          await page.goto(origin + route, { waitUntil: "networkidle" });
          await page.waitForSelector(".installation-visual-rail.has-swipe-control");
          await position();
          for (const i of [1, 2, 3]) { await drag(-75, 0, 180, true); await aligned(i); }
          await drag(-130); await aligned(3);
          await drag(75); await aligned(2);
          await reset(0); await drag(130); await aligned(0);
          await drag(-15); await aligned(0);
          await drag(-48, 0, 30, true); await aligned(1);
          await reset(0); await drag(-width + 50, 0, 60, true); await aligned(1);
          const before = await page.evaluate(() => scrollY);
          await drag(3, -110);
          await page.waitForFunction(before => scrollY > before + 40, before);
          // Wait for native vertical momentum to stop; the first tap during a fling can only stop scrolling.
          await page.waitForFunction(() => {
            const previous = window.__cultureScrollSample;
            if (!previous || previous.y !== scrollY) window.__cultureScrollSample = { y: scrollY, time: performance.now() };
            return performance.now() - window.__cultureScrollSample.time > 120;
          });
          await aligned(1);
          await reset(0);
          // Text, tabs and the source inspector must remain interactive above the swipe surface.
          for (let lens = 0; lens < 3; lens++) {
            await page.locator(".lens-controls button").nth(lens).tap();
            assert.equal(await page.locator(".installation-scene").getAttribute("data-detail"), String(lens));
          }
          await page.locator(".installation-inspect .image-inspect-trigger").tap();
          await page.waitForSelector(".installation-inspect dialog[open]");
          await page.locator(".image-inspector-toolbar button").last().tap();
          await page.waitForFunction(() => !document.querySelector(".installation-inspect dialog").open);
          await page.locator(".installation-reset").tap(); await aligned(0);
          assert.equal(await page.locator(".installation-scene").getAttribute("data-detail"), "0");
          await tabs.first().focus(); await page.keyboard.press("End"); await aligned(3);
          await page.keyboard.press("Home"); await aligned(0);
          await position();
          if (width === 390 && route === "culture-ai/") {
            await fs.mkdir("docs/qa/culture-touch", { recursive: true });
            await page.screenshot({ path: "docs/qa/culture-touch/mobile.png" });
          }
          return { stagesBySwipe: [0, 1, 2, 3], fingerTracking: true, strongFling: "0→1", verticalScroll: true, lenses: 3, inspector: true, keyboard: true };
        });
      }
    }
    await test("Culture touch: reduced motion, interruption and rotation", async () => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await reset(0); await drag(-75); await aligned(1);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await drag(-75, 0, 80);
      const start = await drag(90, 0, 100); await aligned(Math.max(0, start - 1));
      await reset(2);
      await page.setViewportSize({ width: 768, height: 844 });
      await page.waitForFunction(() => +document.querySelector(".culture-installation").dataset.active === 2);
      await tabs.nth(3).tap();
      await page.setViewportSize({ width: 390, height: 844 }); await aligned(3);
      await tabs.first().focus(); await page.keyboard.press("Home"); await aligned(0);
      await page.keyboard.press("ArrowRight"); await page.keyboard.press("ArrowRight"); await aligned(2);
      assert(await tabs.nth(2).evaluate(el => el === document.activeElement));
      return { reducedMotion: true, interrupted: true, desktopToMobileStage: 3 };
    });
  } finally { await context.close(); }
}
