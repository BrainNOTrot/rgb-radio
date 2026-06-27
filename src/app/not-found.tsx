import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found",
  description: "This color or page doesn't exist in the RGB RADIO archive.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/20 mb-6">
        404
      </p>
      <h1 className="font-mono text-4xl font-bold text-white mb-3">
        Not Found
      </h1>
      <p className="font-mono text-sm text-white/40 mb-10 max-w-xs">
        This color hasn&apos;t been uploaded yet — or the URL is wrong.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
        <Link href="/archive" className="btn-ghost">
          View Archive
        </Link>
      </div>
    </main>
  );
}
