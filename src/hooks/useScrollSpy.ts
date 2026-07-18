import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently under the header.
 * `offset` must clear the fixed header plus the scroll-padding it lands on,
 * otherwise the section you just jumped to isn't counted as reached.
 */
export function useScrollSpy(ids: string[], offset = 140): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const pick = () => {
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [ids, offset]);

  return active;
}
