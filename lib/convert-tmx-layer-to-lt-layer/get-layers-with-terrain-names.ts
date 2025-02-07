import parseTmxXml from "@/lib/parseTmxXml.ts";
import terrainIdToName from "@/lookup-tables/terrain-id-to-name.ts";
import tilesetIdToTerrainId from "@/lookup-tables/tileset-id-to-terrain-id.ts";
import { Layer } from "@/types/tmx-data.ts";

export default function getLayersWithTerrainNames({
  tilesetId,
  layers,
  firstGid,
}: {
  tilesetId: string;
  layers: Layer[];
  firstGid: number;
}): string[][] {
  const terrainTags = tilesetIdToTerrainId[tilesetId];
  if (!terrainTags) {
    throw new Error("Invalid tile config id: " + tilesetId);
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
  const parsedTmxData = parseTmxXml(exampleXml);
  const result = getLayersWithTerrainNames(parsedTmxData);
  console.log("result", JSON.stringify(result, null, 2));
}

// Returns:
// [
//   [
//     "Wall",
//     "Plains",
//     "Wall",
//     "Wall",
//     "Wall", ...

