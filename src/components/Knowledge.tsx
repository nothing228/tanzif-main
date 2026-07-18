import { useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SpotlightCard } from "./SpotlightCard";
import { IconSearch } from "./icons";
import "./Knowledge.scss";

export function Knowledge() {
  const { t, lang } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <>
        <div className="knowledge reveal" ref={ref}>
          <div className="knowledge__cards">
            {t.knowledge.cards.map((c, i) => (
              <SpotlightCard
                key={c.title}
                as="article"
                className="knowledge__card"
                spotlightColor="rgba(201, 162, 84, 0.45)"
              >
                <span className="knowledge__num mono">{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </SpotlightCard>
            ))}
          </div>

          <div className="knowledge__search">
            <h3>{t.knowledge.searchTitle}</h3>
            <div className="knowledge__input">
              <IconSearch size={18} />
              <input type="text" placeholder={t.knowledge.searchPlaceholder} readOnly />
            </div>
            <div className="knowledge__chips" key={lang}>
              {t.knowledge.chips.map((chip, i) => (
                <button
                  key={chip.q}
                  className={`knowledge__chip ${picked === i ? "is-active" : ""}`}
                  onClick={() => setPicked(picked === i ? null : i)}
                >
                  {chip.q}
                </button>
              ))}
            </div>
            {picked !== null && (
              <p className="knowledge__answer">
                <strong>{t.knowledge.chips[picked].q}:</strong> {t.knowledge.chips[picked].a}
              </p>
            )}
          </div>
        </div>
    </>
  );
}
