"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import ptBR, { type TranslationKey } from "./pt-BR";
import en from "./en";

export type { TranslationKey };

// ── Types ────────────────────────────────────────────────────
export type Locale = "pt-BR" | "en";

const LOCALES: Record<Locale, typeof ptBR> = {
  "pt-BR": ptBR,
  en: en as typeof ptBR,
};

const LOCALE_LABELS: Record<Locale, string> = {
  "pt-BR": "🇧🇷 Portugues",
  en: "🇺🇸 English",
};

// ── Detect browser locale ────────────────────────────────────
function detectLocale(): Locale {
  if (typeof window === "undefined") return "pt-BR";
  const stored = localStorage.getItem("mc_locale") as Locale | null;
  if (stored && stored in LOCALES) return stored;
  const lang = navigator.language || "pt-BR";
  if (lang.startsWith("pt")) return "pt-BR";
  return "en";
}

// ── Context ──────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
  localeLabels: typeof LOCALE_LABELS;
  availableLocales: Locale[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("mc_locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return LOCALES[locale][key] ?? LOCALES["pt-BR"][key] ?? key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        localeLabels: LOCALE_LABELS,
        availableLocales: Object.keys(LOCALES) as Locale[],
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside I18nProvider");
  return ctx;
}
