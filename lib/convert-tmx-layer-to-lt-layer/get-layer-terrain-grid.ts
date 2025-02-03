import getLayersWithTerrainNames from "@/lib/convert-tmx-layer-to-lt-layer/get-layers-with-terrain-names.ts";
import getTerrainLTNid from "@/lookup-tables/terrain-name-to-lt-nid-map.ts";
import { Layer } from "@/types/tmx-data.ts";

export default function getLayerTerrainGrid({
  tilesetId,
  layer,
  firstGid,
  mapWidth,
}: {
  tilesetId: string;
  layer: Layer;
  firstGid: number;
  mapWidth: number;
}): Record<string, string> {
  const terrainGrid: Record<string, string> = {};
  const [singleLayerNames] = getLayersWithTerrainNames({
    tilesetId,
    layers: [layer],
    firstGid,
  });

  for (let i = 0; i < singleLayerNames.length; i++) {
    const name = singleLayerNames[i];
    const terrainNid = getTerrainLTNid(name) ?? "--";
    const x = i % mapWidth;
    const y = Math.floor(i / mapWidth);
    terrainGrid[`${x},${y}`] = terrainNid;
  }

  return terrainGrid;
}

if (import.meta.main) {
  // Example usage
  console.log(
    getLayerTerrainGrid({
      tilesetId: "10",
      layer: { name: "dummy", gids: [] },
      firstGid: 1,
      mapWidth: 10,
    })
  );
}

