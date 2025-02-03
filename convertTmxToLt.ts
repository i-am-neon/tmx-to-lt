import tmxToTerrain from "@/lib/tmx-to-terrain.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";

export default async function convertTmxToLT(tmxFilePath: string) {
  const tmxXml = await Deno.readTextFile(tmxFilePath);
  const tmxData = parseTmxXml(tmxXml);
  const terrainLayers = tmxToTerrain(tmxData);
  console.log("terrainLayers :>> ", terrainLayers);
}

if (import.meta.main) {
  const parsedResult = convertTmxToLT("examples/map/field.tmx");
  console.log("parsedResult :>> ", parsedResult);
}

