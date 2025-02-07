/* generate-map-previews.ts
   Run with: deno run --allow-read --allow-write generate-map-previews.ts
*/

interface MapInfo {
  mapName: string;
  jsonFile: string;
  imageFile: string | null;
}

export default async function generateMapPreviews(): Promise<void> {
  const outputDir = "./output";
  const imagesDir = `${outputDir}/images`;
  const mdOutputFile = "maps-preview.md";

  const mapJsonEntries: MapInfo[] = [];

  // Read /output for .json map files
  for await (const entry of Deno.readDir(outputDir)) {
    if (!entry.isFile) continue;
    const { name } = entry;
    if (name.toLowerCase().endsWith(".json") && name.includes("__by_")) {
      const jsonFilePath = `${outputDir}/${name}`;
      const baseName = name.slice(0, -5); // remove .json
      // Split on "__by_"
      const parts = baseName.split("__by_");
      if (parts.length !== 2) {
        // not a valid name
        continue;
      }
      const [mapName, authorRaw] = parts;
      const imageCandidate = `${imagesDir}/${baseName}.png`;
      let imageFile: string | null = null;
      try {
        // check if image exists
        const fileInfo = await Deno.stat(imageCandidate);
        if (fileInfo.isFile) {
          imageFile = imageCandidate;
        }
      } catch {
        // no matching image
      }
      mapJsonEntries.push({
        mapName,
        jsonFile: jsonFilePath,
        imageFile,
      });
    }
  }

  // Group by author
  // The author is extracted from the second part of the filename
  // We can't just do it above because we only have 'authorRaw' inside the loop
  // So let's re-extract carefully now that we have the baseName
  const mapsByAuthor: Record<string, MapInfo[]> = {};
  for (const mapInfo of mapJsonEntries) {
    // We'll parse the author again from `mapInfo.jsonFile`
    // Or we can do a small approach, because we have the path:
    const nameOnly = mapInfo.jsonFile.replace(`${outputDir}/`, ""); // e.g. "Alusq_FE7_42004344__by_FEU.json"
    const noJson = nameOnly.slice(0, -5);
    const [_, authorRaw] = noJson.split("__by_");
    const author = authorRaw || "Unknown";

    if (!mapsByAuthor[author]) {
      mapsByAuthor[author] = [];
    }
    mapsByAuthor[author].push(mapInfo);
  }

  // Build the MD content
  let mdContent = "# Map Previews\n\n";

  for (const author of Object.keys(mapsByAuthor).sort()) {
    mdContent += `<details>\n<summary>Maps by ${author}</summary>\n\n`;
    const maps = mapsByAuthor[author];

    for (const mapInfo of maps) {
      mdContent += `**${mapInfo.mapName}**  \n`;
      // Use relative paths so that the links work from the repo root
      mdContent += `[LT map .json file](${mapInfo.jsonFile})  \n`;
      if (mapInfo.imageFile) {
        mdContent += `![](${mapInfo.imageFile})\n\n`;
      } else {
        mdContent += "(No image found)\n\n";
      }
    }

    mdContent += "</details>\n\n";
  }

  await Deno.writeTextFile(mdOutputFile, mdContent);
  console.log(`Wrote ${mdOutputFile}.`);
}

if (import.meta.main) {
  generateMapPreviews();
}