import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { CONTACTS } from "../data/contacts";
import { CareIron, IconArrowRight, IconCheck } from "./icons";
import "./Business.scss";

export function Business() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const b = t.business;
  const [seg, setSeg] = useState(0);
  const active = b.segments[seg];

  return (
    <div className="business reveal" ref={ref}>
      <span className="care-tag">
        <span className="care-tag__icon">
          <CareIron size={17} />
        </span>
        <span className="care-tag__num">{b.tag}</span>
      </span>

      {/* headline numbers */}
      <dl className="business__kpi">
        {b.kpi.map((k) => (
          <div key={k.label}>
            <dt className="mono">{k.value}</dt>
            <dd>{k.label}</dd>
          </div>
        ))}
      </dl>

      <h3 className="business__h">{b.benefitsTitle}</h3>
      <ul className="business__benefits">
        {b.benefits.map((x) => (
          <li key={x}>
            <IconCheck size={15} />
            {x}
          </li>
        ))}
      </ul>

      {/* industry picker — the panel below swaps with it */}
      <h3 className="business__h">{b.segmentsTitle}</h3>
      <div className="business__tabs" role="tablist">
        {b.segments.map((s, i) => (
          <button
            key={s.name}
            role="tab"
            aria-selected={seg === i}
            className={seg === i ? "is-active" : ""}
            onClick={() => setSeg(i)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="business__panel" key={active.name}>
        <div>
          <h4>{b.servicesLabel}</h4>
          <ul>
            {active.services.map((s) => (
              <li key={s}>
                <IconCheck size={14} />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>{b.perksLabel}</h4>
          <ul>
            {active.perks.map((p) => (
              <li key={p}>
                <IconCheck size={14} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* onboarding path */}
      <h3 className="business__h">{b.stepsTitle}</h3>
      <ol className="business__steps">
        {b.steps.map((s, i) => (
          <li key={s}>
            <span className="business__step-num mono">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <a
        className="btn btn--primary business__cta"
        href={CONTACTS.telegramAdmin}
        target="_blank"
        rel="noopener noreferrer"
      >
        {b.cta}
        <IconArrowRight size={18} />
      </a>
    </div>
  );
}
