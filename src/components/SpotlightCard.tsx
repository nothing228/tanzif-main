import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import "./SpotlightCard.scss";

/**
 * Spotlight card (React Bits port → TypeScript + SCSS).
 *
 * Adapted for this app:
 * - polymorphic via `as`, so existing cards (article, Link, …) keep their markup;
 * - the pointer position is read from `e.currentTarget`, so no ref is needed;
 * - the SCSS only adds the glow — surface styling stays with each card's class.
 */

type SpotlightCardProps<T extends ElementType> = {
  as?: T;
  spotlightColor?: string;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function SpotlightCard<T extends ElementType = "div">({
  as,
  spotlightColor = "rgba(201, 162, 84, 0.4)",
  className = "",
  children,
  ...rest
}: SpotlightCardProps<T>) {
  const Comp = (as ?? "div") as ElementType;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    el.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <Comp onMouseMove={handleMouseMove} className={`spotlight-card ${className}`.trim()} {...rest}>
      {children}
    </Comp>
  );
}
