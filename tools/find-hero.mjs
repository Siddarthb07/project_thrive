import fs from "fs";
import path from "path";

const s = fs.readFileSync(
  path.join(process.env.TEMP || "/tmp", "pt_current.js"),
  "utf8",
);
for (const n of ["Making Financial", "hero", "fe5a0802", "sobha-1", "/lovable-uploads/"]) {
  const i = s.indexOf(n);
  console.log("\n---", n, "idx", i, "---");
  if (i >= 0) console.log(s.slice(i, i + 400));
}
