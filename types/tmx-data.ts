export type TmxData = {
  tilesetId: string;
  tileset: string;
  layers: {
    name: string;
    gids: number[];
  }[];
  width: number;
  height: number;
  firstGid: number;
};

