import Image from "next/image";
import { motion } from "framer-motion";
import { Footprints, Sword, Trophy, TrendingUp } from "lucide-react";
import { useTranslation } from "../i18n";

interface StatItem {
  label: string;
  value: string | number;
  unit: string;
  img?: string;
}

interface PlayerStatsProps {
  stats: Record<string, Record<string, number>>;
  playerData?: { XpTotal?: number; foodSaturationLevel?: number };
}

export function PlayerStats({ stats, playerData }: PlayerStatsProps) {
  const { t } = useTranslation();
  if (!stats) return null;

  const custom = stats["minecraft:custom"] || {};
  const mined = stats["minecraft:mined"] || {};
  const crafted = stats["minecraft:crafted"] || {};

  const formatBlocks = (cm: number) =>
    Math.floor((cm || 0) / 100).toLocaleString("pt-BR");
  const formatDamage = (dmg: number) =>
    Math.floor((dmg || 0) / 10).toLocaleString("pt-BR");
  const playTimeHours = Math.floor(
    (custom["minecraft:play_time"] || 0) / 72000,
  );

  const sections = [
    {
      title: t("stats_exploration"),
      icon: <Footprints size={20} color="#81ecec" />,
      accent: "#81ecec",
      items: [
        {
          label: t("stats_walked"),
          value: formatBlocks(custom["minecraft:walk_one_cm"]),
          unit: t("unit_blocks"),
        },
        {
          label: t("stats_sprinted"),
          value: formatBlocks(custom["minecraft:sprint_one_cm"]),
          unit: t("unit_blocks"),
        },
        {
          label: t("stats_swum"),
          value: formatBlocks(custom["minecraft:swim_one_cm"]),
          unit: t("unit_blocks"),
        },
        {
          label: t("stats_flown"),
          value: formatBlocks(custom["minecraft:fly_one_cm"]),
          unit: t("unit_blocks"),
        },
        {
          label: t("stats_jumps"),
          value: (custom["minecraft:jump"] || 0).toLocaleString("pt-BR"),
          unit: t("unit_times"),
        },
      ] as StatItem[],
    },
    {
      title: t("stats_combat"),
      icon: <Sword size={20} color="#ff7675" />,
      accent: "#ff7675",
      items: [
        {
          label: t("stats_mob_kills"),
          value: (custom["minecraft:mob_kills"] || 0).toLocaleString("pt-BR"),
          unit: "",
        },
        {
          label: t("stats_deaths"),
          value: (custom["minecraft:deaths"] || 0).toLocaleString("pt-BR"),
          unit: "",
        },
        {
          label: t("stats_damage_dealt"),
          value: formatDamage(custom["minecraft:damage_dealt"]),
          unit: t("unit_hp"),
        },
        {
          label: t("stats_damage_taken"),
          value: formatDamage(custom["minecraft:damage_taken"]),
          unit: t("unit_hp"),
        },
      ] as StatItem[],
    },
    {
      title: t("stats_achievements"),
      icon: <Trophy size={20} color="#fdcb6e" />,
      accent: "#fdcb6e",
      items: [
        {
          label: t("stats_stone_mined"),
          value: (mined["minecraft:stone"] || 0).toLocaleString("pt-BR"),
          unit: t("unit_blocks"),
        },
        {
          label: t("stats_diamonds"),
          value: (mined["minecraft:diamond_ore"] || 0).toLocaleString("pt-BR"),
          unit: "",
          img: "https://minecraft.wiki/w/Special:FilePath/Diamond_Ore.png",
        },
        {
          label: t("stats_iron"),
          value: (mined["minecraft:iron_ore"] || 0).toLocaleString("pt-BR"),
          unit: t("unit_blocks"),
          img: "https://minecraft.wiki/w/Special:FilePath/Iron_Ore.png",
        },
        {
          label: t("stats_gold"),
          value: (mined["minecraft:gold_ore"] || 0).toLocaleString("pt-BR"),
          unit: t("unit_blocks"),
          img: "https://minecraft.wiki/w/Special:FilePath/Gold_Ore.png",
        },
        {
          label: t("stats_crafted"),
          value: Object.values(crafted as Record<string, number>)
            .reduce((a, b) => a + b, 0)
            .toLocaleString("pt-BR"),
          unit: "",
        },
      ] as StatItem[],
    },
    {
      title: t("stats_progress"),
      icon: <TrendingUp size={20} color="#a29bfe" />,
      accent: "#a29bfe",
      items: [
        {
          label: t("stats_play_time"),
          value: String(playTimeHours),
          unit: t("unit_hours"),
        },
        ...(playerData?.XpTotal !== undefined
          ? [
              {
                label: t("stats_xp_total"),
                value: playerData.XpTotal.toLocaleString("pt-BR"),
                unit: t("unit_xp"),
              },
            ]
          : []),
        ...(playerData?.foodSaturationLevel !== undefined
          ? [
              {
                label: t("stats_saturation"),
                value: playerData.foodSaturationLevel.toFixed(1),
                unit: "",
              },
            ]
          : []),
      ] as StatItem[],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <h3
        className="pixel-font"
        style={{
          color: "#555",
          fontSize: "1rem",
          marginBottom: "16px",
          letterSpacing: "2px",
        }}
      >
        {t("stats_title")}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            style={{
              background: "rgba(0,0,0,0.04)",
              border: `1px solid rgba(0,0,0,0.1)`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 18px",
                borderBottom: `2px solid rgba(0,0,0,0.05)`,
                background: `rgba(0,0,0,0.02)`,
              }}
            >
              {section.icon}
              <span
                className="pixel-font"
                style={{ fontSize: "1.1rem", color: "#3f3f3f" }}
              >
                {section.title}
              </span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 18px",
                    borderBottom:
                      i < section.items.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <span
                    className="pixel-font"
                    style={{
                      color: "#666",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.img && (
                      <Image height={14} width={14}
                        src={item.img}
                        alt={item.label}
                        style={{
                          width: 14,
                          height: 14,
                          imageRendering: "pixelated",
                        }}
                       />
                    )}
                    {item.label}
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.value}
                    {item.unit && (
                      <span
                        style={{
                          color: "#666",
                          fontSize: "0.85rem",
                          marginLeft: "4px",
                          fontWeight: 400,
                        }}
                      >
                        {item.unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
