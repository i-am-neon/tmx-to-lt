export default function chunkMapchipConfig(values: number[], columns: number): number[][] {
  const rows: number[][] = [];
  for (let i = 0; i < values.length; i += columns) {
    rows.push(values.slice(i, i + columns));
  }
  return rows;
}

if (import.meta.main) {
  const data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const columns = 4;
  console.log(chunkMapchipConfig(data, columns));
}