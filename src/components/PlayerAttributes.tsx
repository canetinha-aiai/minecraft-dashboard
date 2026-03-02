import { motion } from "framer-motion";
import { ShieldAlert, Mountain, Sparkles, Wind, BarChart3 } from "lucide-react";
import { MinecraftIcon } from "./MinecraftIcon";
import { useTranslation } from "../i18n";

interface Attribute {
  id: string;
  base: number;
}

interface PlayerData {
  Rotation?: number[];
  Score?: number;
  Dimension?: string;
  foodSaturationLevel?: number;
  abilities?: Record<string, number>;
  attributes?: Attribute[];
  hardcore?: number;
}

interface PlayerAttributesProps {
  playerData: PlayerData;
}

// Attributes to hide (useless for the dashboard)
const HIDDEN_ATTRS = new Set([
  "minecraft:movement_speed",
  "minecraft:attack_speed",
  "minecraft:entity_interaction_range",
  "minecraft:block_interaction_range",
  "minecraft:waypoint_transmit_range",
]);

interface AttrMeta {
  label: string;
  icon: React.ReactNode;
  color: string;
  max?: number;
}

export function PlayerAttributes({ playerData }: PlayerAttributesProps) {
  const { t } = useTranslation();
  if (!playerData) return null;

  const ATTR_META_TRANSLATED: Record<string, AttrMeta> = {
    max_health: {
      label: t("attr_max_health"),
      icon: <MinecraftIcon id="minecraft:apple" size={24} />,
      color: "#ff7675",
      max: 40,
    },
    attack_damage: {
      label: t("attr_attack_damage"),
      icon: <MinecraftIcon id="minecraft:iron_sword" size={24} />,
      color: "#dfe6e9",
      max: 20,
    },
    armor: {
      label: t("attr_armor"),
      icon: <MinecraftIcon id="minecraft:iron_chestplate" size={24} />,
      color: "#dfe6e9",
      max: 30,
    },
    armor_toughness: {
      label: t("attr_armor_toughness"),
      icon: <MinecraftIcon id="minecraft:diamond_chestplate" size={24} />,
      color: "#74b9ff",
      max: 20,
    },
    knockback_resistance: {
      label: t("attr_knockback"),
      icon: <Mountain size={16} />,
      color: "#74b9ff",
      max: 1,
    },
    luck: {
      label: t("attr_luck"),
      icon: <Sparkles size={16} />,
      color: "#fdcb6e",
      max: 10,
    },
    flying_speed: {
      label: t("attr_flying_speed"),
      icon: <Wind size={16} />,
      color: "#a29bfe",
      max: 1,
    },
  };

  const visibleAttributes = (playerData.attributes || []).filter(
    (attr) => !HIDDEN_ATTRS.has(attr.id),
  );

  const getAttrMeta = (id: string) => {
    const key = id.replace("minecraft:", "");
    return (
      ATTR_META_TRANSLATED[key] || {
        label: key
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        icon: <BarChart3 size={16} />,
        color: "#eee",
        max: 10,
      }
    );
  };

  const abilities = playerData.abilities || {};
  const activeAbilities = [
    { key: "invulnerable", label: t("ability_invulnerable") },
    { key: "flying", label: t("ability_flying") },
    { key: "mayfly", label: t("ability_mayfly") },
    { key: "instabuild", label: t("ability_instabuild") },
    { key: "maybuild", label: t("ability_maybuild") },
  ].filter((a) => abilities[a.key] === 1);

  if (
    activeAbilities.length === 0 &&
    visibleAttributes.length === 0 &&
    playerData.hardcore !== 1
  )
    return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      {/* Base Attributes */}
      {visibleAttributes.length > 0 && (
        <div style={{ display: "grid", gap: "10px" }}>
          {visibleAttributes.map((attr, idx) => {
            const meta = getAttrMeta(attr.id);
            const displayVal = Number.isInteger(attr.base)
              ? attr.base
              : Number(attr.base).toFixed(2);

            return (
              <div
                key={idx}
                className="minecraft-slot"
                style={{
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ color: meta.color, display: "flex" }}>
                    {meta.icon}
                  </span>
                  <span
                    style={{
                      color: "#eee",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-modern)",
                      fontWeight: 700,
                      textShadow: "1px 1px 0 #000",
                    }}
                  >
                    {meta.label}
                  </span>
                </div>
                <span
                  className="pixel-font"
                  style={{
                    color: "#fff",
                    fontSize: "0.9rem",
                    textShadow: "1px 1px 0 #000",
                  }}
                >
                  {displayVal}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Hardcore Status */}
      {playerData.hardcore === 1 && (
        <div
          className="minecraft-slot"
          style={{
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={16} color="#ff7675" />
            <span
              style={{
                color: "#ff7675",
                fontSize: "0.85rem",
                fontFamily: "var(--font-modern)",
                fontWeight: 700,
                textShadow: "1px 1px 0 #000",
              }}
            >
              {t("attr_hardcore")}
            </span>
          </div>
          <span
            className="pixel-font"
            style={{
              color: "#fff",
              fontSize: "0.9rem",
              textShadow: "1px 1px 0 #000",
            }}
          >
            ON
          </span>
        </div>
      )}

      {/* Abilities as Neutral Tags */}
      {activeAbilities.length > 0 && (
        <div style={{ marginTop: "4px" }}>
          <h4
            className="pixel-font"
            style={{ color: "#555", fontSize: "0.7rem", marginBottom: "8px" }}
          >
            {t("attr_abilities")}
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {activeAbilities.map((a, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex", // Flex for better centering
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 10px",
                  paddingTop: "6px", // Nudge for Qrafty font
                  background: "rgba(0,0,0,0.5)",
                  border: "2px solid #555",
                  color: "#ddd",
                  fontSize: "0.65rem",
                  fontFamily: "var(--font-modern)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  boxShadow:
                    "inset 2px 2px 0 rgba(0,0,0,0.4), inset -2px -2px 0 rgba(255,255,255,0.1)",
                }}
              >
                {a.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
