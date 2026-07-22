import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { AnchorLink } from "./AnchorLink";
import {
  CareDry,
  CareHand,
  IconArrowRight,
  IconBag,
  IconBell,
  IconCarpet,
  IconCoat,
  IconSuit,
} from "./icons";
import "./Personal.scss";

/** one icon per wardrobe item — a hanger-style garment cue, not the order basket */
const WARDROBE_ICONS = [IconSuit, IconBag, IconCoat];

/** "2025 · 2026 · 2026" → "2025 · 2026"; guards against a repeated year slipping in */
const uniqueYears = (years: string) =>
  [...new Set(years.split("·").map((y) => y.trim()))].join(" · ");

export function Personal() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const p = t.personal.passport;
  const w = t.personal.wardrobe;
  const r = t.personal.reminder;

  return (
    <>

        <div className="personal reveal" ref={ref}>
          {/* carpet passport */}
          <article className="personal__card personal__passport">
            <header className="personal__card-head">
              <span className="care-tag">
                <span className="care-tag__icon">
                  <IconCarpet size={17} />
                </span>
                <span className="care-tag__num">{p.tag}</span>
              </span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </header>
            <div className="personal__doc">
              <div className="personal__doc-photo" aria-hidden>
                <svg viewBox="0 0 90 120" preserveAspectRatio="xMidYMid slice">
                  <rect width="90" height="120" fill="#8c3b3b" />
                  <rect x="8" y="8" width="74" height="104" fill="none" stroke="#e8d9b8" strokeWidth="2.5" />
                  <path d="M45 26l19 19-19 19-19-19z" fill="#3f5c5a" stroke="#e8d9b8" strokeWidth="1.6" />
                  <circle cx="45" cy="45" r="5" fill="#e8d9b8" />
                  <path d="M26 78h38M26 88h38M26 98h38" stroke="#e8d9b8" strokeWidth="2" />
                </svg>
              </div>
              <dl className="personal__doc-fields">
                <div>
                  <dt>{p.size}</dt>
                  <dd className="mono">{p.sizeV}</dd>
                </div>
                <div>
                  <dt>{p.material}</dt>
                  <dd>{p.materialV}</dd>
                </div>
                <div>
                  <dt>{p.stains}</dt>
                  <dd>{p.stainsV}</dd>
                </div>
                <div>
                  <dt>{p.date}</dt>
                  <dd className="mono">{p.dateV}</dd>
                </div>
                <div>
                  <dt>{p.works}</dt>
                  <dd>{p.worksV}</dd>
                </div>
                <div>
                  <dt>{p.video}</dt>
                  <dd>▶ {p.videoV}</dd>
                </div>
              </dl>
              <span className="personal__doc-id mono">{p.id}</span>
            </div>
          </article>

          <div className="personal__col">
            {/* wardrobe */}
            <article className="personal__card">
              <header className="personal__card-head">
                <span className="care-tag">
                  <span className="care-tag__icon">
                    <CareHand size={17} />
                  </span>
                  <span className="care-tag__num">{w.tag}</span>
                </span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </header>
              <ul className="personal__wardrobe">
                {w.items.map((item, i) => {
                  const Icon = WARDROBE_ICONS[i] ?? IconSuit;
                  return (
                    <li key={item.name}>
                      <span className="personal__w-icon">
                        <Icon size={18} />
                      </span>
                      <div className="personal__w-main">
                        <strong>{item.name}</strong>
                        <span>{item.count}</span>
                      </div>
                      <span className="personal__w-years mono">{uniqueYears(item.years)}</span>
                      <AnchorLink id="calc" className="personal__w-reorder">
                        {w.reorder}
                        <IconArrowRight size={14} />
                      </AnchorLink>
                    </li>
                  );
                })}
              </ul>
            </article>

            {/* smart reminder */}
            <article className="personal__card">
              <header className="personal__card-head">
                <span className="care-tag">
                  <span className="care-tag__icon">
                    <CareDry size={17} />
                  </span>
                  <span className="care-tag__num">{r.tag}</span>
                </span>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </header>
              <div className="personal__notifs">
                <div className="personal__notif">
                  <span className="personal__notif-icon">
                    <IconBell size={17} />
                  </span>
                  <div>
                    <strong>{r.n1Title}</strong>
                    <p>{r.n1Body}</p>
                  </div>
                  <span className="personal__notif-time mono">{r.now}</span>
                </div>
                <div className="personal__notif">
                  <span className="personal__notif-icon">
                    <IconBell size={17} />
                  </span>
                  <div>
                    <strong>{r.n2Title}</strong>
                    <p>{r.n2Body}</p>
                  </div>
                  <span className="personal__notif-time mono">{r.ago}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
    </>
  );
}
