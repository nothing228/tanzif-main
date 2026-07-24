import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { CareWash, IconBag, IconCheck, IconGift, IconSparkTag, IconStar, IconUsers } from "./icons";
import { Logo } from "./Logo";
import "./Club.scss";

const TIER_CLASS = ["bronze", "silver", "gold"] as const;

/** one icon per loyalty perk, in the order they appear in the dictionary */
const PERK_ICONS = [IconStar, IconBag, IconSparkTag, IconGift, IconUsers];

/** the club returns 5% of every order as points; 1 point = 1 soʻm */
const RATE = 0.05;
const SPEND_STEPS = [200_000, 400_000, 600_000, 900_000, 1_400_000, 2_000_000];

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");

export function Club() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const l = t.club.loyalty;
  const m = t.club.membership;
  const [step, setStep] = useState(1);
  const spend = SPEND_STEPS[step];
  const perYear = spend * RATE * 12;

  return (
    <>

        <div className="club reveal" ref={ref}>
          {/* loyalty perks */}
          <div className="club__loyalty">
            <span className="care-tag">
              <span className="care-tag__icon">
                <CareWash size={17} />
              </span>
              <span className="care-tag__num">{l.tag}</span>
            </span>
            <h3>{l.title}</h3>

            {/* live points estimator — makes the 5% tangible */}
            <div className="club__calc">
              <span className="club__calc-label">{l.calcSpend}</span>
              <output className="club__calc-spend mono">{fmt(spend)} {t.calc.sum}</output>
              <input
                type="range"
                min={0}
                max={SPEND_STEPS.length - 1}
                step={1}
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
                aria-label={l.calcSpend}
              />
              <div className="club__calc-out">
                <div>
                  <strong className="mono">{fmt(spend * RATE)}</strong>
                  <span>{l.calcMonth}</span>
                </div>
                <div className="club__calc-year">
                  <strong className="mono">{fmt(perYear)}</strong>
                  <span>{l.calcYear}</span>
                </div>
              </div>
              <p className="club__calc-hint">{l.calcHint}</p>
            </div>

            <ul className="club__perks">
              {l.perks.map((p, i) => {
                const Icon = PERK_ICONS[i] ?? IconStar;
                return (
                  <li key={p.name}>
                    <span className="club__perk-icon">
                      <Icon size={17} />
                    </span>
                    <strong>{p.name}</strong>
                    <span>{p.desc}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* membership cards */}
          <div className="club__membership">
            <span className="care-tag">
              <span className="care-tag__icon">
                <CareWash size={17} />
              </span>
              <span className="care-tag__num">{m.tag}</span>
            </span>
            <h3>{m.title}</h3>
            <div className="club__tiers">
              {m.tiers.map((tier, i) => (
                <article key={tier.name} className={`club__tier club__tier--${TIER_CLASS[i]}`}>
                  <header>
                    <Logo size={24} mono className="club__tier-logo" />
                    <span className="club__tier-name">{tier.name}</span>
                  </header>
                  <ul>
                    {tier.perks.map((perk) => (
                      <li key={perk}>
                        <IconCheck size={13} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button className="club__tier-join mono">{m.join} →</button>
                </article>
              ))}
            </div>
          </div>
        </div>
    </>
  );
}
