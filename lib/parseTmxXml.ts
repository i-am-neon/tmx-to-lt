import { XMLParser } from "npm:fast-xml-parser";
import { inflate } from "npm:pako";
import { decode as decodeBase64 } from "https://deno.land/std@0.197.0/encoding/base64.ts";

export type TmxLayer = {
  "@_name": string;
  "@_width": string;
  "@_height": string;
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

export type TmxMap = {
  map: {
    "@_width": string;
    "@_height": string;
    "@_tilewidth": string;
    "@_tileheight": string;
    tileset?: Array<{
      "@_name": string;
      image: {
        "@_source": string;
      };
    }>;
    // layer can be a single layer object or an array of them.
    layer: TmxLayer | TmxLayer[];
  };
};

function decodeLayerData(layerObj: TmxLayer) {
  const data = layerObj.data;
  // If Tiled wrote out direct <tile gid="..."/>, we already have them
  if (data?.tile) return data.tile;

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

export default function parseTmxXml(tmxXml: string): TmxMap {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(tmxXml);
  console.log("Debug: raw parse result:", JSON.stringify(parsed, null, 2));

  const mapObj = parsed as TmxMap;
  if (!mapObj?.map) {
    return mapObj; // no map data at all
  }

  const layerData = mapObj.map.layer;
  // If only one layer, it won't be an array
  if (Array.isArray(layerData)) {
    layerData.forEach((layer) => {
      layer.data.tile = decodeLayerData(layer);
    });
  } else {
    // single layer
    layerData.data.tile = decodeLayerData(layerData);
  }

  return mapObj;
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync("examples/castle.tmx")
  );
  const parsed = parseTmxXml(exampleXml);
  console.log("parsed", JSON.stringify(parsed, null, 2));
}

