import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = "https://www.projectthrive.in";
const root = path.join(__dirname, "..");
const imgDir = path.join(root, "images");
const vidDir = path.join(root, "videos");

const ua = "ProjectThriveStaticMirror/1.1 (local dev; NGO-owned assets)";

/** Paths and local names — aligned with projectthrive.in Vite bundle (testimonial cards). */
const downloads = [
  [
    "lovable-uploads/testimonial-prestige-1.mp4",
    path.join(vidDir, "testimonial-prestige-1.mp4"),
  ],
  [
    "lovable-uploads/testimonial-prestige-2.mp4",
    path.join(vidDir, "testimonial-prestige-2.mp4"),
  ],
  [
    "lovable-uploads/fe5a0802-1427-4098-8e0f-6b30e53b1d10.png",
    path.join(imgDir, "thumb-prestige-pinewood.png"),
  ],
  [
    "lovable-uploads/2a7a7cdf-3d80-40b1-95c4-63329209ee98.png",
    path.join(imgDir, "thumb-apr-bengaluru.png"),
  ],
  ["lovable-uploads/sobha-1.jpg", path.join(imgDir, "camp-sobha-hero.jpg")],
  ["lovable-uploads/sobha-2.jpg", path.join(imgDir, "camp-sobha-2.jpg")],
  ["lovable-uploads/sobha-3.jpg", path.join(imgDir, "camp-sobha-3.jpg")],
  ["lovable-uploads/sobha-4.jpg", path.join(imgDir, "camp-sobha-4.jpg")],
  ["lovable-uploads/sobha-5.jpg", path.join(imgDir, "camp-sobha-5.jpg")],
];

async function fetchToFile(url, dest) {
  const res = await fetch(url, { headers: { "user-agent": ua } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buf);
  return buf.length;
}

let ok = 0;
for (const [src, dest] of downloads) {
  const url = `${base}/${src}`;
  try {
    const n = await fetchToFile(url, dest);
    console.log("ok", path.basename(dest), n);
    ok++;
  } catch (e) {
    console.error("fail", dest, e.message);
  }
}
console.log(`\nDone: ${ok}/${downloads.length} files.`);
