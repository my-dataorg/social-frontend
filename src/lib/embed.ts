export function isEmbedded(value: string | null | undefined): boolean {
  return value === "1";
}

export function withEmbed(path: string, embedded: boolean): string {
  if (!embedded) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}embed=1`;
}
