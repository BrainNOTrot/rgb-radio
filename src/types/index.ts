// Types matching the exact JSON schema from archive/schema.json and archive/stats.json
// DO NOT modify — these mirror the backend exactly.

export interface ColorData {
  hex: string;           // e.g. "#000000"
  rgb: [number, number, number];
  name: string | null;   // null when no name assigned
  title: string;         // e.g. "#000000 — Black"
  videoNumber: number;
  youtubeUrl: string;
  song: string;
  artist: string;
  duration: string;      // e.g. "4:11"
  license: string;
  uploaded: string;      // "YYYY-MM-DD"
}

export interface StatsData {
  project: string;
  started: string;
  uploaded: number;
  remaining: number;
  totalColors: number;
  latest: string;        // hex with #, e.g. "#000003"
  latestVideo: number;
}

export interface IndexEntry {
  hex: string;
  title: string;
  videoNumber: number;
  path: string;          // relative path under archive/colors/, e.g. "00/000000.json"
}
