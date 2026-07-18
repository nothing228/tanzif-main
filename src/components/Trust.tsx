import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SpotlightCard } from "./SpotlightCard";
import { IconCamera, IconLeaf, IconShield, IconUmbrella } from "./icons";
import "./Trust.scss";

const ICONS = [IconShield, IconUmbrella, IconLeaf, IconCamera];

export function Trust() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();

  return (
    <>
      <div className="trust reveal" ref={ref}>
        {t.trust.items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <SpotlightCard
              key={item.name}
              as="article"
              className="trust__item"
              spotlightColor="rgba(201, 162, 84, 0.45)"
            >
              <span className="trust__icon">
                <Icon size={22} />
              </span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </SpotlightCard>
          );
        })}
      </div>
    </>
  );
}
