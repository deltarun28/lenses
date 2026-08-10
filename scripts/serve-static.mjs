/**
 * Serves the static export in `out/` the way GitHub Pages serves it, so the
 * exported site can be checked locally instead of only after a deploy.
 *
 * `next start` cannot do this: it serves the Next server build, not the export,
 * and it does not mount the site under a base path. The behaviours that matter
 * here — extensionless URLs resolving to `<path>.html`, and unknown paths
 * returning `404.html` with a 404 status — are exactly the ones that decide
 * whether navigation and the offline fallback work once deployed.
 *
 * Usage: node scripts/serve-static.mjs [--port 3100] [--base /lenses]
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);

function arg(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
}

const port = Number(arg("port", 3100));
const basePath = arg("base", process.env.NEXT_PUBLIC_BASE_PATH ?? "");
const root = path.resolve(process.cwd(), "out");

const CONTENT_TYPES = new Map(
  Object.entries({
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
    ".map": "application/json; charset=utf-8",
    ".woff2": "font/woff2",
  }),
);

/** Resolves to a readable file inside `out/`, or null. */
async function resolveFile(urlPath) {
  // Reject traversal outside the export before touching the filesystem.
  const target = path.resolve(root, `.${path.posix.normalize(urlPath)}`);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) return null;

  const candidates = urlPath.endsWith("/")
    ? [path.join(target, "index.html")]
    : [target, `${target}.html`, path.join(target, "index.html")];

  for (const candidate of candidates) {
    const stats = await stat(candidate).catch(() => null);
    if (stats?.isFile()) return candidate;
  }
  return null;
}

function send(res, status, file) {
  res.writeHead(status, {
    "content-type": CONTENT_TYPES.get(path.extname(file)) ?? "application/octet-stream",
    // The service worker must never be served stale, or an update cannot land.
    "cache-control": file.endsWith("sw.js") ? "no-cache" : "public, max-age=0",
  });
  createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const decoded = decodeURIComponent(pathname);

  if (basePath && !decoded.startsWith(`${basePath}/`) && decoded !== basePath) {
    // GitHub Pages serves nothing outside the project directory. Redirecting
    // rather than 404ing makes a missing base path obvious instead of silent.
    res.writeHead(302, { location: `${basePath}/` });
    res.end();
    return;
  }

  const withoutBase = basePath ? decoded.slice(basePath.length) || "/" : decoded;
  const file = await resolveFile(withoutBase);

  if (file) {
    send(res, 200, file);
    return;
  }

  const notFound = await resolveFile("/404.html");
  if (notFound) {
    send(res, 404, notFound);
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static export served at http://127.0.0.1:${port}${basePath}/`);
});
