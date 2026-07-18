import type { ReactNode } from "react";

interface SectionTagProps {
  num: string;
  label: string;
  icon: ReactNode;
}

/** Signature element: a stitched garment care tag used as the section eyebrow. */
export function SectionTag({ num, label, icon }: SectionTagProps) {
  return (
    <span className="care-tag">
      <span className="care-tag__icon">{icon}</span>
      <span className="care-tag__num">
        {label} {num}
      </span>
    </span>
  );
}
