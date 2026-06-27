import type { Metadata } from "next";
import { getAllColors, getStats } from "@/lib/archive";
import { ColorCard } from "@/components/ColorCard";
import { Nav } from "@/components/Nav";
import { ProgressBar } from "@/components/ProgressBar";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Every uploaded color in the RGB RADIO archive — each one paired with a song.",
  openGraph: {
    title: "Archive | RGB RADIO",
    description:
      "Every uploaded color in the RGB RADIO archive — each one paired with a song.",
  },
};

export const revalidate = false;

export default function ArchivePage() {
  const colors = getAllColors(); // newest first
  const stats = getStats();

  return (
    <>
      <Nav />

      <main className="min-h-screen px-6 pt-24 pb-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
            RGB RADIO
          </p>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
            Archive
          </h1>

          {/* Inline progress */}
          <div className="max-w-sm">
            <ProgressBar
              uploaded={stats.uploaded}
              totalColors={stats.totalColors}
              remaining={stats.remaining}
            />
          </div>
        </div>

        {/* Count */}
        <p className="font-mono text-xs text-white/30 mb-6 tracking-wide">
          {colors.length} color{colors.length !== 1 ? "s" : ""} uploaded
        </p>

        {/* Grid */}
        {colors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {colors.map((color) => (
              <ColorCard
                key={color.hex}
                color={color}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-mono text-white/20 text-sm">
              No colors uploaded yet.
            </p>
            <p className="font-mono text-white/10 text-xs mt-2">
              Run scripts/add_color.py to add the first one.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
