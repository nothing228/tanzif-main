import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { AnchorLink } from "./AnchorLink";
import { IconArrowLeft, IconArrowRight } from "./icons";
import { Partners } from "./Partners";
import "./Hero.scss";

const SLIDES = [
  "/hero/slide-1.png",
  "/hero/slide-2.png",
  "/hero/slide-3.png",
  "/hero/slide-4.png",
] as const;

const INTERVAL_MS = 5000;

export function Hero() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: 1 | -1) => {
    setActive((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  const goTo = useCallback((i: number) => setActive(i), []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, go]);

  return (
    <section
      className="hero"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) < 48) return;
        go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="hero__carousel" aria-hidden>
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={`hero__slide${i === active ? " is-active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero__scrim" aria-hidden />

      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">{t.hero.title}</h1>
          <p className="hero__sub">{t.hero.sub}</p>
          <div className="hero__ctas">
            <AnchorLink id="calc" className="btn btn--primary hero__cta">
              {t.hero.ctaOrder}
              <IconArrowRight size={18} className="hero__cta-arrow" />
            </AnchorLink>
            <AnchorLink id="calc" className="btn btn--ghost hero__cta">
              {t.hero.ctaPrice}
              <IconArrowRight size={18} className="hero__cta-arrow" />
            </AnchorLink>
            <AnchorLink id="pickup" className="btn btn--ghost hero__cta">
              {t.hero.ctaCourier}
              <IconArrowRight size={18} className="hero__cta-arrow" />
            </AnchorLink>
          </div>
        </div>
      </div>

      <div className="hero__nav" aria-label="Hero slides">
        <button
          type="button"
          className="hero__arrow hero__arrow--prev"
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="hero__dots" role="tablist">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              className={`hero__dot${i === active ? " is-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="hero__arrow hero__arrow--next"
          aria-label="Next slide"
          onClick={() => go(1)}
        >
          <IconArrowRight size={20} />
        </button>
      </div>

      <div className="container hero__foot">
        <Partners />
      </div>
    </section>
  );
}
