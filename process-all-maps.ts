import importMaps from "@/import-maps/import-maps.ts";
import downloadMaps from "@/import-maps/download-maps.ts";
import runConversion from "@/convert-all.ts";

export default async function processAllMaps(): Promise<void> {
  await importMaps();
  await downloadMaps();
  await runConversion();
}

if (import.meta.main) {
  processAllMaps();
}