import parseTmxXml from "@/lib/parseTmxXml.ts";
import decodeMapchipConfig from "@/lib/decodeMapchipConfig.ts";

/**
 * Maps TMX tile GIDs to terrain types using mapchip_config.
 * @param tmxXml The TMX file contents as a string.
 * @param mapchipPath Path to the mapchip_config file.
 * @returns A mapping of tile GIDs to their terrain types.
 */
export default function mapTmxToTerrain(
  tmxXml: string,
  mapchipPath: string
): Record<number, number> {
  const parsed = parseTmxXml(tmxXml);
  const mapchipData = decodeMapchipConfig(Deno.readFileSync(mapchipPath));

  if (!parsed.map || !parsed.map.layer) {
    throw new Error("Invalid TMX file: No map or layer data found.");
  }

  const layers = Array.isArray(parsed.map.layer)
    ? parsed.map.layer
    : [parsed.map.layer];
  const terrainMapping: Record<number, number> = {};

  layers.forEach((layer) => {
    if (!layer.data || !layer.data.tile) return;

    layer.data.tile.forEach((tile: { "@_gid": string }) => {
      const gid = parseInt(tile["@_gid"], 10);
      if (gid in mapchipData) {
        terrainMapping[gid] = Array.isArray(mapchipData)
          ? (mapchipData[gid] as number)
          : mapchipData[gid];
      }
    });
  });

  return terrainMapping;
}

// Example usage in Deno
if (import.meta.main) {
  const tmxFilePath = "examples/map/field.tmx"; // Adjust as needed
  const mapchipPath = "examples/tileset/plains.mapchip_config";

  const tmxXml = Deno.readTextFileSync(tmxFilePath);
  const result = mapTmxToTerrain(tmxXml, mapchipPath);
  console.log("TMX to Terrain Mapping:", result);
}

