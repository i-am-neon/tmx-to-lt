import { XMLParser } from "npm:fast-xml-parser";
import { inflate } from "npm:pako";
import { decode as decodeBase64 } from "https://deno.land/std@0.197.0/encoding/base64.ts";
import { TmxData } from "../types/tmx-data.ts";

/* Decodes <data> in a layer if it's base64+zlib or raw <tile gid="..."/> */
function decodeLayerData(layerObj: TmxLayer) {
  const data = layerObj.data;
  if (data?.tile) {
    // Tiled wrote out direct <tile gid="..."/>, we already have them
    return data.tile;
  }

  const text = data?.["#text"];
  const encoding = data?.["@_encoding"] || layerObj?.["@_encoding"];
  const compression = data?.["@_compression"] || layerObj?.["@_compression"];

  // Handle base64 + zlib-compressed data
  if (text && encoding === "base64" && compression === "zlib") {
    const buffer = decodeBase64(text);
    const unzipped = inflate(buffer);
    const tileCount = unzipped.length / 4;
    const tiles = [];
    for (let i = 0; i < tileCount; i++) {
      const b0 = unzipped[i * 4 + 0];
      const b1 = unzipped[i * 4 + 1] << 8;
      const b2 = unzipped[i * 4 + 2] << 16;
      const b3 = unzipped[i * 4 + 3] << 24;
      const gid = (b0 + b1 + b2 + b3) >>> 0;
      tiles.push({ "@_gid": gid.toString() });
    }
    return tiles;
  }

  return [];
}

/* Minimal subset of what we need from TmxMap if we used a typed approach */
export type TmxLayer = {
  "@_name"?: string;
  "@_width"?: string;
  "@_height"?: string;
  "@_visible"?: string;
  "@_encoding"?: string;
  "@_compression"?: string;
  data: {
    tile?: Array<{ "@_gid": string }>;
    "#text"?: string;
    "@_encoding"?: string;
    "@_compression"?: string;
  };
};

type TmxTilesetSingle = {
  "@_firstgid"?: string;
  image?: {
    "@_source"?: string;
  };
};
type TmxTileset = TmxTilesetSingle | TmxTilesetSingle[] | undefined;

export default function parseTmxXml(tmxXml: string): TmxData {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(tmxXml);

  if (!parsed?.map) {
    return {
      tilesetId: "",
      tileset: "",
      layers: [],
      width: 0,
      height: 0,
      firstGid: 0,
    };
  }

  const rawTileset: TmxTileset = parsed.map.tileset;

  let firstGidStr = "1";
  let imageSource = "";

  if (Array.isArray(rawTileset) && rawTileset.length > 0) {
    // rawTileset is an array of TmxTilesetSingle
    const firstEntry = rawTileset[0];
    firstGidStr = firstEntry["@_firstgid"] ?? "1";
    imageSource = firstEntry.image?.["@_source"] ?? "";
  } else if (rawTileset) {
    // rawTileset is a single TmxTilesetSingle
    const singleTs = rawTileset as TmxTilesetSingle;
    firstGidStr = singleTs["@_firstgid"] ?? "1";
    imageSource = singleTs.image?.["@_source"] ?? "";
  }

  let tilesetId = "";
  let tileset = "";
  const pngIndex = imageSource.toLowerCase().lastIndexOf(".png");
  if (pngIndex >= 2) {
    tilesetId = imageSource.substring(pngIndex - 2, pngIndex);
  }
  if (pngIndex >= 8) {
    tileset = imageSource.substring(pngIndex - 8, pngIndex);
  }

  const width = parseInt(parsed.map["@_width"], 10);
  const height = parseInt(parsed.map["@_height"], 10);
  const firstGid = parseInt(firstGidStr, 10);

  const rawLayer = parsed.map.layer;
  const layerArray = Array.isArray(rawLayer) ? rawLayer : [rawLayer];
  layerArray.forEach((layer) => {
    layer.data.tile = decodeLayerData(layer);
  });

  const layers = layerArray.map((layer) => {
    const name: string = layer["@_name"] || "";
    const tileGids =
      layer.data.tile?.map((t: { "@_gid": string }) =>
        parseInt(t["@_gid"], 10)
      ) || [];
    return {
      name,
      gids: tileGids,
    };
  });

  return {
    tilesetId,
    tileset,
    layers,
    width,
    height,
    firstGid,
  };
}

if (import.meta.main) {
  const tmxXml = await Deno.readTextFile("examples/map/field.tmx");
  const parsedResult = parseTmxXml(tmxXml);
  console.log("Parsed Tmx:", parsedResult);
}

