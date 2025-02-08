import convertTmxLayerToLtLayer from "@/lib/convert-tmx-layer-to-lt-layer/convert-tmx-layer-to-lt-layer.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";
import { Tilemap } from "@/types/tilemap.ts";
import tilesetIdToTerrainId from "@/lookup-tables/tileset-id-to-terrain-id.ts";

export default function convertTmxToLT(tmxFilePath: string): Tilemap | null {
  const tmxXml = Deno.readTextFileSync(tmxFilePath);
  const tmxData = parseTmxXml(tmxXml);
  const mapName = tmxFilePath.split("/").pop()?.split(".")[0] || "Map Name";
  if (tilesetIdToTerrainId[tmxData.tilesetId] === undefined) {
    console.warn(
      `Invalid tile config id: ${tmxData.tilesetId} from ${tmxData.tileset} in map ${mapName} . Skipping.`
    );
    return null;
  }

  // LT expects the first layer to be called "base"
  tmxData.layers[0].name = "base";

  const layers = tmxData.layers.map((layer, index) =>
    convertTmxLayerToLtLayer({
      firstGid: tmxData.firstGid,
      layer,
      mapWidth: tmxData.width,
      tileset: tmxData.tileset,
      tilesetId: tmxData.tilesetId,
      isBaseLayer: index === 0,
    })
  );

  const baseLayer = layers.find((layer) => layer.nid === "base");
  const isError =
    !baseLayer?.terrain_grid ||
    Object.keys(baseLayer.terrain_grid).length === 0;
  if (isError) {
    console.warn(`Base layer in map ${mapName} has no terrain. Skipping.`);
    return null;
  }

  return {
    nid: mapName,
    size: [tmxData.width, tmxData.height],
    autotile_fps: 29,
    layers,
    tilesets: [tmxData.tileset],
  };
}

if (import.meta.main) {
  const res = convertTmxToLT(
    "examples/(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19.tmx"
  );
  console.log("res", JSON.stringify(res, null, 2));
}

