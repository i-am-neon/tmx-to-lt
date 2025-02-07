import { emptyDir } from "https://deno.land/std@0.197.0/fs/mod.ts";

export default async function clean(): Promise<void> {
  await Deno.remove("./input", { recursive: true }).catch(() => {});
  await Deno.mkdir("./input", { recursive: true });
  await Deno.remove("./output", { recursive: true }).catch(() => {});
  await Deno.mkdir("./output", { recursive: true });
}

if (import.meta.main) {
  clean();
}