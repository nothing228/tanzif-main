import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { Sparkle } from "./icons";
import "./HowItWorks.scss";

export function HowItWorks() {
  const { t } = useLang();
  const ref = useReveal<HTMLOListElement>();

  return (
    <>
      <ol className="how reveal" ref={ref}>
        {t.how.steps.map((s, i) => (
          <li key={s.name} className="how__step">
            <span className="how__num">
              {i + 1}
              <Sparkle size={11} className="how__spark" />
            </span>
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
