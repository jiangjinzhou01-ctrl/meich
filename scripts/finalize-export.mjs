import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
async function walk(dir) {
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) await walk(p);
    else if (f.name.endsWith(".html")) {
      const html = await readFile(p, "utf8");
      if (p.includes(`${path.sep}en${path.sep}`))
        await writeFile(p, html.replace(/(<html[^>]*\blang=")[^"]+/, "$1en"));
    }
  }
}
await walk("out");
await writeFile("out/.nojekyll", "");
console.log(
  "Static export finalised: English document language and GitHub Pages assets.",
);
