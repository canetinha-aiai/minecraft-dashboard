import { motion } from "framer-motion";
import { UploadCloud, FileJson } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "../i18n";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  isCompact?: boolean;
}

export function UploadArea({
  onFileSelect,
  isLoading,
  isCompact = false,
}: UploadAreaProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={isCompact ? "nav-upload-btn" : "glass-card"}
      style={{
        padding: isCompact ? "4px 8px" : "clamp(20px, 5vw, 40px)",
        textAlign: "center",
        border: isCompact
          ? "1px solid var(--border-color)"
          : `2px dashed ${isDragging ? "var(--accent-glow)" : "var(--border-color)"}`,
        backgroundColor: isDragging
          ? "rgba(155, 89, 182, 0.1)"
          : isCompact
            ? "transparent"
            : "var(--bg-card)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: isCompact ? "6px" : "clamp(8px, 2vw, 16px)",
        minHeight: isCompact ? "32px" : "clamp(150px, 20vh, 250px)",
        width: isCompact ? "auto" : "100%",
        maxWidth: isCompact ? "none" : "800px",
        flexWrap: isCompact ? "nowrap" : "wrap",
        flexShrink: isCompact ? 1 : undefined,
        borderRadius: "4px",
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById("nbt-upload")?.click()}
    >
      <input
        id="nbt-upload"
        type="file"
        accept=".dat"
        style={{ display: "none" }}
        onChange={handleChange}
      />

      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FileJson size={isCompact ? 14 : 48} color="var(--accent-purple)" />
        </motion.div>
      ) : (
        <UploadCloud
          size={isCompact ? 14 : 48}
          color={isDragging ? "var(--accent-glow)" : "var(--text-muted)"}
        />
      )}

      {(!isCompact || !isLoading) && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="pixel-font"
            style={{
              fontSize: isCompact ? "0.75rem" : "clamp(1.2rem, 4vw, 1.8rem)",
              color: isCompact ? "#fff" : "var(--text-main)",
              margin: 0,
            }}
          >
            {isLoading
              ? t("upload_loading")
              : isCompact
                ? t("nav_load")
                : t("upload_drop")}
          </span>
          {!isCompact && (
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
              {t("upload_click")}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
