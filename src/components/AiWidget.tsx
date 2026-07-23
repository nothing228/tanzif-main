import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LangContext";
import { scrollToSection } from "./AnchorLink";
import { findItems, findStain, isGreeting } from "../data/concierge";
import { CONTACTS } from "../data/contacts";
import { IconSend } from "./icons";
import "./AiWidget.scss";

interface Msg {
  from: "user" | "ai";
  text?: string;
  rows?: { label: string; value: string }[];
  note?: string;
  /** object URL of an attached photo, shown inline */
  photo?: string;
}

const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/,/g, " ");

/** the teaser only nudges once the visitor has actually settled in */
const TEASER_DELAY = 12_000;

export function AiWidget() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dismissed = useRef(false);
  const history = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  // greeting is seeded per language, so switching locale mid-chat stays coherent
  useEffect(() => {
    setMsgs([{ from: "ai", text: t.concierge.greeting }]);
    history.current = [];
  }, [t]);

  useEffect(() => {
    if (dismissed.current) return;
    const id = window.setTimeout(() => {
      if (!dismissed.current && !open) setTeaser(true);
    }, TEASER_DELAY);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  const flatten = (m: Msg) =>
    [...(m.rows ?? []).map((r) => `${r.label}: ${r.value}`), m.text, m.note]
      .filter(Boolean)
      .join(". ");

  /** offline rule engine — used when the serverless function is unreachable */
  const buildAnswer = (question: string): Msg => {
    if (isGreeting(question)) return { from: "ai", text: t.concierge.greeting };

    const stain = findStain(question, lang);
    if (stain) {
      return {
        from: "ai",
        rows: [{ label: stain.name, value: `${stain.chance}% — ${t.concierge.stainChance}` }],
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

  const respond = async (question: string) => {
    setTyping(true);
    history.current.push({ role: "user", content: question });
    try {
      const res = await fetch("/.netlify/functions/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.current, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
      const reply = (data as { reply?: unknown })?.reply;
      if (typeof reply !== "string" || !reply.trim()) throw new Error("Malformed reply");
      history.current.push({ role: "assistant", content: reply });
      setMsgs((m) => [...m, { from: "ai", text: reply }]);
    } catch {
      const answer = buildAnswer(question);
      history.current.push({ role: "assistant", content: flatten(answer) });
      setMsgs((m) => [...m, answer]);
    } finally {
      setTyping(false);
    }
  };

  const send = () => {
    const q = input.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    respond(q);
  };

  /** quick actions that live elsewhere on the page close the panel and jump */
  const goTo = (id: string) => {
    setOpen(false);
    if (pathname !== "/") navigate("/", { state: { scrollTo: id } });
    else scrollToSection(id);
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMsgs((m) => [
      ...m,
      { from: "user", photo: url, text: t.widget.photoSent },
      { from: "ai", text: t.widget.photoReply },
    ]);
  };

  const openPanel = () => {
    dismissed.current = true;
    setTeaser(false);
    setOpen(true);
  };

  const actions = [
    { label: t.widget.qPrice, run: () => goTo("calc") },
    { label: t.widget.qCourier, run: () => goTo("pickup") },
    { label: t.widget.qOrder, run: () => goTo("tracking") },
    { label: t.widget.qPhoto, run: () => fileRef.current?.click() },
    { label: t.widget.qAsk, run: () => inputRef.current?.focus() },
  ];

  const answered = msgs.filter((m) => m.from === "ai").length > 1;

  return (
    <div className={`aiw ${open ? "is-open" : ""}`}>
      {teaser && !open && (
        <div className="aiw__teaser">
          <button className="aiw__teaser-body" onClick={openPanel}>
            {t.widget.teaser}
          </button>
          <button
            className="aiw__teaser-x"
            onClick={() => {
              dismissed.current = true;
              setTeaser(false);
            }}
            aria-label={t.widget.dismiss}
          >
            ✕
          </button>
        </div>
      )}

      {open && (
        <section className="aiw__panel" role="dialog" aria-label="TANZIF AI">
          <header className="aiw__head">
            <span className="aiw__avatar">AI</span>
            <div className="aiw__ident">
              <strong>TANZIF AI</strong>
              <span className="aiw__status">
                <i /> {t.widget.online}
              </span>
            </div>
            <button className="aiw__x" onClick={() => setOpen(false)} aria-label={t.widget.close}>
              ✕
            </button>
          </header>

          <div className="aiw__chat" ref={chatRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`aiw__msg aiw__msg--${m.from}`}>
                {m.photo && <img className="aiw__photo" src={m.photo} alt="" />}
                {m.rows && (
                  <dl className="aiw__facts">
                    {m.rows.map((r) => (
                      <div key={r.label}>
                        <dt>{r.label}</dt>
                        <dd className="mono">{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {m.text && <p>{m.text}</p>}
                {m.note && <span className="aiw__note mono">{m.note}</span>}
              </div>
            ))}

            {typing && (
              <div className="aiw__msg aiw__msg--ai">
                <span className="aiw__typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}

            {answered && (
              <a
                className="aiw__admin"
                href={CONTACTS.telegramAdmin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.concierge.admin}
              </a>
            )}
          </div>

          <div className="aiw__actions">
            {actions.map((a) => (
              <button key={a.label} onClick={a.run}>
                {a.label}
              </button>
            ))}
          </div>

          <div className="aiw__composer">
            <input
              ref={inputRef}
              type="text"
              placeholder={t.concierge.inputPh}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send} disabled={!input.trim() || typing} aria-label={t.concierge.send}>
              <IconSend size={16} />
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPhoto}
          />
        </section>
      )}

      <button
        className="aiw__fab"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? t.widget.close : t.widget.open}
        aria-expanded={open}
      >
        <span className="aiw__fab-label">AI</span>
        <span className="aiw__dot" aria-hidden />
      </button>
    </div>
  );
}
