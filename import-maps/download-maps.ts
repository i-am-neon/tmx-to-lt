import * as YAML from "npm:js-yaml";

function sanitizeString(input: string): string {
  return input
    .replace(/[^\w(){}[\]\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export type MapRecord = {
  name: string;
  author: string;
  tmxUrl: string;
  imageUrl: string;
};

export default async function downloadMaps(): Promise<void> {
  let yamlContent: string;
  try {
    yamlContent = await Deno.readTextFile("import-maps/maps.yaml");
  } catch (err) {
    throw new Error("Failed to read 'import-maps/maps.yaml'. Make sure you've run import-maps first.");
  }

  const maps = YAML.load(yamlContent) as MapRecord[];
  if (!Array.isArray(maps)) {
    throw new Error("Invalid maps.yaml structure.");
  }

  for (const mapRecord of maps) {
    // Build a sanitized filename
    const combinedName = `${mapRecord.name}__by${mapRecord.author}`;
    const tmxFilePath = `input/${combinedName}.tmx`;
    const pngFilePath = `input/${combinedName}.png`;

    // Download the TMX
    if (mapRecord.tmxUrl) {
      const resp = await fetch(mapRecord.tmxUrl);
      if (!resp.ok) {
        console.warn(`Failed to download TMX for ${combinedName}: ${resp.statusText}`);
      } else {
        const tmxData = await resp.arrayBuffer();
        await Deno.writeFile(tmxFilePath, new Uint8Array(tmxData));
        console.log(`Wrote TMX -> ${tmxFilePath}`);
      }
    }

    // Download the PNG (if it exists)
    if (mapRecord.imageUrl) {
      const resp = await fetch(mapRecord.imageUrl);
      if (!resp.ok) {
        console.warn(`Failed to download PNG for ${combinedName}: ${resp.statusText}`);
      } else {
        const pngData = await resp.arrayBuffer();
        await Deno.writeFile(pngFilePath, new Uint8Array(pngData));
        console.log(`Wrote PNG -> ${pngFilePath}`);
      }
    }
  }
}

if (import.meta.main) {
  downloadMaps();
}