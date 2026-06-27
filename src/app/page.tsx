import type { Metadata } from "next";
import Link from "next/link";
import { getStats, getColor } from "@/lib/archive";
import { readableTextColor, formatHex } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "RGB RADIO — Every Color Has a Sound.",
  description:
    "A living archive of every RGB color, each paired with a song. 16,777,216 colors. One at a time.",
  openGraph: {
    title: "RGB RADIO — Every Color Has a Sound.",
    description:
      "A living archive of every RGB color, each paired with a song. 16,777,216 colors. One at a time.",
  },
};

// Revalidate on every Vercel build (static at build time, refreshed on push)
export const revalidate = false;

export default function HomePage() {
  const stats = getStats();

  // latest may not have a JSON file yet (stats ahead of files), so guard
  const latestSlug = stats.latest.replace("#", "").toUpperCase();
  const latestColor = getColor(latestSlug);

  const pct = ((stats.uploaded / stats.totalColors) * 100).toFixed(6);

  // Determine a foreground color for the latest swatch
  const swatchBg = latestColor?.hex ?? "#000000";
  const textColor = readableTextColor(swatchBg);
  const textClass = textColor === "white" ? "text-white" : "text-black";
  const mutedClass = textColor === "white" ? "text-white/60" : "text-black/60";

  return (
    <>
      <Nav />

      <main className="min-h-screen flex flex-col">
        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
          {/* Wordmark */}
          <div className="mb-12 animate-fade-in">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4">
              {stats.project}
            </p>
            <h1 className="font-mono text-4xl sm:text-6xl font-bold tracking-tight leading-none text-white">
              RGB
              <br />
              RADIO
            </h1>
            <p className="font-mono text-sm sm:text-base text-white/40 mt-5 tracking-wide">
              Every Color Has a Sound.
            </p>
          </div>

          {/* Progress */}
          <div className="w-full max-w-xl mb-14 animate-fade-in">
            <ProgressBar
              uploaded={stats.uploaded}
              totalColors={stats.totalColors}
              remaining={stats.remaining}
            />
          </div>

          {/* Latest color card */}
          {latestColor ? (
            <div className="mb-12 animate-slide-up w-full max-w-xs">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">
                Latest upload
              </p>

              <Link
                href={`/color/${latestSlug}`}
                className="block group relative overflow-hidden hover:scale-[1.02] transition-transform duration-200"
              >
                {/* Swatch */}
                <div
                  className="w-full aspect-[3/2]"
                  style={{ backgroundColor: latestColor.hex }}
                />
                {/* Overlay info */}
                <div
                  className="absolute inset-x-0 bottom-0 px-4 py-3"
                  style={{
                    background:
                      textColor === "white"
                        ? "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)"
                        : "linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 100%)",
                  }}
                >
                  <p className={`font-mono text-sm font-bold ${textClass}`}>
                    {formatHex(latestColor.hex)}
                  </p>
                  {latestColor.name && (
                    <p className={`font-mono text-xs ${mutedClass}`}>
                      {latestColor.name}
                    </p>
                  )}
                  <p className={`font-mono text-xs ${mutedClass}`}>
                    {latestColor.song}
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            /* Stats only said there's a latest, but the file isn't there */
            <div className="mb-12 w-full max-w-xs">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-3">
                Latest upload
              </p>
              <div className="w-full aspect-[3/2] bg-white/5 flex items-center justify-center border border-white/10">
                <span className="font-mono text-sm text-white/40">
                  {formatHex(stats.latest)}
                </span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
            <Link href="/archive" className="btn-primary">
              View Archive
            </Link>
            <a
              href={latestColor?.youtubeUrl ?? `https://www.youtube.com/results?search_query=RGB+RADIO`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Latest on YouTube ↗
            </a>
          </div>
        </section>

        {/* ─── Footer stats row ──────────────────────────────────────────── */}
        <footer className="border-t border-white/10 px-6 py-6">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="stat-label">Uploaded</p>
                <p className="stat-value text-lg">
                  {stats.uploaded.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <p className="stat-label">Remaining</p>
                <p className="stat-value text-lg text-white/40">
                  {stats.remaining.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <p className="stat-label">Total</p>
                <p className="stat-value text-lg text-white/40">
                  {stats.totalColors.toLocaleString("en-US")}
                </p>
              </div>
            </div>

            <p className="font-mono text-[10px] text-white/20 tracking-wide">
              Started {stats.started}
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
