import { useEffect, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import "./Live.scss";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString("ru-RU", { hour12: false });
}

export function Live() {
  const { t } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const clock = useClock();

  return (
    <>
      <div className="live reveal" ref={ref}>
          {t.live.cams.map((cam, i) => (
            <figure key={cam} className="live__cam">
              <div className="live__screen">
                <span className="live__scanline" aria-hidden />
                <span className={`live__blob live__blob--${(i % 3) + 1}`} aria-hidden />
                <span className={`live__blob live__blob--b live__blob--${((i + 1) % 3) + 1}`} aria-hidden />
                <span className="live__rec mono">
                  <i /> {t.live.badge}
                </span>
                <span className="live__time mono">{clock}</span>
                <span className="live__id mono">CAM {String(i + 1).padStart(2, "0")}</span>
              </div>
              <figcaption>{cam}</figcaption>
            </figure>
          ))}
        </div>

      <p className="live__note mono">24/7 · {t.live.always}</p>
    </>
  );
}
