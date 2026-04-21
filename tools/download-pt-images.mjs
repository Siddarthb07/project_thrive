import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "images");
const base = "https://www.projectthrive.in";

const files = [
  ["lovable-uploads/sobha-1.jpg", "camp-sobha-1.jpg"],
  ["lovable-uploads/sobha-2.jpg", "camp-sobha-2.jpg"],
  ["lovable-uploads/sobha-3.jpg", "camp-sobha-3.jpg"],
  ["lovable-uploads/sobha-4.jpg", "camp-sobha-4.jpg"],
  [
    "lovable-uploads/2c4be9ac-9179-4bae-97dc-6d114ccc1140.png",
    "community-gathering-01.png",
  ],
  [
    "lovable-uploads/f71e01b7-4245-4445-889a-74b322aa8415.png",
    "community-gathering-02.png",
  ],
  [
    "lovable-uploads/7d82492b-c9b0-4d31-bd35-acfdeea0b693.png",
    "workshop-moment-01.png",
  ],
  [
    "lovable-uploads/fe5a0802-1427-4098-8e0f-6b30e53b1d10.png",
    "hero-texture-01.png",
  ],
  ["lovable-uploads/sbi-testimonial-letter.jpg", "sbi-letter.jpg"],
];

await fs.promises.mkdir(outDir, { recursive: true });

for (const [src, local] of files) {
  const url = `${base}/${src}`;
  const dest = path.join(outDir, local);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "ProjectThriveMirror/1.0 (local static clone)" },
    });
    if (!res.ok) {
      console.error("skip", local, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile(dest, buf);
    console.log("ok", local, buf.length);
  } catch (e) {
    console.error("fail", local, e.message);
  }
}
