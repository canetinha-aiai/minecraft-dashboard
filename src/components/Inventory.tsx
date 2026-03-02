import Image from "next/image";
import { motion } from "framer-motion";
import {
  getItemImageUrl,
  formatItemName,
  getPlayerSkinUrls,
} from "../utils/minecraftData";
import { User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../i18n";
import { MinecraftIcon } from "./MinecraftIcon";

interface MinecraftItem {
  id: string;
  count: number;
  Slot?: number;
}

interface Equipment {
  head?: MinecraftItem | null;
  chest?: MinecraftItem | null;
  legs?: MinecraftItem | null;
  feet?: MinecraftItem | null;
  offhand?: MinecraftItem | null;
}

interface InventoryProps {
  items: MinecraftItem[];
  equipment?: Equipment | null; // preferred: named object
  armorItems?: (MinecraftItem | null)[]; // fallback: array [boots,legs,chest,helm]
  offhandItem?: MinecraftItem | null;
  uuid?: number[] | string | null; // player UUID for skin render
}

const SLOT_SIZE = 46;
const ARMOR_SLOTS = [
  { label: "Helmet", icon: "minecraft:iron_helmet", key: "head" as const },
  {
    label: "Chestplate",
    icon: "minecraft:iron_chestplate",
    key: "chest" as const,
  },
  { label: "Leggings", icon: "minecraft:iron_leggings", key: "legs" as const },
  { label: "Boots", icon: "minecraft:iron_boots", key: "feet" as const },
];

/** Dimmed empty Minecraft slot */
function EmptySlot({
  size,
  label,
  dimIcon,
}: {
  size: number;
  label?: string;
  dimIcon?: string;
}) {
  return (
    <div
      title={label}
      style={{
        width: size,
        height: size,
        backgroundColor: "#8b8b8b",
        border: "2px solid #373737",
        borderTopColor: "#373737",
        borderLeftColor: "#373737",
        borderBottomColor: "#ffffff",
        borderRightColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {dimIcon && (
        <Image
          width={32}
          height={32}
          src={getItemImageUrl(dimIcon)}
          alt={label || ""}
          style={{
            width: "65%",
            height: "65%",
            objectFit: "contain",
            imageRendering: "pixelated",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
    </div>
  );
}

/** Filled item slot */
function ItemSlot({
  item,
  size,
  onMouseMove,
  onMouseLeave,
}: {
  item: MinecraftItem;
  size: number;
  onMouseMove: (e: React.MouseEvent, item: MinecraftItem) => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        backgroundColor: "#8b8b8b",
        border: "2px solid #373737",
        borderTopColor: "#373737",
        borderLeftColor: "#373737",
        borderBottomColor: "#ffffff",
        borderRightColor: "#ffffff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
      onMouseMove={(e) => onMouseMove(e, item)}
      onMouseLeave={onMouseLeave}
    >
      <MinecraftIcon id={item.id} size={32} />
      {item.count > 1 && (
        <span
          style={{
            position: "absolute",
            bottom: "2px",
            right: "3px",
            color: "white",
            textShadow: "1px 1px 1px #000",
            fontSize: "12px",
            fontWeight: "bold",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {item.count}
        </span>
      )}
    </motion.div>
  );
}

export function Inventory({
  items,
  equipment,
  offhandItem,
  uuid,
}: InventoryProps) {
  const { t } = useTranslation();
  const skinUrls = uuid ? getPlayerSkinUrls(uuid) : [];
  const [skinIdx, setSkinIdx] = useState(0);
  const [tooltip, setTooltip] = useState<{
    name: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const slotMap = new Map<number, MinecraftItem>();
  items.forEach((item) => {
    if (item.Slot !== undefined) slotMap.set(item.Slot, item);
  });

  const handleMouseMove = (e: React.MouseEvent, item: MinecraftItem) => {
    setTooltip({
      name: formatItemName(item.id),
      count: item.count || 1,
      x: e.clientX,
      y: e.clientY,
    });
  };
  const handleMouseLeave = () => setTooltip(null);

  const renderSlot = (slotIdx: number, size = SLOT_SIZE) => {
    const item = slotMap.get(slotIdx);
    return item ? (
      <ItemSlot
        key={slotIdx}
        item={item}
        size={size}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    ) : (
      <EmptySlot key={slotIdx} size={size} />
    );
  };

  const renderArmorSlot = (meta: (typeof ARMOR_SLOTS)[0]) => {
    // prefer equipment object, fall back to armorItems array
    const item = equipment?.[meta.key] ?? null;
    return item?.id ? (
      <ItemSlot
        key={meta.key}
        item={item}
        size={SLOT_SIZE}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    ) : (
      <EmptySlot
        key={meta.key}
        size={SLOT_SIZE}
        label={meta.label}
        dimIcon={meta.icon}
      />
    );
  };

  const renderOffhand = () => {
    const item = equipment?.offhand ?? offhandItem ?? null;
    return item?.id ? (
      <ItemSlot
        item={item}
        size={SLOT_SIZE}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    ) : (
      <EmptySlot
        size={SLOT_SIZE}
        label={t("inv_offhand")}
        dimIcon="minecraft:shield"
      />
    );
  };

  // In a real Minecraft UI, a slot is about 36x36 px including borders.
  // We'll calculate tight gaps for the classic feel.
  const TIGHT_GAP = 0;

  return (
    <motion.div
      className="mc-inventory-window"
      style={{ width: "max-content" }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Top section: Armor & Player Preview ── */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "14px",
          alignItems: "flex-start",
        }}
      >
        {/* Armor column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${TIGHT_GAP}px`,
          }}
        >
          {ARMOR_SLOTS.map((meta) => renderArmorSlot(meta))}
        </div>

        {/* Player silhouette */}
        <div
          className="mc-char-preview"
          style={{
            width: SLOT_SIZE * 3, // Roughly 3 slots wide
            height: SLOT_SIZE * 4 + TIGHT_GAP * 3, // Matches armor column height exactly
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {uuid && skinUrls.length > 0 ? (
            <Image
              width={32}
              height={32}
              src={skinUrls[skinIdx]}
              alt="Player skin"
              style={{
                height: "90%",
                width: "auto",
                imageRendering: "pixelated",
                objectFit: "contain",
              }}
              onError={() => {
                if (skinIdx < skinUrls.length - 1) setSkinIdx((i) => i + 1);
              }}
            />
          ) : (
            <User size={48} color="#555" opacity={0.5} />
          )}
        </div>

        {/* Offhand slot (aligned to bottom of armor column / player box) */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-end",
            marginLeft: "24px",
          }}
        >
          {renderOffhand()}
        </div>
      </div>

      {/* ── Main 9×3 inventory ── */}
      {/* ── Main 9×3 inventory ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(9, ${SLOT_SIZE}px)`,
          gap: `${TIGHT_GAP}px`,
          width: "fit-content",
          marginBottom: "8px",
        }}
      >
        {Array.from({ length: 27 }, (_, i) => renderSlot(i + 9))}
      </div>

      {/* ── Hotbar 9×1 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(9, ${SLOT_SIZE}px)`,
          gap: `${TIGHT_GAP}px`,
          width: "fit-content",
        }}
      >
        {Array.from({ length: 9 }, (_, i) => renderSlot(i))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y + 14,
            left: tooltip.x + 14,
            pointerEvents: "none",
            zIndex: 9999,
            backgroundColor: "rgba(16,0,16,0.95)",
            border: "2px solid #2d0a52",
            padding: "6px 10px",
            borderRadius: "0px",
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
            }}
          >
            {tooltip.name}
          </span>
        </div>
      )}
    </motion.div>
  );
}
