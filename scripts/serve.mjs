// Local preview of Next.js static export. GitHub Pages supplies production hosting.
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { createGzip } from "node:zlib";
const root = path.resolve("out");
const port = Number(process.env.PORT || 3000);
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}
http
  .createServer(async (req, res) => {
    let url;
    try {
      url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    if (basePath && url === basePath) {
      res.writeHead(308, { Location: `${basePath}/` });
      res.end();
      return;
    }
    if (basePath && url.startsWith(`${basePath}/`))
      url = url.slice(basePath.length);
    let file = path.resolve(root, `.${url}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (url.endsWith("/")) file = path.join(file, "index.html");
    if (!(await isFile(file))) {
      const index = path.join(file, "index.html");
      file = (await isFile(index)) ? index : path.join(root, "404.html");
    }
    const extension = path.extname(file);
    const status = file === path.join(root, "404.html") ? 404 : 200;
    const compressed =
      /gzip/.test(req.headers["accept-encoding"] || "") &&
      /\.(html|txt|xml|css|js|json|svg)$/.test(file);
    res.writeHead(status, {
      "Content-Type": mime[extension] || "application/octet-stream",
      "Cache-Control": file.includes(
        `${path.sep}_next${path.sep}static${path.sep}`,
      )
        ? "public, max-age=31536000, immutable"
        : extension === ".html" || status === 404
          ? "no-cache"
          : "public, max-age=3600",
      ...(compressed
        ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" }
        : {}),
    });
    if (req.method === "HEAD") res.end();
    else if (compressed) createReadStream(file).pipe(createGzip()).pipe(res);
    else createReadStream(file).pipe(res);
  })
  .listen(port, "0.0.0.0", () =>
    console.log(`Preview: http://localhost:${port}${basePath}/`),
  );
