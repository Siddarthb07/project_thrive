/**
 * Extract media URLs from projectthrive.in Vite bundle (same origin paths + full URLs).
 * Usage: node tools/extract-media.mjs [path-to-bundle.js]
 */
import fs from "fs";
import path from "path";
import process from "process";

const bundlePath =
  process.argv[2] || path.join(process.env.TEMP || "/tmp", "pt_current.js");

if (!fs.existsSync(bundlePath)) {
  console.error("Missing bundle:", bundlePath);
  process.exit(1);
}

const s = fs.readFileSync(bundlePath, "utf8");
const base = "https://www.projectthrive.in";

const urls = new Set();

for (const m of s.matchAll(/https?:\/\/[^"'\\s)>]+/g)) {
  const u = m[0].replace(/\\$/g, "");
  if (/\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/i.test(u)) urls.add(u);
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)) urls.add(u);
}

for (const m of s.matchAll(/\/lovable-uploads\/[a-zA-Z0-9._-]+/g)) {
  urls.add(base + m[0]);
}

for (const m of s.matchAll(
  /(?:youtube\.com\/(?:embed|watch)|youtu\.be)\/[a-zA-Z0-9_-]+/g,
)) {
  urls.add("https://www." + m[0].replace(/^www\./, ""));
}

for (const m of s.matchAll(/\/hqdefault\.jpg/g)) {
  urls.add(base + m[0]);
}

const images = [...urls].filter((u) =>
  /\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/i.test(u),
);
const videos = [...urls].filter((u) =>
  /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u),
);

console.log("=== VIDEOS ===");
videos.forEach((u) => console.log(u));
console.log("\n=== IMAGES (count %s) ===\n", images.length);
images.sort().forEach((u) => console.log(u));
