export const DEFAULT_SOCIAL_PATH = "/";

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function decodePath(value: string): string | null {
  let decoded = value;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (CONTROL_CHARACTERS.test(decoded) || decoded.includes("\\")) return null;

    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      return null;
    }
    if (next === decoded) return decoded;
    decoded = next;
  }

  return null;
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) {
    return DEFAULT_SOCIAL_PATH;
  }

  const decoded = decodePath(value);
  const path = decoded?.split(/[?#]/, 1)[0];
  if (
    !decoded ||
    decoded.startsWith("//") ||
    path?.split("/").includes("..")
  ) {
    return DEFAULT_SOCIAL_PATH;
  }

  return value;
}

export function bridgeDestination(next: string | null | undefined, embedded: boolean): string {
  const destination = safeNextPath(next);
  if (!embedded) return destination;

  const separator = destination.includes("?") ? "&" : "?";
  return `${destination}${separator}embed=1`;
}
