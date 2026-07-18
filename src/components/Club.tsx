import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { CareWash, IconCheck } from "./icons";
import { Logo } from "./Logo";
import "./Club.scss";

const TIER_CLASS = ["gold", "platinum", "black"] as const;

export function Club() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const l = t.club.loyalty;
  const m = t.club.membership;

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
            <ul className="club__perks">
              {l.perks.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}</strong>
                  <span>{p.desc}</span>
                </li>
              ))}
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
