import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { locales } from "./translations";
import type { Dict, LocaleKey } from "./translations";

interface LangValue {
  lang: LocaleKey;
  t: Dict;
  setLang: (l: LocaleKey) => void;
}

const LangContext = createContext<LangValue | null>(null);

const STORAGE_KEY = "tanzif-lang";

const TITLES: Record<LocaleKey, string> = {
  uz: "TANZIF — Texnologik ximchistka",
  oz: "TANZIF — Технологик химчистка",
  ru: "TANZIF — Технологичная химчистка",
};

function initialLang(): LocaleKey {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "uz" || saved === "oz" || saved === "ru") return saved;
  return "uz";
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LocaleKey>(initialLang);

  const setLang = useCallback((l: LocaleKey) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l === "ru" ? "ru" : "uz";
    document.title = TITLES[l];
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ru" ? "ru" : "uz";
    document.title = TITLES[lang];
  }, [lang]);

  const value = useMemo(
    () => ({ lang, t: locales[lang], setLang }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
