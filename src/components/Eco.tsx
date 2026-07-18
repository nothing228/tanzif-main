import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { useCountUp } from "../hooks/useCountUp";
import "./Eco.scss";

function EcoStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: v } = useCountUp(value);
  const shown =
    value % 1 !== 0
      ? v.toFixed(1).replace(".", ",")
      : Math.round(v).toLocaleString("ru-RU").replace(/,/g, " ");

  return (
    <div className="eco__stat">
      <span className="eco__value mono" ref={ref}>
        {shown}
        <small>{suffix}</small>
      </span>
      <span className="eco__label">{label}</span>
    </div>
  );
}

export function Eco() {
  const { t, lang } = useLang();
  const ref = useReveal<HTMLDivElement>();

  return (
    <>
      <div className="eco reveal" ref={ref} key={lang}>
          <span className="eco__month mono">{t.eco.month}</span>
          <div className="eco__grid">
            {t.eco.stats.map((s) => (
              <EcoStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
      </div>
    </>
  );
}
