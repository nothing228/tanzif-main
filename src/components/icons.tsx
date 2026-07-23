interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/* ---- laundry care symbols (signature icon system) ---- */

export const CareWash = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6l2.6 12.2A2 2 0 0 0 7.6 20h8.8a2 2 0 0 0 2-1.8L21 6" />
    <path d="M4.5 10c1.3-1.2 2.5-1.2 3.8 0s2.4 1.2 3.7 0 2.4-1.2 3.7 0 2.5 1.2 3.8 0" />
  </svg>
);

export const CareDryClean = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="10"
      fontFamily="inherit"
      fill="currentColor"
      stroke="none"
    >
      P
    </text>
  </svg>
);

export const CareIron = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 17h16l-1.4-7.2A3 3 0 0 0 15.7 7H9" />
    <path d="M9 7C6 7 4.5 9.5 4 17" />
    <circle cx="12" cy="13" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export const CareDry = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="12" r="4.5" />
  </svg>
);

export const CareHand = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 7l2.4 10.6A2 2 0 0 0 7.4 19h9.2a2 2 0 0 0 2-1.4L21 7" />
    <path d="M12 7V4.5a1.5 1.5 0 0 1 3 0" />
    <path d="M4.5 11c1.3-1.2 2.5-1.2 3.8 0s2.4 1.2 3.7 0 2.4-1.2 3.7 0 2.5 1.2 3.8 0" />
  </svg>
);

/* ---- garment / item icons (calculator) ---- */

export const IconCoat = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9 3L5 5.5 3.5 12l3 .8V21h11v-8.2l3-.8L19 5.5 15 3" />
    <path d="M9 3c0 2 1.2 3 3 3s3-1 3-3" />
    <path d="M12 6v15" />
  </svg>
);

export const IconSuit = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M8 3h8l2 4-2 14H8L6 7l2-4z" />
    <path d="M8 3l4 5 4-5" />
    <path d="M12 8l-1.5 4L12 21l1.5-9L12 8z" />
  </svg>
);

export const IconCarpet = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M8 7h8M8 12h8M8 17h8" />
    <path d="M4 3l-1.5 1.5M20 3l1.5 1.5M4 21l-1.5-1.5M20 21l1.5-1.5" strokeWidth="1.3" />
  </svg>
);

export const IconSofa = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
    <path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z" />
    <path d="M6 18v2M18 18v2" />
  </svg>
);

export const IconCurtain = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 4h18" />
    <path d="M6 4c0 6 .5 11-2 17M18 4c0 6-.5 11 2 17" />
    <path d="M12 4c0 5 0 9 0 9" />
    <path d="M12 13c-3 1.5-4.5 4.5-5 8M12 13c3 1.5 4.5 4.5 5 8" />
  </svg>
);

export const IconShoe = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 17h18v-2c0-2-3-3-6-4l-3-4-4 1v7" />
    <path d="M3 10v7" />
    <path d="M11 9l1.5 1.8M9 10l1.4 1.7" strokeWidth="1.3" />
  </svg>
);

export const IconBag = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 8h14l1 12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1L5 8z" />
    <path d="M8.5 11V6.5a3.5 3.5 0 0 1 7 0V11" />
  </svg>
);

/* ---- utility icons ---- */

export const IconStar = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9 2.9-6z" />
  </svg>
);

export const IconPin = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconCheck = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const IconBell = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 14 6 9z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const IconCamera = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-3v10l-6-3" />
  </svg>
);

export const IconLeaf = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M5 20C5 9 12 4 21 4c0 10-5 16-14 16" />
    <path d="M5 20c2-6 6-10 11-12" />
  </svg>
);

export const IconSearch = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

