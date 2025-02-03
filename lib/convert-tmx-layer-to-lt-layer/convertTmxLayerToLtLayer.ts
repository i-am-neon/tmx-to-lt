import convertGidToTilesetCoords from "@/lib/convert-tmx-layer-to-lt-layer/convert-gids-to-tileset-coords.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";
import { Layer } from "@/types/tmx-data.ts";
import { LTTilemapLayer } from "@/types/tilemap.ts";

export default function convertTmxLayerToLtLayer({
  layer,
  tileset,
  mapWidth,
  firstGid,
}: {
  layer: Layer;
  tileset: string;
  mapWidth: number;
  firstGid: number;
}): LTTilemapLayer {
  const sprite_grid = convertGidToTilesetCoords({
    gids: layer.gids,
    tileset,
    mapWidth,
    firstGid,
  });
  return {
    nid: layer.name,
    visible: true,
    foreground: false,
    sprite_grid,
    terrain_grid: { "": "" },
  };
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync("examples/map/field.tmx")
  );
  const parsedTmxData = parseTmxXml(exampleXml);
  const converted = convertTmxLayerToLtLayer({
    layer: parsedTmxData.layers[0],
    tileset: parsedTmxData.tileset,
    mapWidth: parsedTmxData.width,
    firstGid: parsedTmxData.firstGid,
  });
  console.log("Converted LT Layer:", converted);
}

