import { useLang } from "../i18n/LangContext";
import { AnchorLink } from "./AnchorLink";
import { IconArrowRight } from "./icons";
import { Partners } from "./Partners";
import "./Hero.scss";

export function Hero() {
  const { t } = useLang();

  return (
    <section className="hero" id="top">
      {/* photo backdrop + readability scrim; the copy sits on top of both */}
      <div className="hero__bg" aria-hidden />
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

      <div className="container hero__foot">
        <Partners />
      </div>
    </section>
  );
}