/* recognizable brand glyphs — filled, so they read at footer size */
export const IconTelegram = ({ size = 20, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

export const IconInstagram = ({ size = 20, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    className={className}
    aria-hidden
  >
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconMail = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M4 7l8 5.5L20 7" />
  </svg>
);

export const IconGift = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="9" width="18" height="12" rx="2" />
    <path d="M3 13h18M12 9v12" />
    <path d="M12 9S9.5 9 8.4 7.9a2.1 2.1 0 0 1 3-3C12.4 6 12 9 12 9z" />
    <path d="M12 9s2.5 0 3.6-1.1a2.1 2.1 0 0 0-3-3C11.6 6 12 9 12 9z" />
  </svg>
);

export const IconUsers = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-5.4 6-5.4s6 2.1 6 5.4" />
    <path d="M16 5.3a3.2 3.2 0 0 1 0 6.1" />
    <path d="M18 14.9c2 .8 3 2.6 3 5.1" />
  </svg>
);

/** price tag with a spark — the "special offers" perk */
export const IconSparkTag = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M20.5 12.8l-7.7 7.7a2 2 0 0 1-2.8 0l-6.5-6.5a2 2 0 0 1-.6-1.6l.5-5.6a2 2 0 0 1 1.8-1.8l5.6-.5a2 2 0 0 1 1.6.6l6.5 6.5a2 2 0 0 1 0 2.8z" />
    <circle cx="8.6" cy="8.6" r="1.4" />
  </svg>
);

export const IconArrowUp = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 19V6" />
    <path d="M6 11l6-6 6 6" />
  </svg>
);

export const IconArrowRight = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

export const IconSend = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export const IconShield = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6L12 3z" />
    <path d="M8.8 12l2.2 2.2 4.4-4.4" />
  </svg>
);

export const IconUmbrella = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z" />
    <path d="M12 3v-.5M12 12v6.5a2 2 0 0 0 4 0" />
  </svg>
);

export const IconEye = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconEyeOff = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 4l16 16" />
    <path d="M10.6 5.7A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17.5 17.5 0 0 1-2.4 3.2M6.6 6.9C4 8.8 2.5 12 2.5 12S6 18.5 12 18.5c1.5 0 2.9-.4 4.1-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export const IconSun = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" />
  </svg>
);

export const IconMoon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
  </svg>
);

/* 4-point sparkle (from the TANZIF brand mark) */
const star = (cx: number, cy: number, s: number) =>
  `M${cx} ${cy - s} Q${cx} ${cy} ${cx + s} ${cy} Q${cx} ${cy} ${cx} ${cy + s} Q${cx} ${cy} ${cx - s} ${cy} Q${cx} ${cy} ${cx} ${cy - s} Z`;

export const Sparkle = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d={star(12, 12, 11)} />
  </svg>
);

/* ---- more garment / item icons (price list) ---- */

export const IconHat = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6.5 14.5a5.5 5.5 0 0 1 11 0" />
    <path d="M4 14.5h16a1.75 1.75 0 0 1 0 3.5H4a1.75 1.75 0 0 1 0-3.5z" />
  </svg>
);

export const IconTie = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M10 3h4l-1 4 2 9-3 5-3-5 2-9-1-4z" />
    <path d="M9 7h6" />
  </svg>
);

export const IconShirt = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9 3L4 6l1.5 4L8 9v12h8V9l2.5 1L20 6l-5-3" />
    <path d="M9 3a3 3 0 0 0 6 0" />
  </svg>
);

export const IconDress = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9 3l-1 4 1 2-3 12h12L15 9l1-2-1-4" />
    <path d="M9 3h6" />
    <path d="M8 9h8" />
  </svg>
);

export const IconBed = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M3 12a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6H3z" />
    <path d="M3 15h18" />
    <path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconStroller = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 13V6a7 7 0 0 1 7 7z" />
    <path d="M4 13h16l-2.5 4h-9z" />
    <circle cx="8.5" cy="19.5" r="1.6" />
    <circle cx="15.5" cy="19.5" r="1.6" />
    <path d="M20 13V4.5" />
  </svg>
);

export const IconSpray = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="7" y="8" width="7.5" height="13" rx="2" />
    <path d="M8.5 8V5.5A1.5 1.5 0 0 1 10 4h1.5A1.5 1.5 0 0 1 13 5.5V8" />
    <path d="M17.5 5h.01M20 8h.01M17.5 11h.01" strokeWidth="2.2" />
  </svg>
);

export const IconSuitcase = ({ size = 26, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M8 20v1M16 20v1M3 12h18" />
  </svg>
);
