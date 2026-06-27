import Link from "next/link";

interface NavProps {
  /** When true, show a dimmed version (for use over color previews) */
  invert?: boolean;
}

export function Nav({ invert = false }: NavProps) {
  const base = invert
    ? "text-black/70 hover:text-black"
    : "text-white/60 hover:text-white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-normal">
      {/* Logo */}
      <Link
        href="/"
        className={`font-mono text-sm font-bold tracking-[0.15em] uppercase transition-colors ${base}`}
      >
        RGB RADIO
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link
          href="/archive"
          className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors ${base}`}
        >
          Archive
        </Link>
      </div>
    </nav>
  );
}
