import { XMLParser } from "npm:fast-xml-parser";

export type TmxMap = {
  map: {
    "@_width": string;
    "@_height": string;
    "@_tilewidth": string;
    "@_tileheight": string;
    layer: Array<{
      "@_name": string;
      "@_width": string;
      "@_height": string;
      "@_visible"?: string;
      data: {
        tile?: Array<{
          "@_gid": string;
        }>;
      };
    }>;
    tileset?: Array<{
      "@_name": string;
      image: {
        "@_source": string;
      };
    }>;
  };
};

export default function parseTmxXml(tmxXml: string): TmxMap {
  const parser = new XMLParser();
  return parser.parse(tmxXml) as TmxMap;
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(Deno.readFileSync("examples/field.tmx"));
  console.log("exampleXml :>> ", exampleXml);
  const parsed = parseTmxXml(exampleXml);
  console.log("Parsed tmxMap", parsed);
}
