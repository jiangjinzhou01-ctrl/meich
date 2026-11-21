// Browser acceptance of the standalone enterprise package.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";

const { chromium } = createRequire(import.meta.url)(process.env.MGC_PLAYWRIGHT_MODULE || "playwright");
const port = process.env.MGC_QA_PORT || "3012";
const origin = `http://127.0.0.1:${port}`;
const directory = process.env.MGC_REDESIGN_QA_DIR || "qa-results/redesign";
const report = { createdAt: new Date().toISOString(), tests: [], errors: [] };
await fs.mkdir(directory, { recursive: true });
const server = spawn(process.execPath, ["server.js"], {
  cwd: "dist/MGC-Enterprise-Server/app",
  env: { ...process.env, PORT: port, HOSTNAME: "127.0.0.1" },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stderr.on("data", (data) => process.stderr.write(data));

let browser;
async function test(name, work) {
  if (process.env.MGC_QA_ONLY && !name.includes(process.env.MGC_QA_ONLY)) return;
  try {
    const evidence = await work();
    report.tests.push({ name, result: "passed", evidence });
    console.log("PASS", name);
  } catch (error) {
    report.tests.push({ name, result: "failed", error: error.stack });
    console.error("FAIL", name, error.message);
  }
}

try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Standalone preview did not start")), 12000);
    server.stdout.on("data", (data) => {
      if (data.toString().includes("Ready")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.MGC_CHROMIUM_PATH || undefined,
    args: process.env.MGC_CHROMIUM_ARGS ? JSON.parse(process.env.MGC_CHROMIUM_ARGS) : [],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("pageerror", (error) => report.errors.push(error.message));
  async function visit(route) {
    const response = await page.goto(origin + route, { waitUntil: "domcontentloaded" });
    assert.equal(response.status(), 200, route);
    await page.waitForSelector(".motion-root[data-navigation]");
  }

  await test("Root deployment serves project media, metadata and both languages", async () => {
    const routes = ["/", "/cases/", "/cases/liye-qin-slips/", "/services/", "/research/", "/en/about/", "/en/contact/"];
    for (const route of routes) {
      await visit(route);
      await page.waitForFunction(() => [...document.images].filter((img) => img.loading !== "lazy").every((img) => img.complete && img.naturalWidth > 0));
      const href = await page.locator('link[rel="canonical"]').getAttribute("href");
      assert.equal(new URL(href).pathname, route);
      assert.equal(await page.locator("main h1").count(), 1);
      assert.equal(await page.locator("html").getAttribute("lang"), route.startsWith("/en/") ? "en" : "zh-CN");
    }
    return routes;
  });

  await test("Chapter navigation stays readable with reduced motion", async () => {
    await visit("/cases/liye-qin-slips/");
    for (const preference of ["no-preference", "reduce"]) {
      await page.emulateMedia({ reducedMotion: preference });
      const rail = page.locator(".case-reading-rail a");
      for (const index of [2, 1, 3]) {
        await rail.nth(index).click();
        await page.waitForFunction((index) => document.querySelectorAll(".case-reading-rail a")[index].getAttribute("aria-current") === "step", index);
      }
    }
    assert.equal(await page.locator("#case-chapter-3 [data-reveal]").first().evaluate((node) => getComputedStyle(node).opacity), "1");
  });

  await test("Mobile menu restores focus and allows a dark theme", async () => {
    await page.setViewportSize({ width: 390, height: 740 });
    await visit("/");
    const trigger = page.locator(".menu-toggle");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.waitForSelector("#mobile-menu[open]");
    await page.locator(".mobile-menu-actions button").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    assert.equal(await page.locator("#mobile-menu").evaluate((dialog) => getComputedStyle(dialog).animationName), "none");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.getElementById("mobile-menu").open);
    assert(await trigger.evaluate((node) => node === document.activeElement));
    await trigger.click();
    await page.locator(".mobile-menu-actions button").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    await page.keyboard.press("Escape");
  });

  await test("Consultation carries archive context and prepares a local brief", async () => {
    const slug = "brochure-2026-changsha-museum";
    await visit("/cases/" + slug + "/");
    await page.locator(".contact-cta a").click();
    await page.waitForURL("**/contact/?project=" + slug);
    await page.waitForFunction(() => document.querySelector("#message").value.includes("长沙博物馆"));
    await page.locator("#name").fill("QA");
    await page.locator("#company").fill("Test project");
    await page.locator("#contact").fill("qa@example.invalid");
    await page.locator("#consent").check();
    await page.locator(".contact-form button[type=submit]").click();
    assert.match(await page.locator(".form-feedback strong").textContent(), /尚未发送/);
  });

  await test("Content workspace restores a browser draft after reload", async () => {
    await visit("/admin/content/");
    await page.getByPlaceholder("项目或文章的正式标题").fill("QA 项目草稿");
    await page.getByPlaceholder("例如 liye-qin-slips").fill("qa-project");
    await page.getByPlaceholder("用一段话交代文化内容、项目背景或文章主题。").fill("用于检查本地内容保存与打开。");
    await page.getByRole("button", { name: "保存本机草稿" }).click();
    await page.reload();
    await page.locator(".content-draft-list button").filter({ hasText: "QA 项目草稿" }).click();
    assert.equal(await page.getByPlaceholder("项目或文章的正式标题").inputValue(), "QA 项目草稿");
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  });
  await test("Browser runtime errors", async () => assert.deepEqual(report.errors, []));
} catch (error) {
  report.tests.push({ name: "Browser setup", result: "failed", error: error.stack });
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  report.passed = report.tests.filter((test) => test.result === "passed").length;
  report.failed = report.tests.filter((test) => test.result === "failed").length;
  await fs.writeFile(path.join(directory, process.env.MGC_QA_REPORT || "server.json"), JSON.stringify(report, null, 2));
  console.log(`Standalone QA: ${report.passed} passed, ${report.failed} failed`);
  if (report.failed) process.exitCode = 1;
}
