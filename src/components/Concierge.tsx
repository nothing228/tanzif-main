import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/LangContext";
import { useReveal } from "../hooks/useReveal";
import { useAuthGate } from "./AuthGate";
import { findItems, findStain, isGreeting } from "../data/concierge";
import { IconSend } from "./icons";
import "./Concierge.scss";

interface Msg {
  from: "user" | "ai";
  text?: string;
  rows?: { label: string; value: string }[];
  note?: string;
}

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ");

export function Concierge() {
  const { t, lang } = useLang();
  const ref = useReveal<HTMLDivElement>();
  const { guard, gate } = useAuthGate();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  // greeting appears when the section scrolls into view; refresh on language change
  useEffect(() => {
    setMsgs([{ from: "ai", text: t.concierge.greeting }]);
    greeted.current = true;
  }, [t]);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  const respond = (question: string) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, buildAnswer(question)]);
    }, 900);
  };

  const buildAnswer = (question: string): Msg => {
    if (isGreeting(question)) {
      return { from: "ai", text: t.concierge.greeting };
    }
    const stain = findStain(question, lang);
    if (stain) {
      return {
        from: "ai",
        rows: [
          { label: stain.name, value: `${stain.chance}% — ${t.concierge.stainChance}` },
        ],
        text: stain.advice,
        note: t.concierge.readyIn,
      };
    }
    const items = findItems(question);
    if (items.length) {
      return {
        from: "ai",
        rows: items.map((i) => ({
          label: i.name,
          value: i.price > 0 ? `${fmt(i.price)} soʻm / ${i.unit}` : t.price.individual,
        })),
        note: `${t.concierge.readyIn} · ${t.concierge.seePrices}`,
      };
    }
    return { from: "ai", text: t.concierge.fallback };
  };

  const send = () => {
    const q = input.trim();
    if (!q || typing) return;
    guard(() => {
      setMsgs((m) => [...m, { from: "user", text: q }]);
      setInput("");
      respond(q);
    });
  };

  return (
    <>

        <div className="concierge reveal" ref={ref}>
          <div className="concierge__phone">
            <div className="concierge__head">
              <span className="concierge__avatar">AI</span>
              <div>
                <strong>TANZIF AI</strong>
                <span className="concierge__status">
                  <i /> online
                </span>
              </div>
            </div>

            <div className="concierge__chat" ref={chatRef}>
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`concierge__msg concierge__msg--${m.from === "user" ? "user" : "ai"}`}
                >
                  {m.rows && (
                    <dl className="concierge__facts">
                      {m.rows.map((r) => (
                        <div key={r.label}>
                          <dt>{r.label}</dt>
                          <dd className="mono">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {m.text && <p>{m.text}</p>}
                  {m.note && <span className="concierge__note mono">{m.note}</span>}
                </div>
              ))}

              {typing && (
                <div className="concierge__msg concierge__msg--ai concierge__msg--typing">
                  <span className="concierge__typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  {t.concierge.typing}
                </div>
              )}
            </div>

            <div className="concierge__composer">
              <input
                type="text"
                placeholder={t.concierge.inputPh}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <button
                className="concierge__send"
                onClick={send}
                aria-label={t.concierge.send}
                title={t.concierge.send}
                disabled={!input.trim() || typing}
              >
                <IconSend size={17} />
              </button>
            </div>
          </div>
        </div>
      {gate}
    </>
  );
}
