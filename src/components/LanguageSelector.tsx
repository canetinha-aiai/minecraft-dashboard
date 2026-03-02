import { useState, useRef, useEffect } from "react";
import { useTranslation, type Locale } from "../i18n";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { locale, setLocale, localeLabels, availableLocales } =
    useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="lang-btn"
        title="Change language"
      >
        <Globe size={14} />
        <span className="pixel-font" style={{ fontSize: "0.8rem" }}>
          {locale === "pt-BR" ? "PT" : "EN"}
        </span>
      </button>

      {open && (
        <div className="lang-dropdown">
          {availableLocales.map((l) => (
            <button
              key={l}
              className={`lang-option${locale === l ? " active" : ""}`}
              onClick={() => {
                setLocale(l as Locale);
                setOpen(false);
              }}
            >
              {localeLabels[l as Locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
