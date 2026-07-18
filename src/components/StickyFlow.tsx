import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import "./StickyFlow.scss";

/**
 * One section, one sticky heading column.
 *
 * Replaces per-section sticky heads: those pinned and then tore away at every
 * section boundary, so scrolling felt like a series of stops. Here the column
 * stays put for the whole run and only its content cross-fades.
 *
 * Each block keeps its own `id`, so the header anchors and the scroll-spy still
 * find it. Below 900px it stacks and every block carries its own heading.
 */

export interface FlowBlock {
  id: string;
  /** care-tag eyebrow */
  tag?: ReactNode;
  title: string;
  lead?: string;
  content: ReactNode;
}

export function StickyFlow({ blocks, className = "" }: { blocks: FlowBlock[]; className?: string }) {
  const [active, setActive] = useState(0);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = () => panelsRef.current.filter(Boolean) as HTMLDivElement[];

    // the panel closest to the middle of the viewport owns the heading
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      els().forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [blocks.length]);

  return (
    <section className={`section sticky-flow ${className}`.trim()}>
      <div className="container sticky-flow__grid">
        <div className="sticky-flow__head">
          <div className="sticky-flow__stack">
            {blocks.map((b, i) => (
              <div key={b.id} className={`sticky-flow__card ${active === i ? "is-active" : ""}`}>
                {b.tag}
                <h2>{b.title}</h2>
                {b.lead && <p>{b.lead}</p>}
              </div>
            ))}
          </div>

          <div className="sticky-flow__dots" aria-hidden>
            {blocks.map((b, i) => (
              <span key={b.id} className={active === i ? "is-active" : ""} />
            ))}
          </div>
        </div>

        <div className="sticky-flow__panels">
          {blocks.map((b, i) => (
            <div
              key={b.id}
              id={b.id}
              className="sticky-flow__panel"
              ref={(el) => {
                panelsRef.current[i] = el;
              }}
            >
              {/* phones: the heading rides with its own block */}
              <div className="sticky-flow__panel-head">
                {b.tag}
                <h2>{b.title}</h2>
                {b.lead && <p>{b.lead}</p>}
              </div>
              {b.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
