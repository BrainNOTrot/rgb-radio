import Link from "next/link";
import { ColorData } from "@/types";
import { readableTextColor, formatHex } from "@/lib/utils";

interface ColorCardProps {
  color: ColorData;
}

export function ColorCard({ color }: ColorCardProps) {
  const slug = color.hex.replace("#", "").toUpperCase();
  const textColor = readableTextColor(color.hex);
  const textClass = textColor === "white" ? "text-white" : "text-black";
  const mutedClass =
    textColor === "white" ? "text-white/50" : "text-black/50";

  return (
    <Link
      href={`/color/${slug}`}
      className="group block overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-white/60"
    >
      {/* Color swatch */}
      <div
        className="aspect-square w-full"
        style={{ backgroundColor: color.hex }}
      />

      {/* Info strip */}
      <div className="bg-white/5 border border-white/10 px-3 py-2.5 space-y-0.5 group-hover:border-white/20 transition-colors">
        <p className="font-mono text-xs font-semibold text-white tracking-wide">
          {formatHex(color.hex)}
        </p>
        {color.name && (
          <p className="font-mono text-[10px] text-white/50 truncate">
            {color.name}
          </p>
        )}
        <p className="font-mono text-[10px] text-white/40 truncate">
          {color.song}
        </p>
        <p className="font-mono text-[10px] text-white/25">
          #{color.videoNumber}
        </p>
      </div>
    </Link>
  );
}
