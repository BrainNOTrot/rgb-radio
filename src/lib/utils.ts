/**
 * Returns "white" or "black" — whichever is more readable on the given hex background.
 * Uses WCAG relative luminance formula.
 */
export function readableTextColor(hex: string): "white" | "black" {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const L =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return L > 0.179 ? "black" : "white";
}

/**
 * Format a hex string cleanly (always uppercase, always with #).
 */
export function formatHex(hex: string): string {
  return `#${hex.replace("#", "").toUpperCase()}`;
}

/**
 * Returns the YouTube embed URL from a youtu.be or youtube.com URL.
 */
export function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    return null;
  } catch {
    return null;
  }
}
