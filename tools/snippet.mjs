import fs from "fs";

const p = process.argv[2];
const s = fs.readFileSync(p, "utf8");
const needle = "testimonial-prestige";
let i = 0;
while ((i = s.indexOf(needle, i)) !== -1) {
  console.log(s.slice(Math.max(0, i - 120), i + 160));
  i += needle.length;
}
