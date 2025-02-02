import chunkMapchipConfig from "@/lib/chunkMapchipConfig.ts";

export default function decodeMapchipConfig(
  raw: Uint8Array,
  columns?: number
): number[] | number[][] {
  const values: number[] = [];
  for (let i = 0; i < raw.length; i += 2) {
    const little = raw[i];
    const big = raw[i + 1] << 8;
    values.push(little + big);
  }

  if (columns && columns > 0) {
    return chunkMapchipConfig(values, columns);
  }

  return values;
}

if (import.meta.main) {
  const fileData = Deno.readFileSync("examples/tileset/fort.mapchip_config");
  const columns = 16;
  const result = decodeMapchipConfig(fileData, columns);
  console.log("Decoded mapchip config (chunked):", result);
  console.log("result.length :>> ", result.length);
}

