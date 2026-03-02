import { useState, useRef } from "react";
import { useTranslation, type TranslationKey } from "../i18n";

interface GameRulesProps {
  rules?: Record<string, string | number | boolean>;
}

// ── Helper to resolve translation for a rule id ──────────────
function resolveRuleDesc(
  rule: string,
  t: (k: TranslationKey) => string,
): { name: string; description: string } {
  const name = rule.replace("minecraft:", "");
  const snakeId = name
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
  let description = t(`rule_${name}` as TranslationKey);
  if (description === `rule_${name}`)
    description = t(`rule_${snakeId}` as TranslationKey);
  if (description === `rule_${snakeId}`)
    description = t("rules_main" as TranslationKey);
  return { name, description };
}

// ── Styles ──────────────────────────────────────────────────
const PANEL: React.CSSProperties = {
  backgroundColor: "#c6c6c6",
  border: "2px solid #000",
  boxShadow: "inset 3px 3px 0 #ffffff, inset -3px -3px 0 #555555",
  overflow: "hidden",
};

const SCROLL: React.CSSProperties = {
  overflow: "hidden auto",
  maxHeight: 340,
};

function isBool(v: string | number | boolean) {
  return (
    String(v) === "true" ||
    String(v) === "false" ||
    String(v) === "1" ||
    String(v) === "0"
  );
}

function isEnabled(v: string | number | boolean) {
  return String(v) === "true" || String(v) === "1";
}

