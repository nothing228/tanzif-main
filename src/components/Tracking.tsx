import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { SectionTag } from "./SectionTag";
import {
  CareDry,
  CareHand,
  CareWash,
  IconBag,
  IconBell,
  IconCheck,
  IconPin,
  IconSearch,
  IconShield,
} from "./icons";
import "./Tracking.scss";

/** one icon per pipeline step, parallel to t.tracking.steps */
const STEP_ICONS = [CareHand, IconSearch, CareWash, CareDry, IconShield, IconBag, IconPin, IconCheck];

/** notification channels — Telegram and SMS are on by default */
const CHANNELS = [
  { key: "telegram", label: "Telegram", on: true },
  { key: "sms", label: "SMS", on: true },
  { key: "email", label: "Email", on: false },
  { key: "push", label: "Push", on: false },
] as const;

export function Tracking() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const started = useRef(false);
  const [channels, setChannels] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CHANNELS.map((c) => [c.key, c.on])),
  );

  const toggleChannel = (key: string) =>
    setChannels((c) => ({ ...c, [key]: !c[key] }));

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
            {t.tracking.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? IconCheck;
              return (
                <li
                  key={s.label}
                  className={`tracking__step ${i < active ? "is-done" : ""} ${
                    i === active ? "is-active" : ""
                  }`}
                >
                  <span className="tracking__dot">
                    {i < active ? <IconCheck size={15} /> : <Icon size={16} />}
                  </span>
                  <span className="tracking__label">{s.label}</span>
                  {s.time && <span className="tracking__time mono">{s.time}</span>}
                  {i < t.tracking.steps.length - 1 && <span className="tracking__bar" aria-hidden />}
                </li>
              );
            })}
          </ol>

          <div className="tracking__notify">
            <span className="tracking__notify-title">
              <IconBell size={16} />
              {t.tracking.notifyTitle}
            </span>
            <div className="tracking__channels" role="group" aria-label={t.tracking.notifyTitle}>
              {CHANNELS.map((c) => {
                const on = channels[c.key];
                return (
                  <button
                    type="button"
                    key={c.key}
                    className={`tracking__channel ${on ? "is-on" : ""}`}
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggleChannel(c.key)}
                  >
                    <span className="tracking__check" aria-hidden>
                      {on && <IconCheck size={12} />}
                    </span>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
