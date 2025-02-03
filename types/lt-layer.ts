import { TileSprite } from "@/types/tile-sprite.ts";

export type LtLayer = {
  nid: string;
  sprite_grid: TileSprite;
  // deno-lint-ignore no-explicit-any
  terrain_grid: any[];
};

