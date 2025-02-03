import { TileSprite } from "@/types/tilemap.ts";

export default function convertGidToTilesetCoords({
  gids,
  tileset,
  mapWidth,
  firstGid,
}: {
  gids: number[];
  tileset: string;
  mapWidth: number;
  firstGid: number;
}): TileSprite {
  const result: TileSprite = {};
  for (let i = 0; i < gids.length; i++) {
    const gid = gids[i];
    if (gid === 0) continue;
    const adjustedGid = gid - firstGid;
    const xGrid = i % mapWidth;
    const yGrid = Math.floor(i / mapWidth);
    const tileX = adjustedGid % 32;
    const tileY = Math.floor(adjustedGid / 32);
    result[`${xGrid},${yGrid}`] = [tileset, [tileX, tileY]];
  }
  return result;
}

