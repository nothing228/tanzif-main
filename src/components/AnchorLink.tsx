import { useLocation, useNavigate } from "react-router-dom";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/** section ids used by the one-page layout */
export const SECTIONS = {
  top: "top",
  how: "how",
  calc: "calc",
  pickup: "pickup",
  tracking: "tracking",
  gallery: "gallery",
  concierge: "concierge",
  personal: "personal",
  business: "business",
  club: "club",
  knowledge: "knowledge",
} as const;

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

type AnchorLinkProps = {
  id: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "id" | "href" | "onClick" | "className" | "children">;

/**
 * Scrolls to a section on the home page. When the user is on another route
 * (profile), it goes home first and scrolls once that page is mounted.
 */
export function AnchorLink({ id, children, className, onClick, ...rest }: AnchorLinkProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const go = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
    if (pathname === "/") {
      scrollToSection(id);
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <a href={`#${id}`} className={className} onClick={go} {...rest}>
      {children}
    </a>
  );
}
