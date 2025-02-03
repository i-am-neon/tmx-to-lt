import parseTmxXml from "@/lib/parseTmxXml.ts";
import tilesetIdToTerrainId from "@/lookup-tables/tileset-id-to-terrain-id.ts";
import terrainIdToName from "@/lookup-tables/terrain-id-to-name.ts";

export default function tmxToTerrain(tmxXml: string) {
  const { tilesetId, layers, firstGid } = parseTmxXml(tmxXml);
  const tid = tilesetId;
  const terrainTags = tilesetIdToTerrainId[tid];
  if (!terrainTags) {
    throw new Error("Invalid tile config id: " + tid);
  }
  const terrainTagsArray = terrainTags.split(" ");
  const result = layers.map((layer) => {
    return layer.gids.map((gid) => {
      const terrainIdIndex = parseInt(terrainTagsArray[gid - firstGid], 10);
      const terrainId = terrainIdIndex;
      return terrainIdToName[terrainId] || "--";
    });
  });
  return result;
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync("examples/map/field.tmx")
  );
  const result = tmxToTerrain(exampleXml);
  console.log("result", JSON.stringify(result, null, 2));
}

