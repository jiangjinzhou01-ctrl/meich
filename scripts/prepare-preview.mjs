// Isolated production QA, preserving the real Next dev command and /meich assets.
import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const destination = path.resolve(process.argv[2] || "qa-results/preview");
await mkdir(path.join(destination, ".openai"), { recursive: true });
await writeFile(
  path.join(destination, ".openai/hosting.json"),
  JSON.stringify({ static: { directory: "dist" } }, null, 2),
);
await cp("out", path.join(destination, "dist/meich"), { recursive: true });
await writeFile(
  path.join(destination, "dist/index.html"),
  '<meta http-equiv="refresh" content="0;url=/meich/">',
);
await writeFile(
  path.join(destination, "dist/qa.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><title>MGC V2.5 — production QA</title><style>body{margin:0;background:#d8d6cf;font:14px system-ui}nav{padding:10px;display:flex;gap:10px;flex-wrap:wrap;background:#fff;position:sticky;top:0;z-index:2}iframe{display:block;background:#f6f5f1;border:0; margin:20px auto;width:390px;height:844px}select,button{padding:6px}</style><nav><label>Viewport <select id="width">${[320, 360, 375, 390, 412, 430, 768, 1024, 1440, 1920].map((w) => "<option " + (w === 390 ? "selected" : "") + ">" + w + "</option>").join("")}</select></label><label>Page <select id="route">${["", "en/", "cases/liye-qin-slips/", "cases/potala-snow-city/", "cases/gaomiao/", "services/", "culture-ai/", "cases/", "products/", "contact/", "en/contact/", "research/"].map((r) => '<option value="' + r + '">' + (r || "Chinese home") + "</option>").join("")}</select></label><a href="/meich/">Open full page</a></nav><iframe title="MGC production preview" src="/meich/"></iframe><script>const frame=document.querySelector('iframe');document.querySelector('#width').onchange=e=>{frame.style.width=e.target.value+'px';frame.style.height=(+e.target.value<768?844:1000)+'px'};document.querySelector('#route').onchange=e=>frame.src='/meich/'+e.target.value;</script></html>`,
);
console.log(
  `Production export copied to ${destination}. Serve this directory with sites-preview; QA harness: /qa.html`,
);
