import { useEffect, useRef } from "react";

/** Adds .is-visible when the element scrolls into view (once). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reveal is a progressive enhancement: if motion is reduced or the observer
    // is unavailable, show the content immediately rather than leaving it hidden.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      // One trigger point for every section: fire once the element has risen
      // ~12% of the viewport past the fold, so short and tall blocks alike
      // animate at the same moment relative to the reader. threshold 0 keeps
      // very tall blocks (e.g. the price catalog) from waiting for a ratio they
      // can never reach.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
