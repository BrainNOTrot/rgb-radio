"use client";

import { useEffect, useRef } from "react";

interface ProgressBarProps {
  uploaded: number;
  totalColors: number;
  remaining: number;
}

export function ProgressBar({ uploaded, totalColors, remaining }: ProgressBarProps) {
  const pct = ((uploaded / totalColors) * 100).toFixed(8);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Animate after mount
    const raf = requestAnimationFrame(() => {
      bar.style.width = `${pct}%`;
    });
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  const formatNumber = (n: number) => n.toLocaleString("en-US");

  return (
    <div className="w-full space-y-3">
      {/* Bar */}
      <div className="relative h-px bg-white/10 w-full overflow-hidden">
        <div
          ref={barRef}
          className="absolute left-0 top-0 h-full bg-white transition-[width] duration-1000 ease-out"
          style={{ width: "0%" }}
          role="progressbar"
          aria-valuenow={uploaded}
          aria-valuemin={0}
          aria-valuemax={totalColors}
          aria-label={`${uploaded} of ${totalColors} colors uploaded`}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-white/40 tabular-nums">
            {formatNumber(uploaded)}
          </span>
          <span className="font-mono text-xs text-white/20">/</span>
          <span className="font-mono text-xs text-white/20 tabular-nums">
            {formatNumber(totalColors)}
          </span>
          <span className="font-mono text-xs text-white/20 ml-2">
            uploaded
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-white/30 tabular-nums hidden sm:block">
            {formatNumber(remaining)} remaining
          </span>
          <span className="font-mono text-xs text-white/40 tabular-nums">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
