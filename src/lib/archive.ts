/**
 * lib/archive.ts
 *
 * ALL data access goes through here. Reads archive/ files directly from the
 * filesystem at build time (SSG/ISR). No database, no API, no duplication.
 * GitHub is the database — Vercel rebuilds on every push.
 */

import fs from "fs";
import path from "path";
import { ColorData, StatsData, IndexEntry } from "@/types";

// Root of the repository — works both locally and on Vercel
const ARCHIVE_ROOT = path.join(process.cwd(), "archive");
const COLORS_ROOT = path.join(ARCHIVE_ROOT, "colors");
const STATS_PATH = path.join(ARCHIVE_ROOT, "stats.json");

// ─── Stats ───────────────────────────────────────────────────────────────────

export function getStats(): StatsData {
  const raw = fs.readFileSync(STATS_PATH, "utf-8");
  return JSON.parse(raw) as StatsData;
}

// ─── All colors (for archive page) ───────────────────────────────────────────

/**
 * Scans archive/colors/**\/*.json and returns all uploaded colors,
 * newest first (by videoNumber descending).
 */
export function getAllColors(): ColorData[] {
  const colors: ColorData[] = [];

  if (!fs.existsSync(COLORS_ROOT)) return colors;

  // Each subfolder is a 2-char hex prefix (00, 01, ff, …)
  const folders = fs
    .readdirSync(COLORS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const folder of folders) {
    const folderPath = path.join(COLORS_ROOT, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".json"))
      .sort();

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(folderPath, file), "utf-8");
        const color = JSON.parse(raw) as ColorData;
        colors.push(color);
      } catch {
        // Malformed JSON — skip silently; don't break the build
      }
    }
  }

  // Newest first
  return colors.sort((a, b) => b.videoNumber - a.videoNumber);
}

// ─── Single color ─────────────────────────────────────────────────────────────

/**
 * Reads a single color JSON by its hex value (without #).
 * Path convention: archive/colors/XX/XXXXXX.json
 */
export function getColor(hex: string): ColorData | null {
  const upper = hex.toUpperCase();
  const folder = upper.slice(0, 2);
  const filePath = path.join(COLORS_ROOT, folder, `${upper}.json`);

  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ColorData;
  } catch {
    return null;
  }
}

// ─── All hex slugs (for generateStaticParams) ─────────────────────────────────

/**
 * Returns every hex value (without #, uppercase) for static path generation.
 */
export function getAllHexSlugs(): string[] {
  const slugs: string[] = [];

  if (!fs.existsSync(COLORS_ROOT)) return slugs;

  const folders = fs
    .readdirSync(COLORS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const folder of folders) {
    const folderPath = path.join(COLORS_ROOT, folder);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".json"))
      .sort();

    for (const file of files) {
      slugs.push(file.replace(".json", "").toUpperCase());
    }
  }

  return slugs;
}

// ─── Prev / Next color ────────────────────────────────────────────────────────

/**
 * Returns the previous and next color relative to a given hex slug,
 * ordered by videoNumber ascending (chronological).
 */
export function getAdjacentColors(
  hex: string
): { prev: IndexEntry | null; next: IndexEntry | null } {
  const all = getAllColors().sort((a, b) => a.videoNumber - b.videoNumber);
  const upper = hex.toUpperCase();
  const idx = all.findIndex(
    (c) => c.hex.replace("#", "").toUpperCase() === upper
  );

  if (idx === -1) return { prev: null, next: null };

  const toEntry = (c: ColorData): IndexEntry => ({
    hex: c.hex,
    title: c.title,
    videoNumber: c.videoNumber,
    path: `${c.hex.replace("#", "").toUpperCase().slice(0, 2)}/${c.hex
      .replace("#", "")
      .toUpperCase()}.json`,
  });

  return {
    prev: idx > 0 ? toEntry(all[idx - 1]) : null,
    next: idx < all.length - 1 ? toEntry(all[idx + 1]) : null,
  };
}
