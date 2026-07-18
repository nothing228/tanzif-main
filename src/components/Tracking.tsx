import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SectionTag } from "./SectionTag";
import { CareDry, IconBell, IconCheck } from "./icons";
import "./Tracking.scss";

export function Tracking() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    const id = setInterval(() => {
      if (!started.current) return;
      setStep((s) => (s + 1) % (t.tracking.steps.length + 2));
    }, 1400);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, [ref, t.tracking.steps.length]);

  const active = Math.min(step, t.tracking.steps.length - 1);

  return (
    <section className="section section--dark" id="tracking">
      <div className="container">
        <div className="section-head">
          <SectionTag num="04" label={t.module} icon={<CareDry size={18} />} />
          <h2>{t.tracking.title}</h2>
          <p>{t.tracking.lead}</p>
        </div>

        <div className="tracking reveal" ref={ref}>
          <div className="tracking__head mono">
            <span>
              {t.tracking.orderNo} № A-350214 · AGBIS
            </span>
            <span className="tracking__percent">
              {Math.round(((active + 1) / t.tracking.steps.length) * 100)}%
            </span>
          </div>

          <ol className="tracking__steps">
            {t.tracking.steps.map((s, i) => (
              <li
                key={s}
                className={`tracking__step ${i < active ? "is-done" : ""} ${
                  i === active ? "is-active" : ""
                }`}
              >
                <span className="tracking__dot">
                  {i < active ? <IconCheck size={13} /> : <span className="mono">{i + 1}</span>}
                </span>
                <span className="tracking__label">{s}</span>
                {i < t.tracking.steps.length - 1 && <span className="tracking__bar" aria-hidden />}
              </li>
            ))}
          </ol>

          <p className="tracking__notify">
            <IconBell size={18} />
            {t.tracking.notify}
          </p>
        </div>
      </div>
    </section>
  );
}
