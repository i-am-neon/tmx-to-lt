import parseTmxXml from "@/lib/parseTmxXml.ts";
import tilesetToTerrain from "../lookup-tables/tileset-to-terrain.ts";
import terrainIdToName from "@/lookup-tables/terrain-id-to-name.ts";

export default async function tmxToTerrain(tmxXml: string) {
  const rawData = parseTmxXml(tmxXml);

  const tmxWidth = parseInt(rawData.map["@_width"], 10);
  const tmxHeight = parseInt(rawData.map["@_height"], 10);

  const rawLayer = rawData.map.layer;
  const mapLayers = Array.isArray(rawLayer) ? rawLayer : [rawLayer];

  console.log("mapLayers :>> ", mapLayers);

  const tilesetId = "30";

  const layers = mapLayers.map((layer, index) => {
    const tiles = layer.data.tile;
    if (!tiles) return [];
    const terrainGrid: string[] = [];
    tiles.forEach((tile) => {
      const terrainTags = tilesetToTerrain[tilesetId];
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
  const result = await tmxToTerrain(exampleXml);
  console.log("result", JSON.stringify(result, null, 2));
}

