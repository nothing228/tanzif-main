import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SpotlightCard } from "./SpotlightCard";
import { IconCamera, IconLeaf, IconShield, IconUmbrella } from "./icons";
import { PAYMENTS } from "../data/payments";
import "./Trust.scss";

const ICONS = [IconShield, IconUmbrella, IconLeaf, IconCamera];

export function Trust() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();

  return (
    <div className="trust-block reveal" ref={ref}>
      <div className="trust">
        {t.trust.items.map((item, i) => {
          const Icon = ICONS[i];
          const stages = "stages" in item ? item.stages : undefined;

          return (
            <SpotlightCard
              key={item.name}
              as="article"
              className={`trust__item${stages ? " trust__item--pipeline" : ""}`}
              spotlightColor="rgba(201, 162, 84, 0.45)"
            >
              <span className="trust__icon">
                <Icon size={22} />
              </span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              {stages && (
                <ol className="trust__stages">
                  {stages.map((stage, si) => (
                    <li key={stage} className="trust__stage">
                      <span className="trust__stage-num mono">{si + 1}</span>
                      <span className="trust__stage-label">{stage}</span>
                    </li>
                  ))}
                </ol>
              )}
            </SpotlightCard>
          );
        })}
      </div>

      <div className="trust__payments">
        <span className="trust__payments-label mono">{t.trust.payments}</span>
        <ul className="trust__payments-list">
          {PAYMENTS.map((p) => (
            <li key={p.id} className={`trust__payment trust__payment--${p.id}`}>
              <img src={`/payments/${p.file}`} alt={p.name} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
