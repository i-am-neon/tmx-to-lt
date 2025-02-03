import getLayersWithTerrainNames from "./lib/get-layers-with-terrain-names.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";

export default async function convertTmxToLT(tmxFilePath: string) {
  const tmxXml = await Deno.readTextFile(tmxFilePath);
  const tmxData = parseTmxXml(tmxXml);
  const layersWithTerrainName = getLayersWithTerrainNames(tmxData);
  console.log("layersWithTerrainName :>> ", layersWithTerrainName);
  // logs:
  // layersWithTerrainName :>>  [
  //   [
  //     "Wall",   "Plains", "Wall",   "Wall",   "Wall",   "Forest",
  //     "Plains", "Hill",   "Hill",   "Hill",   "Plains", "River", ...
}

if (import.meta.main) {
  const parsedResult = await convertTmxToLT("examples/map/field.tmx");
  console.log("parsedResult :>> ", parsedResult);
}

