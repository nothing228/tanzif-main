import { useCallback, useRef, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SectionTag } from "./SectionTag";
import { Swatch } from "./Swatch";
import { CareIron } from "./icons";
import "./Gallery.scss";

type FilterKey = "gilam" | "divan" | "palto" | "parda" | "krossovka" | "sumka";

const FILTERS: FilterKey[] = ["gilam", "divan", "palto", "parda", "krossovka", "sumka"];

function Stains() {
  return (
    <svg className="gallery__stains" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300" aria-hidden>
      <defs>
        <filter id="stain-blur">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g filter="url(#stain-blur)">
        <ellipse cx="120" cy="90" rx="46" ry="34" fill="#3a2a18" opacity="0.5" />
        <ellipse cx="150" cy="115" rx="26" ry="18" fill="#241a0e" opacity="0.4" />
        <ellipse cx="300" cy="200" rx="56" ry="38" fill="#4a3520" opacity="0.45" />
        <ellipse cx="70" cy="230" rx="30" ry="22" fill="#33261a" opacity="0.4" />
        <ellipse cx="250" cy="60" rx="22" ry="15" fill="#2c2013" opacity="0.35" />
      </g>
    </svg>
  );
}

export function Gallery() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const [filter, setFilter] = useState<FilterKey>("gilam");
  const [pos, setPos] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 4));
  };

  return (
    <section className="section section--white" id="gallery">
      <div className="container">
        <div className="section-head">
          <SectionTag num="05" label={t.module} icon={<CareIron size={18} />} />
          <h2>{t.gallery.title}</h2>
          <p>{t.gallery.lead}</p>
        </div>

        <div className="gallery reveal" ref={ref}>
          <div className="gallery__filters" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                className={`gallery__filter ${filter === f ? "is-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {t.gallery.filters[f]}
              </button>
            ))}
          </div>

          <div
            className="gallery__frame"
            ref={frameRef}
            onPointerDown={onPointerDown}
            onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {/* after (clean) */}
            <div className="gallery__side gallery__side--after">
              <Swatch variant={filter} className="gallery__swatch" />
            </div>
            {/* before (dirty), clipped */}
            <div
              className="gallery__side gallery__side--before"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Swatch variant={filter} className="gallery__swatch" />
              <Stains />
            </div>

            <span className="gallery__badge gallery__badge--before mono">{t.gallery.before}</span>
            <span className="gallery__badge gallery__badge--after mono">{t.gallery.after}</span>

            <div
              className="gallery__handle"
              style={{ left: `${pos}%` }}
              role="slider"
              aria-label={t.gallery.hint}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              tabIndex={0}
              onKeyDown={onKeyDown}
            >
              <span className="gallery__handle-grip">⟨ ⟩</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
