import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SpotlightCard } from "./SpotlightCard";
import { CareIron, IconCheck } from "./icons";
import "./Business.scss";

export function Business() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const c = t.business.corp;

  return (
    <>

        <div className="business reveal" ref={ref}>
          <SpotlightCard
            as="article"
            className="business__card business__card--corp"
            spotlightColor="rgba(201, 162, 84, 0.3)"
          >
            <span className="care-tag">
              <span className="care-tag__icon">
                <CareIron size={17} />
              </span>
              <span className="care-tag__num">{c.tag}</span>
            </span>
            <h3>{c.title}</h3>
            <p className="business__desc">{c.desc}</p>

            <div className="business__clients">
              {c.clients.map((cl) => (
                <span key={cl} className="business__client">
                  {cl}
                </span>
              ))}
            </div>

            <ul className="business__features">
              {c.features.map((feat) => (
                <li key={feat}>
                  <IconCheck size={15} />
                  {feat}
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </div>
    </>
  );
}
