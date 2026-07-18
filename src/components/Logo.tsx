import { useId } from "react";
import {
  LOGO_GRADIENT,
  LOGO_LOCKUP,
  LOGO_MARK,
  LOGO_TAG,
  LOGO_WORD,
} from "../data/logoPaths";

/**
 * The client's logo, traced from public/logo.png — shapes and gradient are
 * measured from that artwork, not redrawn. `mono` swaps the gradient for
 * currentColor (used on the club cards, where the mark takes the card's ink).
 */

interface LogoProps {
  /** rendered height in px */
  size?: number;
  className?: string;
  mono?: boolean;
}

function Gradient({ id, w, h }: { id: string; w: number; h: number }) {
  const { ax, ay, t0, t1, stops } = LOGO_GRADIENT;
  return (
    <linearGradient
      id={id}
      gradientUnits="userSpaceOnUse"
      x1={t0 * ax * w}
      y1={t0 * ay * h}
      x2={t1 * ax * w}
      y2={t1 * ay * h}
    >
      {stops.map(([offset, color]) => (
        <stop key={offset} offset={offset} stopColor={color} />
      ))}
    </linearGradient>
  );
}

/** The "t" mark with its sparkles. */
export function Logo({ size = 34, className, mono = false }: LogoProps) {
  const id = useId().replace(/:/g, "");
  const { w, h, d } = LOGO_MARK;
  return (
    <svg
      width={(size * w) / h}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      aria-hidden
      className={className}
    >
      {!mono && (
        <defs>
          <Gradient id={id} w={w} h={h} />
        </defs>
      )}
      <path d={d} fill={mono ? "currentColor" : `url(#${id})`} fillRule="evenodd" />
    </svg>
  );
}

/** The "tanzif" wordmark. */
export function LogoWord({ size = 20, className, mono = false }: LogoProps) {
  const id = useId().replace(/:/g, "");
  const { w, h, d } = LOGO_WORD;
  return (
    <svg
      width={(size * w) / h}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      role="img"
      aria-label="tanzif"
      className={className}
    >
      {!mono && (
        <defs>
          <Gradient id={id} w={w} h={h} />
        </defs>
      )}
      <path d={d} fill={mono ? "currentColor" : `url(#${id})`} fillRule="evenodd" />
    </svg>
  );
}

/** Full lockup: mark + wordmark + tagline, at the artwork's own proportions. */
export function LogoLockup({ size = 220, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  const { w, h } = LOGO_LOCKUP;
  return (
    <svg
      width={size}
      height={(size * h) / w}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      role="img"
      aria-label="tanzif — территория роскошной чистоты"
      className={className}
    >
      <defs>
        <Gradient id={id} w={w} h={h} />
      </defs>
      {[LOGO_MARK, LOGO_WORD, LOGO_TAG].map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={`url(#${id})`}
          fillRule="evenodd"
          transform={`translate(${p.dx} ${p.dy})`}
        />
      ))}
    </svg>
  );
}
