import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getColor, getAllHexSlugs, getAdjacentColors } from "@/lib/archive";
import { readableTextColor, formatHex } from "@/lib/utils";
import { Nav } from "@/components/Nav";

interface Props {
  params: Promise<{ hex: string }>;
}

// Static paths for all uploaded colors
export async function generateStaticParams() {
  const slugs = getAllHexSlugs();
  return slugs.map((hex) => ({ hex }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hex } = await params;
  const color = getColor(hex.toUpperCase());
  if (!color) return { title: "Color Not Found" };

  const title = color.title;
  const description = `${formatHex(color.hex)} — ${color.song} by ${color.artist}. Video #${color.videoNumber} in the RGB RADIO archive.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | RGB RADIO`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} | RGB RADIO`,
      description,
    },
  };
}

export const revalidate = false;

export default async function ColorPage({ params }: Props) {
  const { hex } = await params;
  const slug = hex.toUpperCase();
  const color = getColor(slug);

  if (!color) notFound();

  const { prev, next } = getAdjacentColors(slug);
  const textColor = readableTextColor(color.hex);
  const isLight = textColor === "black";

  const textClass = isLight ? "text-black" : "text-white";
  const mutedClass = isLight ? "text-black/60" : "text-white/50";
  const veryMutedClass = isLight ? "text-black/35" : "text-white/25";
  const borderClass = isLight ? "border-black/15" : "border-white/10";
  const btnClass = isLight
    ? "bg-black text-white hover:bg-black/80"
    : "bg-white text-black hover:bg-white/90";
  const ghostBtnClass = isLight
    ? "border-black/20 text-black/70 hover:bg-black/5"
    : "border-white/15 text-white/60 hover:bg-white/5";

  const [r, g, b] = color.rgb;

  return (
    <>
      {/* Full-viewport color preview */}
      <div
        className="fixed inset-0 z-0 transition-colors duration-500"
        style={{ backgroundColor: color.hex }}
        aria-hidden="true"
      />

      <Nav invert={isLight} />

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* ─── Hero swatch area ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-8 text-center">
          {/* HEX — the identity */}
          <h1
            className={`font-mono text-5xl sm:text-7xl font-bold tracking-tight ${textClass} mb-2 leading-none`}
          >
            {formatHex(color.hex)}
          </h1>

          {/* Name (if any) */}
          {color.name && (
            <p className={`font-mono text-lg ${mutedClass} mt-2`}>
              {color.name}
            </p>
          )}

          {/* RGB */}
          <p className={`font-mono text-sm ${veryMutedClass} mt-3 tracking-widest`}>
            rgb({r}, {g}, {b})
          </p>

          {/* Video number badge */}
          <div className={`mt-5 inline-flex items-center gap-1.5 border ${borderClass} px-3 py-1`}>
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${veryMutedClass}`}>
              Video
            </span>
            <span className={`font-mono text-[10px] font-semibold ${mutedClass}`}>
              #{color.videoNumber}
            </span>
          </div>
        </div>

        {/* ─── Details panel ──────────────────────────────────────────────── */}
        <div className="px-6 pb-10">
          <div
            className="max-w-xl mx-auto rounded-none"
            style={{
              background: isLight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              border: isLight
                ? "1px solid rgba(0,0,0,0.1)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Metadata rows */}
            <div className={`divide-y ${isLight ? "divide-black/10" : "divide-white/10"}`}>
              {[
                { label: "Song", value: color.song },
                { label: "Artist", value: color.artist },
                { label: "Duration", value: color.duration },
                { label: "License", value: color.license },
                { label: "Uploaded", value: color.uploaded },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${veryMutedClass}`}
                  >
                    {label}
                  </span>
                  <span className={`font-mono text-xs ${mutedClass} text-right`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* YouTube CTA */}
            <div className="px-5 py-4">
              <a
                href={color.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-3 font-mono text-sm font-semibold tracking-tight transition-all duration-150 active:scale-95 ${btnClass}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        </div>

        {/* ─── Prev / Next navigation ─────────────────────────────────────── */}
        <div
          className={`border-t ${borderClass} px-6 py-5`}
          style={{
            background: isLight
              ? "rgba(255,255,255,0.3)"
              : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            {/* Previous */}
            {prev ? (
              <Link
                href={`/color/${prev.hex.replace("#", "").toUpperCase()}`}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs transition-all duration-150 hover:opacity-80 active:scale-95 ${ghostBtnClass}`}
              >
                ← {prev.hex}
              </Link>
            ) : (
              <div />
            )}

            {/* Archive link */}
            <Link
              href="/archive"
              className={`font-mono text-[10px] uppercase tracking-[0.2em] ${veryMutedClass} hover:opacity-70 transition-opacity`}
            >
              Archive
            </Link>

            {/* Next */}
            {next ? (
              <Link
                href={`/color/${next.hex.replace("#", "").toUpperCase()}`}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs transition-all duration-150 hover:opacity-80 active:scale-95 ${ghostBtnClass}`}
              >
                {next.hex} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
