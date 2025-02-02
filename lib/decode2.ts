/**
 * Decodes a Fire Emblem mapchip_config file.
 * @param filePath Path to the binary mapchip_config file.
 * @returns A mapping of tile GIDs to terrain types.
 */
export default function decodeMapchipConfig(
  filePath: string
): Record<number, number> {
  const buffer = Deno.readFileSync(filePath);
  if (buffer.length % 2 !== 0) {
    throw new Error(
      "Invalid mapchip_config file: Size is not a multiple of 2."
    );
  }

  const mapchipData: Record<number, number> = {};
  const dataView = new DataView(buffer.buffer);
  const numEntries = buffer.length / 2;

  for (let i = 0; i < numEntries; i++) {
    const gid = i; // Assumes GIDs are sequentially indexed
    const terrainType = dataView.getUint16(i * 2, true); // Read as little-endian
    mapchipData[gid] = terrainType;
  }

  return mapchipData;
}

// Example usage in Deno
if (import.meta.main) {
  const filePath = "examples/tileset/fort.mapchip_config"; // Adjust path as needed
  const mapping = decodeMapchipConfig(filePath);
  console.log("Decoded Mapchip Config:", mapping);
}

