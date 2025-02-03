import { basename } from "npm:pathe";
import convertTmxToLt from "@/convertTmxToLt.ts";

const tmxFiles: string[] = [
  "castle.tmx",
  "field.tmx",
];

async function runConversion() {
  for (const relativePath of tmxFiles) {
    const inputPath = `./input/${relativePath}`;
    const tilemap = convertTmxToLt(inputPath);
    const outName = basename(relativePath, ".tmx") + ".json";
    await Deno.writeTextFile(`./output/${outName}`, JSON.stringify(tilemap, null, 2));
  }
}

if (import.meta.main) {
  runConversion();
}