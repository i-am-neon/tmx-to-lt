import convertTmxLayerToLtLayer from "@/lib/convert-tmx-layer-to-lt-layer/convert-tmx-layer-to-lt-layer.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";
import { Tilemap } from "@/types/tilemap.ts";

export default function convertTmxToLT(tmxFilePath: string): Tilemap {
  const tmxXml = Deno.readTextFileSync(tmxFilePath);
  const tmxData = parseTmxXml(tmxXml);

  // LT expects the first layer to be called "base"
  tmxData.layers[0].name = "base";

  const layers = tmxData.layers.map((layer) =>
    convertTmxLayerToLtLayer({
      firstGid: tmxData.firstGid,
      layer,
      mapWidth: tmxData.width,
      tileset: tmxData.tileset,
      tilesetId: tmxData.tilesetId,
    })
  );

  return {
    nid: "Map Name",
    size: [tmxData.width, tmxData.height],
    autotile_fps: 29,
    layers,
    tilesets: [tmxData.tileset],
  };
}

if (import.meta.main) {
  const res = convertTmxToLT("examples/map/castle.tmx");
  console.log("res", JSON.stringify(res, null, 2));
}

