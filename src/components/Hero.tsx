import { useLang } from "../i18n/LangContext";
import { AnchorLink } from "./AnchorLink";
import { IconStar } from "./icons";
import "./Hero.scss";

export function Hero() {
  const { t } = useLang();

  const stats = [
    { value: t.hero.statOrdersValue, label: t.hero.statOrders, stars: false },
    { value: "", label: t.hero.statRating, stars: true },
    { value: t.hero.statReturnValue, label: t.hero.statReturn, stars: false },
    { value: t.hero.statExpValue, label: t.hero.statExp, stars: false },
  ];

  return (
    <section className="hero" id="top">
      <div className="hero__pattern" aria-hidden />

      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">{t.hero.title}</h1>
          <p className="hero__sub">{t.hero.sub}</p>
          <div className="hero__ctas">
            <AnchorLink id="calc" className="btn btn--primary">
              {t.hero.ctaOrder}
            </AnchorLink>
          </div>
        </div>
      </div>

      <div className="container hero__foot">
        <dl className="hero__stats">
          {stats.map((s) => (
            <div key={s.label} className="hero__stat">
              <dt className="hero__stat-value mono">
                {s.stars ? (
                  <span className="hero__stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStar key={i} size={20} />
                    ))}
                  </span>
                ) : (
                  s.value
                )}
              </dt>
              <dd className="hero__stat-label">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
