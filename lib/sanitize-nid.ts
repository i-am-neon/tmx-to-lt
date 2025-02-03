export default function sanitizeNid(nid: string): string {
  return nid.replace(/[^a-zA-Z0-9]/g, "_");
}
