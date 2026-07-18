import { useLang } from "../i18n/LangContext";
import { AnchorLink } from "./AnchorLink";
import "./MobileCta.scss";

/** Sticky conversion bar, mobile only */
export function MobileCta() {
  const { t } = useLang();

  return (
    <div className="mobile-cta">
      <AnchorLink id="calc" className="btn btn--primary mobile-cta__main">
        {t.hero.ctaOrder}
      </AnchorLink>
      <AnchorLink id="pickup" className="btn btn--ghost mobile-cta__alt">
        {t.hero.ctaCourier}
      </AnchorLink>
    </div>
  );
}
