import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { UploadArea } from "./UploadArea";
import { Dashboard } from "./Dashboard";
import saveDataJson from "../data/saveData.json";
import { useTranslation } from "../i18n";

interface AdPreviewProps {
  onClose: () => void;
}

export function AdPreview({ onClose }: AdPreviewProps) {
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s < 3 ? s + 1 : 0));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          background: "none",
          border: "2px solid #fff",
          color: "#fff",
          padding: "8px 20px",
          borderRadius: "4px",
          cursor: "pointer",
          zIndex: 10001,
        }}
        className="pixel-font"
      >
        {t("ad_close_btn")}
      </button>

      {/* Video Canvas Emulator */}
      <div
        style={{
          width: "1280px",
          height: "720px",
          backgroundColor: "#111",
          position: "relative",
          boxShadow: "0 0 100px rgba(76, 175, 80, 0.3)",
          overflow: "hidden",
          borderRadius: "8px",
          border: "8px solid #333",
        }}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.h1
                className="pixel-font"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{ fontSize: "5rem", color: "#fff", textAlign: "center" }}
              >
                Minecraft Save <br />
                <span style={{ color: "var(--accent-green)" }}>Visualizer</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ color: "#aaa", fontSize: "1.5rem", marginTop: "20px" }}
              >
                Descubra seus mundos como nunca antes
              </motion.p>
            </motion.div>
          )}

          {step >= 1 && (
            <motion.div
              key="screenshot"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "#0d141c",
                backgroundImage: "url('/stone.webp')",
                backgroundRepeat: "repeat",
                backgroundSize: "64px 64px",
              }}
            >
              {/* Overlay for stone background to match app */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(10, 15, 22, 0.72)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              <motion.div
                initial={
                  step === 1
                    ? { y: 0, scale: 0.95, opacity: 0 }
                    : { y: 0, scale: 0.95 }
                }
                animate={
                  step === 1
                    ? { y: 0, scale: 1, opacity: 1 }
                    : step === 2
                      ? { y: -800, scale: 1 }
                      : { y: -1600, scale: 1 }
                }
                transition={{ duration: 4, ease: "easeInOut" }}
                style={{
                  width: "100%",
                  padding: "0 20px",
                  position: "absolute",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {step === 1 ? (
                  <div
                    style={{
                      marginTop: "120px",
                      width: "100%",
                      maxWidth: "760px",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        fontFamily: "'Minecrafter', monospace",
                        fontSize: "4rem",
                        lineHeight: 1.1,
                        letterSpacing: "2px",
                        textTransform: "none",
                        marginBottom: "40px",
                        color: "#ffffff",
                        position: "relative",
                        zIndex: 2,
                        textShadow:
                          "2px 2px 6px rgba(0,0,0,0.9), -2px -2px 6px rgba(0,0,0,0.9)",
                      }}
                    >
                      Minecraft{" "}
                      <span style={{ color: "#7cfc00" }}>Dashboard</span>
                    </div>
                    {/* Simulated Upload Area */}
                    <div style={{ pointerEvents: "none" }}>
                      <UploadArea
                        onFileSelect={() => {}}
                        isLoading={false}
                        isCompact={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "1200px",
                      marginTop: "40px",
                      pointerEvents: "none", // Prevent interaction during ad
                    }}
                  >
                    <Dashboard
                      saveData={(saveDataJson as Record<string, unknown>).Data}
                      isLoading={false}
                      onFileSelect={() => {}}
                      onShowAd={() => {}}
                      errorMsg=""
                    />
                  </div>
                )}
              </motion.div>

              <div
                style={{
                  position: "absolute",
                  bottom: "50px",
                  left: "50px",
                  right: "50px",
                  zIndex: 10,
                }}
              >
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={step}
                  style={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    padding: "20px 40px",
                    borderRadius: "4px",
                    borderLeft: "10px solid var(--accent-green)",
                  }}
                >
                  <h2
                    className="pixel-font"
                    style={{ fontSize: "2.5rem", color: "#fff" }}
                  >
                    {step === 1
                      ? t("ad_step1_title")
                      : step === 2
                        ? t("ad_step2_title")
                        : t("ad_step3_title")}
                  </h2>
                  <p
                    style={{
                      color: "#ccc",
                      fontSize: "1.2rem",
                      marginTop: "10px",
                    }}
                  >
                    {step === 1
                      ? t("ad_step1_desc")
                      : step === 2
                        ? t("ad_step2_desc")
                        : t("ad_step3_desc")}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlays for Ad vibe */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "red",
              borderRadius: "50%",
              boxShadow: "0 0 10px red",
            }}
          />
          <span
            className="pixel-font"
            style={{ color: "#fff", fontSize: "1rem" }}
          >
            REC
          </span>
        </div>
      </div>
    </div>
  );
}
