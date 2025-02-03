const terrainNameToLTNidMap: Map<string, string> = new Map([
  ["Plains", "1"],
  ["--", "0"],
  ["Forest", "2"],
  ["Thicket", "3"],
  ["Bridge", "4"],
  ["Stairs", "5"],
  ["Floor", "6"],
  ["Road", "7"],
  ["Pillar", "8"],
  ["Wall", "9"],
  ["Fence", "Fence"],
  ["Lake", "10"],
  ["Sea", "11"],
  ["River", "12"],
  ["Hill", "20"],
  ["Mountain", "21"],
  ["Peak", "21"],
  ["Cliff", "22"],
  ["Barrel", "25"],
  ["House", "30"],
  ["Fort", "31"],
  ["Gate", "32"],
  ["Armory", "33"],
  ["Vendor", "34"],
  ["Arena", "Arena"],
  ["Village", "35"],
  ["Chest", "36"],
  ["Door", "37"],
  ["Throne", "38"],
  ["Ruins", "Ruins"],
  ["Village Ruins", "Ruins"],
]);

export default function getTerrainLTNid(
  terrainName: string
): string | undefined {
  return terrainNameToLTNidMap.get(terrainName);
}

