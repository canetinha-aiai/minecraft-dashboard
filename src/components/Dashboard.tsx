
import { MinecraftIcon } from "./MinecraftIcon";
import { StatsCard } from "./StatsCard";
import { Inventory } from "./Inventory";
import { GameRules } from "./GameRules";
import { PlayerStats } from "./PlayerStats";
import { PlayerAttributes } from "./PlayerAttributes";
import { UploadArea } from "./UploadArea";
import { LanguageSelector } from "./LanguageSelector";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "../i18n";
import {
  getDifficultyName,
  getGameTypeName,
  formatMinecraftTime,
  formatLastPlayed,
  formatLastPlayedExtended,
  formatDaysPlayed,
  formatSeed,
} from "../utils/minecraftData";

interface DashboardProps {
  saveData: unknown;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
  onShowAd: () => void;
  errorMsg?: string;
}

// Smooth scroll with nav offset
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(href.replace("#", ""));
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64 - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  return (
    <a href={href} className="nav-link pixel-font" onClick={handleClick}>
      {children}
    </a>
  );
}

function WorldItem({
  icon,
  label,
  value,
  color,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  description?: string;
}) {
  return (
    <div
      className="minecraft-slot"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "2px solid #1a1a1a",
          borderTopColor: "#111",
          borderLeftColor: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          minWidth: 0,
        }}
      >
        <span
          className="world-card-label pixel-font"
          style={{
            fontSize: "0.65rem",
            color: "#ccc",
            letterSpacing: "0.5px",
            textShadow: "1px 1px 0 #000",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={label}
        >
          {label}
        </span>
        <strong
          className="world-card-value"
          style={{
            fontSize: "0.9rem",
            color: "#fff",
            textShadow: "1px 1px 0 #000",
          }}
          title={String(value)}
        >
          {value}
        </strong>
        {description && (
          <div style={{ color: "#666", fontSize: "0.8rem" }}>{description}</div>
        )}
      </div>
    </div>
  );
}

