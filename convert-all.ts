import { basename } from "npm:pathe";
import convertTmxToLt from "@/convert-tmx-to-lt.ts";

export default async function runConversion() {
  const tmxFiles: string[] = [];
  for await (const entry of Deno.readDir("./input")) {
    if (entry.isFile && entry.name.endsWith(".tmx")) {
      tmxFiles.push(entry.name);
    }
  }

  for (const relativePath of tmxFiles) {
    const inputPath = `./input/${relativePath}`;
    const tilemap = convertTmxToLt(inputPath);
    const outName = basename(relativePath, ".tmx") + ".json";
    await Deno.writeTextFile(
      `./output/${outName}`,
      JSON.stringify(tilemap, null, 2)
    );
    const imageName = basename(relativePath, ".tmx") + ".png";
    const imageInputPath = `./input/images/${imageName}`;
    const imageOutputDir = `./output/images`;
    const imageOutputPath = `${imageOutputDir}/${imageName}`;

    try {
      await Deno.stat(imageInputPath);
      await Deno.mkdir(imageOutputDir, { recursive: true });
      await Deno.copyFile(imageInputPath, imageOutputPath);
      console.log(`Copied image -> ${imageOutputPath}`);
    } catch (err) {
      // no image
    }
  }
}

if (import.meta.main) {
  runConversion();
}
