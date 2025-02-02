import type { Tilemap, TilemapLayer } from "./types/tilemap.ts";
import parseTmxXml, { TmxMap } from "./lib/parseTmxXml.ts";
import mapTmxToTerrain from "./lib/mapTmxToTerrain.ts";

export default function convertTmxToLt(tmxXml: string): Tilemap {
  const rawData = parseTmxXml(tmxXml);

  const tmxWidth = parseInt(rawData.map["@_width"], 10);
  const tmxHeight = parseInt(rawData.map["@_height"], 10);

  const rawLayer = rawData.map.layer;
  const mapLayers = Array.isArray(rawLayer) ? rawLayer : [rawLayer];

  console.log("mapLayers :>> ", mapLayers);

  const layers: TilemapLayer[] = mapLayers.map((layer, index) => {
    // Basic conversion for demonstration
    return {
      nid: layer["@_name"] ?? `Layer${index}`,
      visible: layer["@_visible"] !== "0",
      foreground: false,
      terrain_grid: {},
      sprite_grid: {},
    };
  });

  const tilesetNames = (rawData.map.tileset || []).map(
    (ts) => ts["@_name"] || ""
  );

  const mapchipPath = "examples/tileset/fort.mapchip_config"; // Adjust as needed
  const terrainMapping = mapTmxToTerrain(tmxXml, mapchipPath);

  const tilemap: Tilemap = {
    nid: "converted_map",
    size: [tmxWidth, tmxHeight],
    autotile_fps: 0,
    layers,
    tilesets: tilesetNames,
    // terrainMapping,
  };

  return tilemap;
}

if (import.meta.main) {
  const fileArg = Deno.args[0];
  if (!fileArg) {
    console.error("Usage: deno run convertTmxToLt.ts <input-file.tmx>");
    Deno.exit(1);
  }

  const outputFile = fileArg.replace(/\.tmx$/, ".json");

  const tmxXml = await Deno.readTextFile(fileArg);
  const result = convertTmxToLt(tmxXml);

  await Deno.writeTextFile(outputFile, JSON.stringify(result, null, 2));
  console.log(`Converted ${fileArg} -> ${outputFile}`);
}
