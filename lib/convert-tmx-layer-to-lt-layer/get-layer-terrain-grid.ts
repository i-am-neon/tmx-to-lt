import getLayersWithTerrainNames from "@/lib/convert-tmx-layer-to-lt-layer/get-layers-with-terrain-names.ts";
import getTerrainLTNid from "@/lookup-tables/terrain-name-to-lt-nid-map.ts";
import { Layer } from "@/types/tmx-data.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";

export default function getLayerTerrainGrid({
  tilesetId,
  layer,
  firstGid,
  mapWidth,
  isBaseLayer,
}: {
  tilesetId: string;
  layer: Layer;
  firstGid: number;
  mapWidth: number;
  isBaseLayer: boolean;
}): Record<string, string> {
  const terrainGrid: Record<string, string> = {};
  const [singleLayerNames] = getLayersWithTerrainNames({
    tilesetId,
    layers: [layer],
    firstGid,
  });

  for (let i = 0; i < singleLayerNames.length; i++) {
    const layerNaem = singleLayerNames[i];
    const name = singleLayerNames[i];
    let terrainNid = getTerrainLTNid(name);
    if (!terrainNid) {
      console.warn(`Unknown terrain name: ${name}`);
      terrainNid = "--";
    }
    const x = i % mapWidth;
    const y = Math.floor(i / mapWidth);
    if (!isBaseLayer && terrainNid === "0") {
      // 0 is the default terrain, so we don't need to store it for map changes (non base layer)
      continue;
    }
    if (terrainNid === "--") {
      // LT maps "--" to "0"
      terrainGrid[`${x},${y}`] = "0";
    } else {
      terrainGrid[`${x},${y}`] = terrainNid;
    }
  }

  return terrainGrid;
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync(
      "examples/(7)Ch3BandofMercenaries_Diff_Tileset__by_Shin19.tmx"
    )
  );
  const parsedTmxData = parseTmxXml(exampleXml);
  console.log(
    getLayerTerrainGrid({
      tilesetId: parsedTmxData.tilesetId,
      layer: parsedTmxData.layers[0],
      firstGid: parsedTmxData.firstGid,
      mapWidth: parsedTmxData.width,
      isBaseLayer: true,
    })
  );
}

