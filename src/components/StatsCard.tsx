import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  delay?: number;
  highlightColor?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  delay = 0,
  highlightColor = "transparent",
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="minecraft-slot"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        gap: "12px",
        cursor: "default",
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
          color: highlightColor,
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
          className="pixel-font"
          style={{
            fontSize: "0.65rem",
            color: "#ccc",
            letterSpacing: "0.5px",
            textShadow: "1px 1px 0 #000",
          }}
          title={title}
        >
          {title}
        </span>
        <strong
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#fff",
            textShadow: "1px 1px 0 #000",
            margin: 0,
          }}
          title={String(value)}
        >
          {value}
        </strong>
      </div>
    </motion.div>
  );
}
