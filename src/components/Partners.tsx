import { PARTNERS } from "../data/partners";
import "./Partners.scss";

/**
 * Client logos. Desktop lays them out static across the full width; below 900px
 * the row turns into a marquee, so the duplicate set is rendered for a seamless
 * loop and hidden on desktop.
 */
export function Partners() {
  return (
    <div className="partners">
      <div className="partners__viewport">
        <ul className="partners__row">
          {PARTNERS.map((p) => (
            <li key={p.file} className="partners__item">
              {/* above the fold — no lazy loading, they must be there on paint */}
              <img src={`/partners/${p.file}`} alt={p.name} title={p.name} />
            </li>
          ))}
          {PARTNERS.map((p) => (
            <li key={`dup-${p.file}`} className="partners__item partners__item--dup" aria-hidden>
              <img src={`/partners/${p.file}`} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
