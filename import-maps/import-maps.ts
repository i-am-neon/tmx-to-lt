import * as YAML from "npm:js-yaml";

function sanitizeString(input: string): string {
  return input
    .replace(/[^\w(){}[\]\-]+/g, "_") // Replace non-alphanumeric (and some allowed chars) with underscore
    .replace(/_+/g, "_") // Collapse multiple underscores
    .replace(/^_+|_+$/g, ""); // Trim underscores at start/end
}

function parseAuthor(dirname: string): string {
  // Attempt to find content within curly braces
  const bracesMatch = dirname.match(/\{([^}]+)\}/);
  if (bracesMatch) {
    return sanitizeString(bracesMatch[1]);
  }
  // Otherwise, look for parentheses
  const parenMatch = dirname.match(/\(([^)]+)\)/);
  if (parenMatch) {
    return sanitizeString(parenMatch[1]);
  }
  // Fallback to entire dirname
  return sanitizeString(dirname);
}

export type MapRecord = {
  name: string;
  author: string;
  tmxUrl: string;
  imageUrl: string;
};

async function getGithubDirContents(url: string): Promise<any[]> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch ${url}: ${resp.status} - ${resp.statusText}`);
  }
  return resp.json();
}

export default async function importMaps(): Promise<void> {
  // We'll store our final results here
  const results: MapRecord[] = [];

  // 1. Fetch the top-level 'Maps' directory from the GitHub repo
  const mainUrl = "https://api.github.com/repos/Klokinator/FE-Repo/contents/Maps?per_page=1000";
  const rootItems = await getGithubDirContents(mainUrl);

  // 2. For each directory in root, skip "Partials & Unformatted", then parse its contents
  for (const dirEntry of rootItems) {
    if (dirEntry.type === "dir" && dirEntry.name !== "Partials & Unformatted") {
      // The folder name might be "Anrika {Allin}" or "Someone (Alias)" or no braces at all
      const author = parseAuthor(dirEntry.name);

      // Now fetch the contents of this subdirectory
      const subDirUrl = `https://api.github.com/repos/Klokinator/FE-Repo/contents/Maps/${encodeURIComponent(dirEntry.name)}?per_page=1000`;
      const subDirItems = await getGithubDirContents(subDirUrl);

      // Create a lookup from base map name -> { tmxUrl, imageUrl }
      // We'll pair them by matching prefix of the file name before .tmx/.png
      const mapLookup: Record<string, { tmxUrl?: string; pngUrl?: string }> = {};

      for (const fileEntry of subDirItems) {
        if (fileEntry.type === "file") {
          // Example filename: "Some Map.tmx" or "Some Map.png"
          const { name: filename, download_url: fileUrl } = fileEntry;
          if (filename.toLowerCase().endsWith(".tmx")) {
            const baseName = filename.substring(0, filename.length - 4).toLowerCase();
            if (!mapLookup[baseName]) {
              mapLookup[baseName] = {};
            }
            mapLookup[baseName].tmxUrl = fileUrl;
          } else if (filename.toLowerCase().endsWith(".png")) {
            const baseName = filename.substring(0, filename.length - 4).toLowerCase();
            if (!mapLookup[baseName]) {
              mapLookup[baseName] = {};
            }
            mapLookup[baseName].pngUrl = fileUrl;
          }
        }
      }

      // 3. For each map entry in the lookup, push a record into results if .tmx exists
      // (PNG may or may not exist, but we include it if found)
      for (const baseName in mapLookup) {
        const record = mapLookup[baseName];
        if (record.tmxUrl) {
          const safeMapName = sanitizeString(baseName);
          results.push({
            name: safeMapName,
            author,
            tmxUrl: record.tmxUrl,
            imageUrl: record.pngUrl || "",
          });
        }
      }
    }
  }

  // 4. Convert results to YAML
  const yamlString = YAML.dump(results);

  // 5. Write to a local file for subsequent processing
  await Deno.writeTextFile("import-maps/maps.yaml", yamlString);
  console.log(`Wrote ${results.length} map records to import-maps/maps.yaml`);
}

if (import.meta.main) {
  importMaps();
}