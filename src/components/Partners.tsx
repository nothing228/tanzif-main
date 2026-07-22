import { useLang } from "../i18n/LangContext";
import { PARTNERS } from "../data/partners";
import "./Partners.scss";

function PartnerItems({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="partners__set" aria-hidden={duplicate || undefined}>
      {PARTNERS.map((p) => (
        <li key={`${duplicate ? "dup-" : ""}${p.file}`} className="partners__item">
          {/* above the fold — no lazy loading, they must be there on paint */}
          <img src={`/partners/${p.file}`} alt={duplicate ? "" : p.name} title={p.name} />
        </li>
      ))}
    </ul>
  );
}

/** Client logo strip, sitting where the hero stats used to be. */
export function Partners() {
  const { t } = useLang();

  return (
    <div className="partners">
      <span className="partners__label">{t.hero.partners}</span>
      <div className="partners__viewport">
        <div className="partners__track">
          <PartnerItems />
          <PartnerItems duplicate />
        </div>
      </div>
    </div>
  );
}
