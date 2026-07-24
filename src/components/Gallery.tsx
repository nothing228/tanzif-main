import { useState, type CSSProperties } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SectionTag } from "./SectionTag";
import { CareIron } from "./icons";
import { GALLERY_ITEMS, GALLERY_KEYS, type GalleryKey, type GalleryShot } from "../data/gallery";
import "./Gallery.scss";

function frameProps(shot: GalleryShot, side: "before" | "after"): { src: string; className: string; style?: CSSProperties } {
  if (shot.kind === "pair") {
    return {
      src: side === "before" ? shot.before : shot.after,
      className: "",
      style: side === "before" && shot.beforeFilter ? { filter: shot.beforeFilter } : undefined,
    };
  }
  return {
    src: shot.src,
    className: side === "before" ? "gallery__img--split-x-before" : "gallery__img--split-x-after",
    style: undefined,
  };
}

function SparkStar({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
    </svg>
  );
}

function BenefitIcon({ name }: { name: "safe" | "hypo" | "deep" }) {
  if (name === "safe") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" />
        <path d="M9 12 L11 14 L15 9" />
      </svg>
    );
  }
  if (name === "hypo") {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M6 20c8 2 12-4 12-10 0 0-8-4-12 4-2 4 0 6 0 6z" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <circle cx="7" cy="6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Gallery() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const [filter, setFilter] = useState<GalleryKey>("avtokreslo");

  const item = GALLERY_ITEMS.find((i) => i.key === filter) ?? GALLERY_ITEMS[0];
  const before = frameProps(item.shot, "before");
  const after = frameProps(item.shot, "after");
  const benefits = [
    { icon: "safe" as const, ...t.gallery.benefits.safe },
    { icon: "hypo" as const, ...t.gallery.benefits.hypo },
    { icon: "deep" as const, ...t.gallery.benefits.deep },
  ];

  return (
    <section className="section section--white gallery-section" id="gallery">
      <div className="container reveal-stagger" ref={ref}>
        <div className="section-head">
          <SectionTag num="05" label={t.module} icon={<CareIron size={18} />} />
          <h2>{t.gallery.title}</h2>
          <p>{t.gallery.lead}</p>
        </div>

        <div className="gallery">
          <div className="gallery__filters" role="tablist" aria-label={t.gallery.title}>
            {GALLERY_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                className={`gallery__filter ${filter === key ? "is-active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {t.gallery.filters[key]}
              </button>
            ))}
          </div>

          <div className="gallery__stage">
            <div className="gallery__glow" aria-hidden />

            <div className="gallery__legend">
              <span className="gallery__badge gallery__badge--before mono">{t.gallery.before}</span>
              <div className="gallery__spark gallery__spark--mobile" aria-hidden>
                <SparkStar size={22} />
              </div>
              <span className="gallery__badge gallery__badge--after mono">{t.gallery.after}</span>
            </div>

            <div className="gallery__compare">
              <article className="gallery__panel">
                <div className="gallery__frame">
                  <img
                    key={`${filter}-before`}
                    src={before.src}
                    alt={`${t.gallery.filters[filter]} — ${t.gallery.before}`}
                    className={`gallery__img ${before.className}`}
                    style={before.style}
                    loading="lazy"
                  />
                </div>
              </article>

              <div className="gallery__spark gallery__spark--desktop" aria-hidden>
                <SparkStar />
              </div>

              <article className="gallery__panel">
                <div className="gallery__frame">
                  <img
                    key={`${filter}-after`}
                    src={after.src}
                    alt={`${t.gallery.filters[filter]} — ${t.gallery.after}`}
                    className={`gallery__img ${after.className}`}
                    loading="lazy"
                  />
                </div>
              </article>
            </div>

            <ul className="gallery__benefits">
              {benefits.map((b) => (
                <li key={b.icon} className="gallery__benefit">
                  <span className="gallery__benefit-icon">
                    <BenefitIcon name={b.icon} />
                  </span>
                  <span>
                    <strong>{b.title}</strong>
                    <small>{b.sub}</small>
                  </span>
                </li>
              ))}
            </ul>

            <p className="gallery__tagline mono">{t.gallery.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