// ── Toggle badge ─────────────────────────────────────────────
function RetroToggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "3px 6px",
        minWidth: 60,
        border: "2px solid #000",
        boxShadow: enabled
          ? "inset 2px 2px 0 rgba(255,255,255,0.5), inset -2px -2px 0 rgba(0,0,0,0.4)"
          : "inset 2px 2px 0 rgba(0,0,0,0.4), inset -2px -2px 0 rgba(255,255,255,0.5)",
        background: enabled ? "#4a7c2f" : "#8b8b8b",
        flexShrink: 0,
        userSelect: "none",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          background: enabled ? "#7cfc00" : "#555",
          border: "1px solid rgba(0,0,0,0.5)",
          imageRendering: "pixelated",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: "0.65rem",
          fontFamily: "var(--font-modern)",
          fontWeight: 700,
          color: enabled ? "#c8ff96" : "#ddd",
          letterSpacing: "0.5px",
          textAlign: "center",
          display: "inline-flex",
          alignItems: "center",
          paddingTop: "2px", // Nudge for Qrafty font centering
        }}
      >
        {enabled ? "ON" : "OFF"}
      </span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export function GameRules({ rules }: GameRulesProps) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  // Use ref so tooltip callbacks don't cause scroll problems via re-render during layout
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (!rules || Object.keys(rules).length === 0) return null;

  const handleMouseMove = (e: React.MouseEvent, text: string) => {
    setTooltip({ text, x: e.clientX, y: e.clientY });
  };
  const handleMouseLeave = () => setTooltip(null);

  const allRules = Object.entries(rules).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  const filtered = allRules.filter(([k]) =>
    k.toLowerCase().includes(search.toLowerCase()),
  );

  const boolRules = filtered.filter(([, v]) => isBool(v));
  const numRules = filtered.filter(([, v]) => !isBool(v));

  // Render a list of boolean rules inline (no sub-component defined inside body)
  const renderBoolList = (items: typeof boolRules) =>
    items.map(([rule, value], i) => {
      const { name, description } = resolveRuleDesc(rule, t);
      const on = isEnabled(value);
      const bg = i % 2 === 0 ? "rgba(0,0,0,0.05)" : "transparent";
      return (
        <div
          key={rule}
          onMouseMove={(e) => handleMouseMove(e, description)}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "6px 10px",
            background: bg,
            cursor: "help",
          }}
        >
          <span
            className="pixel-font"
            style={{
              color: "#3f3f3f",
              fontSize: "0.85rem",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <RetroToggle enabled={on} />
        </div>
      );
    });

  // Render numeric rules inline
  const renderNumList = (items: typeof numRules) =>
    items.map(([rule, value], i) => {
      const { name, description } = resolveRuleDesc(rule, t);
      const bg = i % 2 === 0 ? "rgba(0,0,0,0.05)" : "transparent";
      return (
        <div
          key={rule}
          onMouseMove={(e) => handleMouseMove(e, description)}
          onMouseLeave={handleMouseLeave}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "6px 10px",
            background: bg,
            cursor: "help",
          }}
        >
          <span
            className="pixel-font"
            style={{
              color: "#3f3f3f",
              fontSize: "0.85rem",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "3px 8px",
              minWidth: 60,
              fontSize: "0.65rem",
              fontFamily: "var(--font-modern)",
              fontWeight: 700,
              border: "2px solid #000",
              boxShadow:
                "inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(0,0,0,0.3)",
              background: "#8b8b8b",
              color: "#fff",
              flexShrink: 0,
              boxSizing: "border-box",
              paddingTop: "5px", // Nudge for Qrafty font centering
            }}
          >
            {String(value)}
          </span>
        </div>
      );
    });

  const SectionBar = ({ color, label }: { color: string; label: string }) => (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
    >
      <div
        style={{
          width: 3,
          height: 14,
          background: color,
          border: "1px solid #000",
        }}
      />
      <span
        className="pixel-font"
        style={{
          color: "#3f3f3f",
          fontSize: "0.85rem",
          letterSpacing: "1px",
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Search */}
      <input
        type="text"
        placeholder="FILTER RULES..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "7px 12px",
          backgroundColor: "#8b8b8b",
          border: "2px solid #000",
          boxShadow:
            "inset 2px 2px 0 rgba(0,0,0,0.4), inset -2px -2px 0 rgba(255,255,255,0.4)",
          color: "#fff",
          fontSize: "0.75rem",
          fontFamily: "var(--font-modern)",
          fontWeight: 700,
          outline: "none",
          letterSpacing: "0.5px",
        }}
      />

      {/* Boolean rules — side by side */}
      {boolRules.length > 0 && (
        <div>
          <SectionBar
            color="#4caf50"
            label={`${t("rules_main" as TranslationKey)} (${boolRules.length})`}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div style={PANEL}>
              <div style={SCROLL}>
                {renderBoolList(
                  boolRules.slice(0, Math.ceil(boolRules.length / 2)),
                )}
              </div>
            </div>
            <div style={PANEL}>
              <div style={SCROLL}>
                {renderBoolList(
                  boolRules.slice(Math.ceil(boolRules.length / 2)),
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Numeric rules */}
      {numRules.length > 0 && (
        <div>
          <SectionBar
            color="#53a6ff"
            label={`${t("rules_numeric" as TranslationKey)} (${numRules.length})`}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div style={PANEL}>
              <div style={SCROLL}>
                {renderNumList(
                  numRules.slice(0, Math.ceil(numRules.length / 2)),
                )}
              </div>
            </div>
            <div style={PANEL}>
              <div style={SCROLL}>
                {renderNumList(numRules.slice(Math.ceil(numRules.length / 2)))}
              </div>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p
          className="pixel-font"
          style={{
            color: "#3f3f3f",
            textAlign: "center",
            padding: "24px 0",
            fontSize: "0.75rem",
          }}
        >
          Nenhuma regra encontrada
        </p>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: "fixed",
            top: tooltip.y + 14,
            left: tooltip.x + 14,
            pointerEvents: "none",
            zIndex: 9999,
            background: "rgba(10,10,15,0.96)",
            border: "1px solid rgba(255,255,255,0.15)",
            padding: "8px 12px",
            borderRadius: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            maxWidth: 280,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {tooltip.text}
          </p>
        </div>
      )}
    </div>
  );
}
