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
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });
  const parsed = parser.parse(tmxXml);
  console.log("Debug: raw parse result:", JSON.stringify(parsed, null, 2));
  return parsed as TmxMap;
}

if (import.meta.main) {
  const exampleXml = new TextDecoder().decode(
    Deno.readFileSync("examples/field.tmx")
  );
  const parsed = parseTmxXml(exampleXml);
  console.log("Parsed tmxMap", parsed);
}