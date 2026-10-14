// Optional browser QA; Playwright is a test tool, never shipped to site visitors.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.MGC_PLAYWRIGHT_MODULE || "playwright");
const port = process.env.MGC_QA_PORT || "3012";
const origin = `http://127.0.0.1:${port}`;
const report = { createdAt: new Date().toISOString(), browser: "Chromium emulation; not physical Android / Safari", tests: [], widths: [320,375,390,430,768,1024,1440,1920], errors: [], screenshots: [] };
await fs.mkdir("docs/qa", { recursive: true });
const server = spawn(process.execPath, ["app/server.js"], {
  cwd: "dist/MGC-Enterprise-Server", env: { ...process.env, PORT: port, HOSTNAME: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;
async function test(name, work) {
  if (process.env.MGC_QA_ONLY && !name.includes(process.env.MGC_QA_ONLY)) return;
  try { const evidence = await work(); report.tests.push({ name, result: "passed", evidence }); console.log(`PASS ${name}`); }
  catch (error) { report.tests.push({ name, result: "failed", error: error.message }); console.log(`FAIL ${name}: ${error.message}`); }
}
async function visit(page, route) {
  const response = await page.goto(origin + route, { waitUntil: "domcontentloaded" });
  assert.equal(response.status(), 200, route);
  await page.waitForSelector(".motion-root[data-navigation]", { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready.then(() => true));
}
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function visibleText(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll("[data-reveal]")).filter((el) => {
    const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && r.top < innerHeight * .9 && r.bottom > 72;
  }).map((el) => ({ text: el.textContent.trim().slice(0,30), opacity: getComputedStyle(el).opacity, filter: getComputedStyle(el).filter, pending: el.classList.contains("reveal-ready") })));
}
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Server readiness timeout")), 15000);
    server.stdout.on("data", (data) => { if (data.toString().includes("Ready")) { clearTimeout(timeout); resolve(); } });
    server.once("error", reject); server.once("exit", (code) => reject(new Error(`Server exited ${code}`)));
  });
  browser = await chromium.launch({ headless: true,
    executablePath: process.env.MGC_CHROMIUM_PATH || undefined,
    args: process.env.MGC_CHROMIUM_ARGS ? JSON.parse(process.env.MGC_CHROMIUM_ARGS) : [],
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  context.setDefaultTimeout(8000);
  // Minimal Linux runners may have no CJK system fonts. Supply a QA-only fallback.
  if (process.env.MGC_QA_FONT_DIR) {
    const directory = process.env.MGC_QA_FONT_DIR;
    const css = (await fs.readFile(directory + "/400.css", "utf8")).replaceAll("./files/", origin + "/__qa-font/");
    await context.route("**/__qa-font/*", async (route) => {
      const name = new URL(route.request().url()).pathname.split("/").pop();
      await route.fulfill({ body: await fs.readFile(directory + "/files/" + name), contentType: "font/woff2" });
    });
    await context.addInitScript((css) => {
      const style = document.createElement("style"); style.textContent = css;
      const attach = () => { if (document.head) document.head.appendChild(style); else requestAnimationFrame(attach); };
      attach();
    }, css);
  }
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && /hydration|uncaught|react error/i.test(message.text())) report.errors.push(message.text()); });
  await page.addInitScript(() => {
    window.__focusFrames = [];
    const start = performance.now();
    function sample() {
      const el = document.querySelector(".hero-opening h1 [data-motion-enter]");
      if (el) window.__focusFrames.push({ opacity: +getComputedStyle(el).opacity, filter: getComputedStyle(el).filter });
      if (performance.now() - start < 1800) requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  await test("首屏真实聚焦与最终清晰", async () => {
    await visit(page, "/"); await pause(1500);
    const frames = await page.evaluate(() => window.__focusFrames);
    assert(frames.some((frame) => frame.opacity > 0 && frame.opacity < .97), "Opening must have intermediate frames");
    const state = await page.locator(".hero-opening h1 .motion-line").evaluateAll((els) => els.map((el) => ({ filter: getComputedStyle(el).filter, opacity: getComputedStyle(el).opacity, duration: getComputedStyle(el).animationDuration })));
    assert(state.every((item) => item.opacity === "1" && ["none","blur(0px)"].includes(item.filter)));
    return { sampledFrames: frames.length, lines: state };
  });
  await test("组内顺序、慢速与快速滚动", async () => {
    await page.locator(".quiet-manifesto").evaluate((el) => window.scrollTo({ top: el.offsetTop - 140, behavior: "instant" }));
    const delays = await page.locator(".quiet-manifesto [data-reveal]").evaluateAll((els) => els.map((el) => getComputedStyle(el).transitionDelay));
    await pause(1500);
    assert((await visibleText(page)).every((item) => +item.opacity > .98 && ["none","blur(0px)"].includes(item.filter)));
    for (let i=0;i<5;i++) { await page.mouse.wheel(0,110); await pause(90); }
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await pause(1200);
    assert((await visibleText(page)).every((item) => +item.opacity > .98));
    return { delays, footerVisible: true };
  });
  await test("八个断点与四类页面无横向溢出", async () => {
    const observations = [];
    for (const width of report.widths) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      for (const route of ["/","/services/","/cases/liye-qin-slips/","/contact/"]) {
        await visit(page, route); await pause(120);
        const size = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
        assert(size.scrollWidth <= width + 1, `${route} at ${width}: ${size.scrollWidth}`);
        observations.push({ route, ...size });
      }
    }
    return observations;
  });
  await test("主要公共页面和英文页动效覆盖", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    const routes = ["/cases/","/solutions/","/culture-ai/","/research/","/research/technology/","/about/","/insights/","/insights/culture-in-experience/","/careers/","/privacy/","/products/","/products/areas/display/","/en/","/en/services/","/en/culture-ai/","/en/research/","/en/about/"];
    const evidence = [];
    for (const route of routes) {
      await visit(page, route);
      const count = await page.locator("main [data-reveal]").count();
      assert(count > 2, route);
      assert(await page.locator("main h1[data-reveal],main h1 [data-reveal]").count(), route + " hero");
      evidence.push({ route, revealElements: count });
    }
    return evidence;
  });
  await test("圆形菜单重复开关、退出、焦点与客户端导航", async () => {
    await visit(page, "/");
    for (let i=0;i<3;i++) {
      await page.locator(".menu-toggle").click();
      await page.waitForSelector(".mobile-menu[open]");
      await pause(600);
      assert.equal(await page.locator(".mobile-primary a").first().evaluate((el)=>getComputedStyle(el).filter), "none");
      await page.keyboard.press("Escape");
      await page.waitForFunction(()=>!document.querySelector(".mobile-menu").open);
      assert(await page.locator(".menu-toggle").evaluate((el)=>document.activeElement===el));
      assert.equal(await page.evaluate(()=>document.body.style.overflow), "");
    }
    for (const delay of [30,90,170,350]) {
      await page.locator(".menu-toggle").click(); await pause(delay);
      await page.keyboard.press("Escape");
      const start = await page.locator(".mobile-primary a").first().evaluate((el)=>+el.style.getPropertyValue("--menu-exit-opacity"));
      for (let i=0;i<5;i++) {
        const opacity = await page.locator(".mobile-primary a").first().evaluate((el)=>+getComputedStyle(el).opacity);
        assert(opacity <= start + .02, "Interrupted menu text must never jump to full opacity"); await pause(16);
      }
      const radius = await page.locator(".mobile-menu").evaluate((el)=>({
        exit: parseFloat(el.style.getPropertyValue("--menu-exit-clip").match(/circle\(([^ ]+)/)?.[1] || "0"),
        full: parseFloat(el.style.getPropertyValue("--menu-radius")),
      }));
      assert(radius.exit <= radius.full + 1);
      await page.waitForFunction(()=>!document.querySelector(".mobile-menu").open);
    }
    await page.locator(".menu-toggle").click();
    await pause(600);
    await page.locator('.mobile-primary a[href="/services/"]').click();
    assert.equal(await page.locator(".mobile-menu").getAttribute("data-closing"), "true");
    await page.waitForURL("**/services/");
    assert.equal(await page.locator(".mobile-menu").evaluate((el)=>el.open), false);
    return { cycles: 3, interruptedCycles: 4, exitBeforeNavigation: true };
  });
  await test("服务与 Culture × AI 连续切换无旧面板重叠", async () => {
    await visit(page, "/services/");
    const tabs = page.locator(".service-index-list [role=tab]");
    for (const n of [1,2,3,0,2]) { await tabs.nth(n).click(); await pause(35); }
    assert.equal(await page.locator(".service-index-panel").count(),1);
    assert.equal(await tabs.nth(2).getAttribute("aria-selected"), "true");
    await pause(350);
    assert.equal(await page.locator(".service-index-panel").evaluate((el)=>getComputedStyle(el).filter), "none");
    await visit(page, "/culture-ai/");
    for (const n of [1,3,2,0,2]) { await page.locator(".installation-tabs [role=tab]").nth(n).click(); await pause(35); }
    assert.equal(await page.locator(".installation-reading").count(),1);
    assert.equal(await page.locator(".installation-tabs [role=tab]").nth(2).getAttribute("aria-selected"), "true");
    return { servicePanelCount: 1, culturePanelCount: 1 };
  });
  await test("搜索输入不模糊、空结果与短错峰", async () => {
    await visit(page, "/services/");
    const input = page.locator(".journey-form input");
    await input.fill("MGC-unmatched-2026");
    assert.equal(await input.inputValue(), "MGC-unmatched-2026");
    assert.equal(await input.evaluate((el)=>getComputedStyle(el).filter), "none");
    await input.press("Enter"); await page.waitForSelector(".journey-empty");
    await page.locator(".journey-empty button").click();
    await input.fill("博物馆"); await input.press("Enter");
    await page.waitForSelector(".journey-result");
    const delays = await page.locator(".journey-result").evaluateAll((els)=>els.map((el)=>parseFloat(el.style.getPropertyValue("--result-delay"))));
    assert(Math.max(...delays) <= 120);
    assert(await page.locator(".journey-result").count()>0);
    return { results: delays.length, maxDelay: Math.max(...delays), emptyState: true };
  });
  await test("返回与滚动恢复不重新隐藏已读内容", async () => {
    await visit(page, "/");
    await page.evaluate(()=>window.scrollTo({top:1200,behavior:"instant"})); await pause(1200);
    const previous = await page.evaluate(()=>scrollY);
    await page.locator(".menu-toggle").click(); await pause(600);
    await page.locator('.mobile-primary a[href="/about/"]').click(); await page.waitForURL("**/about/");
    await page.goBack({waitUntil:"domcontentloaded"});
    await page.waitForURL(origin+"/"); await pause(300);
    const restoredY = await page.evaluate(()=>scrollY);
    assert(Math.abs(restoredY-previous)<100, `Scroll ${previous} -> ${restoredY}`);
    assert.equal(await page.locator(".motion-root").getAttribute("data-navigation"), "restore");
    assert((await visibleText(page)).every((item)=>+item.opacity>.98));
    return { previous, restoredY };
  });
  await test("减少动态、运行中禁用、深色主题与表单可读", async () => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/","/cases/gaomiao/","/services/","/research/","/contact/"]) {
      await visit(page,route);
      assert((await visibleText(page)).every((item)=>+item.opacity===1 && ["none","blur(0px)"].includes(item.filter)));
    }
    const field = page.locator(".contact-form input").first();
    if (await field.count()) { await field.fill("动效验收"); assert.equal(await field.inputValue(),"动效验收"); }
    await page.locator(".menu-toggle").click();
    await page.locator(".mobile-bottom button").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.keyboard.press("Escape");
    await page.waitForFunction(()=>!document.querySelector(".mobile-menu").open);
    await page.emulateMedia({reducedMotion:"no-preference"});
    await visit(page,"/"); await page.locator(".quiet-manifesto").scrollIntoViewIfNeeded();
    await page.emulateMedia({reducedMotion:"reduce"}); await pause(100);
    assert((await visibleText(page)).every((item)=>+item.opacity===1));
    return { reduceRoutes: 5, livePreferenceChange: true, darkTheme: true };
  });
  await test("代表性视觉截图与控制台", async () => {
    await page.emulateMedia({reducedMotion:"no-preference"});
    await page.evaluate(()=>{document.documentElement.dataset.theme="light";localStorage.setItem("meichuang-theme","light")});
    await page.setViewportSize({width:390,height:844}); await visit(page,"/"); await pause(1500);
    await page.screenshot({path:"docs/qa/motion-home-mobile.png"}); report.screenshots.push("motion-home-mobile.png");
    await page.setViewportSize({width:1440,height:1000}); await visit(page,"/"); await pause(1500);
    await page.screenshot({path:"docs/qa/motion-home-desktop.png"}); report.screenshots.push("motion-home-desktop.png");
    await visit(page,"/cases/liye-qin-slips/"); await page.locator(".case-chapter-copy").first().scrollIntoViewIfNeeded(); await pause(1500);
    await page.screenshot({path:"docs/qa/motion-case-chapter.png"}); report.screenshots.push("motion-case-chapter.png");
    assert.deepEqual(report.errors,[]);
    return { screenshots: report.screenshots, pageErrors: report.errors.length };
  });
} catch (error) {
  report.tests.push({name:"Browser/runtime setup",result:"failed",error:error.message});
  console.error(error);
} finally {
  await browser?.close(); server.kill("SIGTERM");
  report.passed=report.tests.filter((test)=>test.result==="passed").length;
  report.failed=report.tests.filter((test)=>test.result==="failed").length;
  await fs.writeFile("docs/qa/" + (process.env.MGC_QA_REPORT || "motion-regression.json"),JSON.stringify(report,null,2));
  console.log(`Motion QA: ${report.passed} passed, ${report.failed} failed`);
  if (report.failed) process.exitCode=1;
}
