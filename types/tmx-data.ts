export type Layer = {
  name: string;
  gids: number[];
};

export type TmxData = {
  tilesetId: string;
  tileset: string;
  layers: Layer[];
  width: number;
  height: number;
  firstGid: number;
};

