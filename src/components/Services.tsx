import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { Swatch } from "./Swatch";
import type { SwatchVariant } from "./Swatch";
import { AnchorLink } from "./AnchorLink";
import {
  IconBed,
  IconCheck,
  IconCoat,
  IconShoe,
  IconSofa,
  IconSpray,
  IconStroller,
} from "./icons";
import "./Services.scss";

/**
 * Sticky services block: the left column stays put and cross-fades while the
 * right column scrolls through the panels. Below 900px it stacks — each panel
 * carries its own heading and the sticky column is dropped.
 */

/* order follows t.services.items: clothes, shoes, home textiles, kids,
   furniture, dyeing */
const ICONS = [IconCoat, IconShoe, IconBed, IconStroller, IconSofa, IconSpray];

export function Services() {
  const { t } = useLang();
  const items = t.services.items;
  const [active, setActive] = useState(0);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = panelsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    // the panel closest to the middle of the viewport wins
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      els.forEach((el, i) => {
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
  }, [items.length]);

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="section-head">
          <h2>{t.services.title}</h2>
          <p>{t.services.lead}</p>
        </div>

        <div className="services">
          {/* sticky column — desktop only; the panels repeat this for phones */}
          <div className="services__sticky" aria-hidden>
            <div className="services__stack">
              {items.map((s, i) => {
                const Icon = ICONS[i];
                return (
                  <div
                    key={s.name}
                    className={`services__card ${active === i ? "is-active" : ""}`}
                  >
                    <span className="services__icon">
                      <Icon size={30} />
                    </span>
                    <h3>{s.name}</h3>
                    <p>{s.desc}</p>
                    <AnchorLink id="calc" className="btn btn--primary services__cta">
                      {t.hero.ctaOrder}
                    </AnchorLink>
                  </div>
                );
              })}
            </div>

            <div className="services__dots">
              {items.map((s, i) => (
                <span key={s.name} className={active === i ? "is-active" : ""} />
              ))}
            </div>
          </div>

          {/* scrolling panels */}
          <div className="services__panels">
            {items.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div
                  key={s.name}
                  className="services__panel"
                  ref={(el) => {
                    panelsRef.current[i] = el;
                  }}
                >
                  {/* phones: the heading rides with its panel */}
                  <div className="services__panel-head">
                    <span className="services__icon">
                      <Icon size={26} />
                    </span>
                    <h3>{s.name}</h3>
                    <p>{s.desc}</p>
                  </div>

                  <div className="services__visual">
                    {/* The woven pattern sits underneath. The photo starts
                        transparent and only fades in once it actually decodes —
                        the SPA catch-all answers a missing file with 200 HTML
                        rather than a 404, so onError alone would not catch it. */}
                    <Swatch variant={s.swatch as SwatchVariant} className="services__swatch" />
                    <img
                      className="services__photo"
                      src={`/services/${s.photo}.jpg`}
                      alt={s.name}
                      loading="lazy"
                      onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                    />
                  </div>

                  <ul className="services__features">
                    {s.features.map((f) => (
                      <li key={f.name}>
                        <span className="services__feature-icon">
                          <IconCheck size={15} />
                        </span>
                        <div>
                          <strong>{f.name}</strong>
                          <p>{f.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
