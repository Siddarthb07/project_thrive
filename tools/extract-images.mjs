import fs from "fs";
import path from "path";
import process from "process";

const jsPath = path.join(process.env.TEMP || "/tmp", "pt.js");
if (!fs.existsSync(jsPath)) {
  console.error("Missing pt.js — run curl first");
  process.exit(1);
}
const s = fs.readFileSync(jsPath, "utf8");
const urls = new Set();
for (const m of s.matchAll(/https?:\/\/[^"'\\s)]+/g)) {
  const u = m[0];
  if (/\.(png|jpe?g|webp|avif|svg)(\?|$)/i.test(u)) urls.add(u);
}
for (const m of s.matchAll(/\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif|svg)/g)) {
  urls.add("https://www.projectthrive.in" + m[0]);
}
console.log([...urls].join("\n"));
