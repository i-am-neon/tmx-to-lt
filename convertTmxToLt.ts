import tmxToTerrain from "@/lib/tmx-to-terrain.ts";
import parseTmxXml from "@/lib/parseTmxXml.ts";

export default async function convertTmxToLT(tmxFilePath: string) {
  const tmxXml = await Deno.readTextFile(tmxFilePath);
  const tmxData = parseTmxXml(tmxXml);
  const layersWithTerrainName = tmxToTerrain(tmxData);
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

