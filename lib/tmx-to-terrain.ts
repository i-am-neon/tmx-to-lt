import parseTmxXml from "@/lib/parseTmxXml.ts";
import tilesetIdToTerrainId from "../lookup-tables/tileset-id-to-terrain-id.ts";
import terrainIdToName from "@/lookup-tables/terrain-id-to-name.ts";

export default function tmxToTerrain(tmxXml: string) {
  const rawData = parseTmxXml(tmxXml);
  const rawLayer = rawData.map.layer;
  const mapLayers = Array.isArray(rawLayer) ? rawLayer : [rawLayer];

  const tilesetId = "30";

  const layers = mapLayers.map((layer) => {
    const tiles = layer.data.tile;
    if (!tiles) return [];
    const terrainGrid: string[] = [];
    tiles.forEach((tile) => {
      const terrainTags = tilesetIdToTerrainId[tilesetId];
      if (!terrainTags) {
        throw new Error("Invalid tile config id: " + tilesetId);
      }
      const terrainTagsArray = terrainTags.split(" ");
      const terrainId: number =
        Number(terrainTagsArray[Number(tile["@_gid"])]) + 1;
      const terrainName = terrainIdToName[terrainId];
      terrainGrid.push(terrainName);
    });
    return terrainGrid;
  });
  return layers;
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync("examples/map/field.tmx")
  );
  const result = tmxToTerrain(exampleXml);
  console.log("result", JSON.stringify(result, null, 2));
}

