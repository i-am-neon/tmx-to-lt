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

/** Attempt to find a .png baseName that aligns with tmxBaseName, removing trailing words if needed. */
function fuzzyMatchPngBaseName(tmxBaseName: string, pngBaseNameSet: Set<string>): string | undefined {
  // Direct match
  if (pngBaseNameSet.has(tmxBaseName)) {
    return tmxBaseName;
  }

  // If no direct match, remove trailing words from tmxBaseName until we find a match or run out
  const words = tmxBaseName.split(/\s+/);
  while (words.length > 1) {
    words.pop(); // remove last word
    const attempt = words.join(" ");
    if (pngBaseNameSet.has(attempt)) {
      return attempt;
    }
  }
  return undefined;
}

async function getGithubDirContents(url: string): Promise<any[]> {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch ${url}: ${resp.status} - ${resp.statusText}`);
  }
  return resp.json();
}

export default async function importMaps(): Promise<void> {
  const results: MapRecord[] = [];
  const mainUrl = "https://api.github.com/repos/Klokinator/FE-Repo/contents/Maps?per_page=1000";
  const rootItems = await getGithubDirContents(mainUrl);

  for (const dirEntry of rootItems) {
    if (dirEntry.type === "dir" && dirEntry.name !== "Partials & Unformatted") {
      const author = parseAuthor(dirEntry.name);

      if (author === "ZoramineFae") {
        // skip
        continue;
      }
      const subDirUrl = `https://api.github.com/repos/Klokinator/FE-Repo/contents/Maps/${encodeURIComponent(dirEntry.name)}?per_page=1000`;
      const subDirItems = await getGithubDirContents(subDirUrl);

      // We'll collect all tmx files, then see if there's a matching png
      const tmxRecords: Array<{ base: string; url: string }> = [];
      const pngRecords: Array<{ base: string; url: string }> = [];

      for (const fileEntry of subDirItems) {
        if (fileEntry.type === "file" && fileEntry.download_url) {
          const { name: filename, download_url: fileUrl } = fileEntry;
          const lowerName = filename.toLowerCase();

          if (lowerName.endsWith(".tmx")) {
            // keep track of the raw base name (without .tmx)
            const baseName = filename.slice(0, -4); // remove .tmx
            tmxRecords.push({ base: baseName, url: fileUrl });
          } else if (lowerName.endsWith(".png")) {
            const baseName = filename.slice(0, -4);
            pngRecords.push({ base: baseName, url: fileUrl });
          }
        }
      }

      // Build quick set for all .png base names in this subdir
      // We'll remove them from the set as we match them
      const pngBaseNameSet = new Set(pngRecords.map((p) => p.base));

      for (const tmx of tmxRecords) {
        const tmxLc = tmx.base.toLowerCase();
        let matchedPngUrl = "";
        // First see if there's an exact match ignoring case
        // Then do the fuzzy approach
        let foundPngRecord = pngRecords.find((png) => png.base.toLowerCase() === tmxLc);
        if (!foundPngRecord) {
          // Attempt fuzzy matching
          const matched = fuzzyMatchPngBaseName(tmx.base, pngBaseNameSet);
          if (matched) {
            foundPngRecord = pngRecords.find((p) => p.base === matched);
          }
        }
        if (foundPngRecord) {
          matchedPngUrl = foundPngRecord.url;
          // remove from set so we don't re-match it
          pngBaseNameSet.delete(foundPngRecord.base);
        }

        // push final record
        const safeName = sanitizeString(tmx.base);
        results.push({
          name: safeName,
          author,
          tmxUrl: tmx.url,
          imageUrl: matchedPngUrl,
        });
      }
    }
  }

  const yamlString = YAML.dump(results);
  await Deno.writeTextFile("import-maps/maps.yaml", yamlString);
  console.log(`Wrote ${results.length} map records to import-maps/maps.yaml`);
}

if (import.meta.main) {
  importMaps();
}