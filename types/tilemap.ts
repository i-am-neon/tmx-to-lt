export type Tilemap = {
  nid: string;
  size: [number, number];
  autotile_fps: number;
  layers: LTTilemapLayer[];
  tilesets: string[];
};

export type LTTilemapLayer = {
  nid: string;
  visible: boolean;
  foreground: boolean;
  terrain_grid: TerrainGrid;
  sprite_grid: TileSprite;
};

export type TileSprite = Record<string, [string, [number, number]]>;

export type TerrainGrid = Record<string, string>;

