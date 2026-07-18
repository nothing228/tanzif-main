import { useId } from "react";

/** fabric swatches shared by the before/after gallery and the services block */

export type SwatchVariant = "gilam" | "divan" | "palto" | "parda" | "krossovka" | "sumka";

const COLORS: Record<SwatchVariant, { bg: string; fg: string; fg2: string }> = {
  gilam: { bg: "#8c3b3b", fg: "#e8d9b8", fg2: "#3f5c5a" },
  divan: { bg: "#4e7a74", fg: "#dce8e3", fg2: "#37564f" },
  palto: { bg: "#a8794a", fg: "#e9dcc7", fg2: "#7d5732" },
  parda: { bg: "#d9cfb4", fg: "#f2ecdc", fg2: "#b3a685" },
  krossovka: { bg: "#dfe3e6", fg: "#ffffff", fg2: "#aab4bb" },
  sumka: { bg: "#7a4a2b", fg: "#a06a3f", fg2: "#5c3720" },
};

export function Swatch({ variant, className }: { variant: SwatchVariant; className?: string }) {
  const c = COLORS[variant];
  // unique per instance: the gallery and the services block render these side by side
  const pid = `sw-${variant}-${useId().replace(/:/g, "")}`;
  return (
    <svg className={className} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300" aria-hidden>
      <defs>
        {variant === "gilam" && (
          <pattern id={pid} width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="50" height="50" fill={c.bg} />
            <path d="M25 4l21 21-21 21L4 25z" fill="none" stroke={c.fg} strokeWidth="2.5" />
            <path d="M25 14l11 11-11 11-11-11z" fill={c.fg2} />
            <circle cx="25" cy="25" r="3.5" fill={c.fg} />
          </pattern>
        )}
        {variant === "divan" && (
          <pattern id={pid} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={c.bg} />
            <path d="M0 3.5h14M0 10.5h14" stroke={c.fg2} strokeWidth="2.4" />
            <path d="M3.5 0v14M10.5 0v14" stroke={c.fg} strokeWidth="1.4" opacity="0.5" />
          </pattern>
        )}
        {variant === "palto" && (
          <pattern id={pid} width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill={c.bg} />
            <path d="M0 24L12 12M12 12L24 24M0 12L12 0M12 0L24 12" stroke={c.fg2} strokeWidth="3" />
            <path d="M0 18L6 12M18 12l6 6M0 6l6-6M18 0l6 6" stroke={c.fg} strokeWidth="1" opacity="0.35" />
          </pattern>
        )}
        {variant === "parda" && (
          <pattern id={pid} width="46" height="300" patternUnits="userSpaceOnUse">
            <rect width="46" height="300" fill={c.bg} />
            <rect x="0" width="18" height="300" fill={c.fg} />
            <rect x="18" width="8" height="300" fill={c.fg2} opacity="0.55" />
          </pattern>
        )}
        {variant === "krossovka" && (
          <pattern id={pid} width="16" height="14" patternUnits="userSpaceOnUse">
            <rect width="16" height="14" fill={c.bg} />
            <circle cx="4" cy="3.5" r="2.1" fill={c.fg2} opacity="0.7" />
            <circle cx="12" cy="10.5" r="2.1" fill={c.fg2} opacity="0.7" />
            <circle cx="12" cy="3.5" r="1" fill={c.fg} />
            <circle cx="4" cy="10.5" r="1" fill={c.fg} />
          </pattern>
        )}
        {variant === "sumka" && (
          <pattern id={pid} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={c.bg} />
            <path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke={c.fg2} strokeWidth="2" />
            <circle cx="10" cy="10" r="1.1" fill={c.fg} opacity="0.6" />
            <circle cx="30" cy="30" r="1.1" fill={c.fg} opacity="0.6" />
            <circle cx="22" cy="6" r="0.8" fill={c.fg} opacity="0.4" />
          </pattern>
        )}
      </defs>
      <rect width="400" height="300" fill={`url(#${pid})`} />
    </svg>
  );
}
