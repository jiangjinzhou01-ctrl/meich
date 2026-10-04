import { cp, mkdir, readdir, rm, access, writeFile, chmod } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
const project = process.cwd();
await access(path.join(project, ".next/standalone/server.js"));
const output = path.join(project, "dist/MGC-Enterprise-Server");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(project, ".next/standalone"), path.join(output, "app"), { recursive: true, dereference: true });
await cp(path.join(project, ".next/static"), path.join(output, "app/.next/static"), { recursive: true });
await cp(path.join(project, "public"), path.join(output, "app/public"), { recursive: true });
const excluded = new Set([".git", ".next", "node_modules", "out", "dist", "qa", "qa-results"]);
await mkdir(path.join(output, "source"), { recursive: true });
for (const entry of await readdir(project)) {
  if (excluded.has(entry)) continue;
  await cp(path.join(project, entry), path.join(output, "source", entry), {
  recursive: true,
  filter: source => {
    const relative = path.relative(project, source);
    if (!relative) return true;
    const parts = relative.split(path.sep);
    const name = path.basename(source);
    return !excluded.has(parts[0]) && !(name.startsWith(".env") && name !== ".env.example") &&
      !name.endsWith(".tsbuildinfo") && !(relative.startsWith(`docs${path.sep}qa${path.sep}`) && (name.endsWith(".png") || parts.includes("previous-snapshot")));
  },
});
}
for (const entry of await readdir(path.join(project, "deployment")))
  await cp(path.join(project, "deployment", entry), path.join(output, entry), { recursive: true });
await chmod(path.join(output, "start.sh"), 0o755);
let commit = null;
try { commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch {}
await writeFile(path.join(output, "BUILD-INFO.json"), JSON.stringify({
  sourceCommit: commit,
  createdAt: new Date().toISOString(),
  runtime: "Next.js standalone / Node.js 22 or newer",
  platform: "Linux x64 prebuilt; rebuild source for other platforms",
  basePath: "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.mgcdigi.com",
  cms: "UI and browser drafts only; no authentication, database or publish backend yet",
}, null, 2));
console.log(`Enterprise server package created: ${output}`);
