import getLayerSpriteGrid from "@/lib/convert-tmx-layer-to-lt-layer/convert-gids-to-tileset-coords.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";
import { Layer } from "@/types/tmx-data.ts";
import { LTTilemapLayer } from "@/types/tilemap.ts";
import getLayerTerrainGrid from "@/lib/convert-tmx-layer-to-lt-layer/get-layer-terrain-grid.ts";
import sanitizeNid from "@/lib/sanitize-nid.ts";

export default function convertTmxLayerToLtLayer({
  layer,
  tileset,
  tilesetId,
  mapWidth,
  firstGid,
  isBaseLayer,
}: {
  layer: Layer;
  tileset: string;
  tilesetId: string;
  mapWidth: number;
  firstGid: number;
  isBaseLayer: boolean;
}): LTTilemapLayer {
  const spriteGrid = getLayerSpriteGrid({
    gids: layer.gids,
    tileset,
    mapWidth,
    firstGid,
  });
  const terrainGrid = getLayerTerrainGrid({
    tilesetId,
    layer,
    firstGid,
    mapWidth,
    isBaseLayer,
  });
  return {
    nid: sanitizeNid(layer.name),
    visible: true,
    foreground: false,
    sprite_grid: spriteGrid,
    terrain_grid: terrainGrid,
  };
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync(
      "examples/(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19.tmx"
    )
  );
  const parsedTmxData = parseTmxXml(exampleXml);
  const converted = convertTmxLayerToLtLayer({
    layer: parsedTmxData.layers[0],
    tileset: parsedTmxData.tileset,
    tilesetId: parsedTmxData.tilesetId,
    mapWidth: parsedTmxData.width,
    firstGid: parsedTmxData.firstGid,
    isBaseLayer: true,
  });
  console.log("Converted LT Layer:", converted);
}