// Scroll-triggered section
function Section({ id, children }: { id: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      className="section-container"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export function Dashboard({
  saveData,
  isLoading,
  onFileSelect,
  onShowAd,
  errorMsg,
}: DashboardProps) {
  const { t } = useTranslation();
  const [hoverTooltip, setHoverTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = saveData as any;
  if (!data || !data.Player) return null;

  const player = data.Player;

  const handleMouseMove = (e: React.MouseEvent, text: string) => {
    setHoverTooltip({ x: e.clientX, y: e.clientY, text });
  };
  const health = player.Health || 20;
  const foodLevel = player.foodLevel || 20;
  const xpLevel = player.XpLevel || 0;
  const difficulty = getDifficultyName(data.Difficulty ?? 2);
  const gameMode = getGameTypeName(data.GameType ?? 0);
  const time = formatMinecraftTime(data.DayTime ?? 0);
  const daysPlayed = formatDaysPlayed(data.Time || data.DayTime || 0);
  const versionInfo = data.Version?.Name || "?";
  const worldSeed = formatSeed(data.WorldGenSettings?.seed);
  const dragonKilled =
    data.DragonFight?.DragonKilled === 1 ||
    data.DragonFight?.PreviouslyKilled === 1;
  const lastPlayed = formatLastPlayed(data.LastPlayed);
  const lastPlayedTooltip = formatLastPlayedExtended(data.LastPlayed);
  const spawnPos = data.spawn?.pos;
  const playerPos = player.Pos;

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* NAV — always first */}
      <nav className="nav-header">
        <div className="nav-links">
          <NavLink href="#sobrevivencia">
            <MinecraftIcon id="minecraft:apple" size={16} />
            <span style={{ lineHeight: 1 }}>{t("nav_survival")}</span>
          </NavLink>
          <NavLink href="#mundo">
            <MinecraftIcon id="minecraft:grass_block" size={16} />
            <span style={{ lineHeight: 1 }}>{t("nav_world")}</span>
          </NavLink>
          <NavLink href="#inventario">
            <MinecraftIcon id="minecraft:chest" size={16} />
            <span style={{ lineHeight: 1 }}>{t("nav_inventory")}</span>
          </NavLink>
          <NavLink href="#regras">
            <MinecraftIcon id="minecraft:writable_book" size={16} />
            <span style={{ lineHeight: 1 }}>{t("nav_rules")}</span>
          </NavLink>
        </div>
        <div className="nav-controls">
          <LanguageSelector />
          <UploadArea
            onFileSelect={onFileSelect}
            isLoading={isLoading}
            isCompact
          />
          <button
            className="nav-link pixel-font"
            onClick={onShowAd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(116,0,255,0.15)",
              border: "1px solid rgba(116,0,255,0.3)",
              padding: "4px 10px",
              borderRadius: "4px",
            }}
          >
            <MinecraftIcon id="minecraft:xp_bottle" size={14} />{" "}
            {t("nav_ad")}
          </button>
        </div>
      </nav>

      {/* HEADER — world name, just below nav */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", padding: "40px 20px 32px" }}
      >
        <motion.h1
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: "#ffffff",
            fontFamily: "'Minecrafter', monospace",
            letterSpacing: "2px",
            textTransform: "none",
            textShadow:
              "2px 2px 6px rgba(0,0,0,0.9), -2px -2px 6px rgba(0,0,0,0.9)",
            marginBottom: "16px",
            lineHeight: 1.1,
            position: "relative",
            zIndex: 2,
          }}
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {data.LevelName || "Minecraft Save"}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            className="info-chip"
            onMouseEnter={(e) => handleMouseMove(e, lastPlayedTooltip)}
            onMouseMove={(e) => handleMouseMove(e, lastPlayedTooltip)}
            onMouseLeave={() => setHoverTooltip(null)}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <MinecraftIcon id="minecraft:clock" size={16} />
            <span style={{ lineHeight: 1 }}>
              {t("chip_last_played")}: {lastPlayed}
            </span>
          </span>
          <span
            className="info-chip"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <MinecraftIcon id="minecraft:knowledge_book" size={16} />
            <span style={{ lineHeight: 1 }}>
              {t("chip_version")} {versionInfo}
            </span>
          </span>
          <span
            className="info-chip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: dragonKilled ? "var(--xp-green)" : "#3f3f3f",
              borderColor: dragonKilled ? "rgba(124,252,0,0.3)" : undefined,
            }}
          >
            <MinecraftIcon id="minecraft:dragon_head" size={20} />
            <span style={{ lineHeight: 1 }}>
              {t("chip_dragon_label")}:{" "}
              {dragonKilled
                ? t("chip_dragon_killed")
                : t("chip_dragon_pending")}
            </span>
          </span>
        </motion.div>
      </motion.header>

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      <div className="dashboard-content">
        <Section id="sobrevivencia">
          <div
            className="section-header"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <MinecraftIcon id="minecraft:iron_sword" size={28} />
            <h2 className="pixel-font" style={{ margin: 0, lineHeight: 1 }}>
              {t("section_survival")}
            </h2>
          </div>
          <div className="vitals-grid">
            <StatsCard
              title={t("stat_health")}
              value={`${health}/20`}
              icon={
                <MinecraftIcon id="minecraft:apple" size={32} />
              }
              highlightColor="#d32f2f"
              delay={0}
            />
            <StatsCard
              title={t("stat_hunger")}
              value={`${foodLevel}/20`}
              icon={
                <MinecraftIcon id="minecraft:cooked_beef" size={32} />
              }
              highlightColor="#795548"
              delay={0.07}
            />
            <StatsCard
              title={t("stat_xp")}
              value={xpLevel}
              icon={
                <MinecraftIcon id="minecraft:xp_bottle" size={32} />
              }
              highlightColor="#388e3c"
              delay={0.14}
            />
          </div>
          <div className="info-grid">
            <div style={{ gridColumn: "span 2" }}>
              <InfoRow
                icon={
                  <MinecraftIcon id="minecraft:command_block" size={32} />
                }
                label={t("info_game_mode")}
                value={gameMode}
              />
            </div>
            <InfoRow
              icon={
                <MinecraftIcon id="minecraft:skeleton_skull" size={32} />
              }
              label={t("info_difficulty")}
              value={difficulty}
            />
            <InfoRow
              icon={
                <MinecraftIcon id="minecraft:clock" size={32} />
              }
              label={t("info_world_time")}
              value={time}
            />
            <InfoRow
              icon={
                <MinecraftIcon id="minecraft:clock" size={32} />
              }
              label={t("info_days")}
              value={String(daysPlayed)}
            />
            {playerPos && (
              <div style={{ gridColumn: "1 / -1" }}>
                <InfoRow
                  icon={
                    <MinecraftIcon id="minecraft:map" size={32} />
                  }
                  label={t("info_position")}
                  value={`X ${Math.floor(playerPos[0])}  /  Y ${Math.floor(playerPos[1])}  /  Z ${Math.floor(playerPos[2])}`}
                />
              </div>
            )}
          </div>
        </Section>

        {/* SECTION 2 */}
        <Section id="mundo">
          <div
            className="section-header"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <MinecraftIcon id="minecraft:grass_block" size={28} />
            <h2 className="pixel-font" style={{ margin: 0, lineHeight: 1 }}>
              {t("section_world")}
            </h2>
          </div>

          <div className="world-cards-grid">
            <WorldItem
              icon={
                <MinecraftIcon id="minecraft:grass_block" size={32} />
              }
              label={t("world_seed")}
              value={worldSeed}
              color="#54a0ff"
            />
            <WorldItem
              icon={
                <MinecraftIcon id="minecraft:compass" size={32} />
              }
              label={t("world_spawn")}
              value={
                spawnPos
                  ? `X:${spawnPos[0]}  Y:${spawnPos[1]}  Z:${spawnPos[2]}`
                  : t("world_unknown")
              }
              color="#69f0ae"
            />
            <WorldItem
              icon={
                <MinecraftIcon id="minecraft:dragon_egg" size={32} />
              }
              label={t("world_dragon")}
              value={dragonKilled ? t("chip_dragon_killed") : "Ainda nao"}
              color={dragonKilled ? "var(--xp-green)" : "#ff7675"}
            />
          </div>
          <div style={{ marginTop: "28px" }}>
            <PlayerStats
              stats={data.stats}
              playerData={{
                XpTotal: player.XpTotal,
                foodSaturationLevel: player.foodSaturationLevel,
              }}
            />
          </div>
        </Section>

        {/* SECTION 3 */}
        <Section id="inventario">
          <div
            className="section-header"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <MinecraftIcon id="minecraft:chest" size={28} />
            <h2 className="pixel-font" style={{ margin: 0, lineHeight: 1 }}>
              {t("section_inventory")}
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "flex-start",
            }}
          >
            <Inventory
              items={player.Inventory || []}
              equipment={player.equipment}
              offhandItem={player.OffhandItem}
              uuid={player.UUID}
            />
            <div style={{ flex: "1 1 300px" }}>
              <PlayerAttributes
                playerData={{ ...player, hardcore: data.hardcore }}
              />
            </div>
          </div>
        </Section>

        {/* SECTION 4 */}
        <Section id="regras">
          <div
            className="section-header"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <MinecraftIcon id="minecraft:writable_book" size={28} />
            <h2 className="pixel-font" style={{ margin: 0, lineHeight: 1 }}>
              {t("section_rules")}
            </h2>
          </div>
          <GameRules rules={data.game_rules} />
        </Section>

        <footer className="dashboard-footer">
          <p className="pixel-font" style={{ fontSize: "0.75rem" }}>
            {t("footer")} &copy; 2026
          </p>
        </footer>
      </div>

      {/* Floating Minecraft Tooltip */}
      {hoverTooltip && (
        <div
          style={{
            position: "fixed",
            top: hoverTooltip.y + 14,
            left: hoverTooltip.x + 14,
            pointerEvents: "none",
            zIndex: 9999,
            backgroundColor: "rgba(16,0,16,0.95)",
            border: "2px solid #2d0a52",
            padding: "6px 12px",
            boxShadow:
              "inset 2px 2px 0 rgba(116,0,255,0.2), 4px 4px 0 rgba(0,0,0,0.6)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-modern)",
              fontSize: "12px",
              color: "#ffffff",
              display: "block",
              textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {hoverTooltip.text}
          </span>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="minecraft-slot"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          backgroundColor: "rgba(0,0,0,0.3)",
          border: "2px solid #1a1a1a",
          borderTopColor: "#111",
          borderLeftColor: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#eee",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          minWidth: 0,
        }}
      >
        <span
          className="pixel-font"
          style={{
            fontSize: "0.65rem",
            color: "#ccc",
            letterSpacing: "0.5px",
            textShadow: "1px 1px 0 #000",
          }}
          title={label}
        >
          {label}
        </span>
        <strong
          style={{
            fontSize: "0.8rem",
            color: "#fff",
            textShadow: "1px 1px 0 #000",
          }}
          title={value}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}
