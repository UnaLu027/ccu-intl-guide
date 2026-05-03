/**
 * Check image paths referenced by campusData.ts against client/public.
 *
 * Usage from project root:
 *   node tools/check-campus-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const dataPath = path.join(process.cwd(), "client", "src", "data", "campusData.ts");
const publicRoot = path.join(process.cwd(), "client", "public");

if (!fs.existsSync(dataPath)) {
  console.error(`Cannot find ${dataPath}`);
  process.exit(1);
}

const content = fs.readFileSync(dataPath, "utf8");
const imagePathRegex = /"(entrance_image|floor_plan_image|building_entrance_image)"\s*:\s*"([^"]+)"/g;

const references = [];
let match;
while ((match = imagePathRegex.exec(content)) !== null) {
  references.push({ field: match[1], src: match[2] });
}

const missing = [];
const existing = [];

for (const ref of references) {
  const normalized = ref.src.replace(/^\/+/, "");
  const filePath = path.join(publicRoot, normalized.replace(/^images\//, "images/"));

  if (fs.existsSync(filePath)) {
    existing.push(ref);
  } else {
    missing.push({ ...ref, expectedFile: filePath });
  }
}

console.log(`Image references: ${references.length}`);
console.log(`Existing files: ${existing.length}`);
console.log(`Missing files: ${missing.length}`);

if (missing.length) {
  console.log("\nMissing image files:");
  for (const item of missing) {
    console.log(`- ${item.field}: ${item.src}`);
    console.log(`  expected: ${item.expectedFile}`);
  }
  process.exitCode = 1;
}
