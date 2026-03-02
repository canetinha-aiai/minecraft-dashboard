"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "../components/Dashboard";
import { UploadArea } from "../components/UploadArea";
import { AdPreview } from "../components/AdPreview";
import { parseNbtFile } from "../utils/nbtParser";

const STORAGE_KEY = "mc_dashboard_save";

function loadFromStorage(): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: unknown) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

function App() {
  const [saveData, setSaveData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showAd, setShowAd] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = loadFromStorage();
    if (data) setSaveData(data);
  }, []);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const parsed = await parseNbtFile(file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = parsed as any;
      let normalized = parsed;
      if (!p.Data && p.data) normalized = { Data: p.data };
      else if (!p.Data) normalized = { Data: parsed };
      setSaveData(normalized);
      saveToStorage(normalized);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      setErrorMsg("Erro ao processar arquivo .dat: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────
  if (!saveData) {
    return (
      <div className="empty-state-root">
        <div style={{ width: "100%", maxWidth: "760px" }}>
          <div
            style={{
              textAlign: "center",
              fontFamily: "'Minecrafter', monospace",
              fontSize: "3.5rem",
              lineHeight: 1.2,
              letterSpacing: "2px",
              textTransform: "none",
              marginBottom: "40px",
              color: "#ffffff",
              position: "relative",
              zIndex: 2,
              // Escurecimento atrás do texto para contraste igual ao UploadArea
              textShadow:
                "2px 2px 6px rgba(0,0,0,0.9), -2px -2px 6px rgba(0,0,0,0.9)",
            }}
          >
            Minecraft <span style={{ color: "#7cfc00" }}>Dashboard</span>
          </div>
          <UploadArea
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            isCompact={false}
          />
          {errorMsg && (
            <div className="error-banner" style={{ marginTop: 16 }}>
              {errorMsg}
            </div>
          )}
          {showAd && <AdPreview onClose={() => setShowAd(false)} />}
        </div>
      </div>
    );
  }

  // ── Loaded state ─────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = saveData as any;
  // Prevent rendering UI until client is mounted to avoid text differences
  if (!mounted) {
    return (
      <div className="app-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="bg-video"
          poster="/assets/bg_poster.jpg"
        >
          <source src="/assets/bg_animation.webm" type="video/webm" />
          <source src="/assets/bg_animation.mp4" type="video/mp4" />
        </video>
        <div className="content-wrapper" />
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Dashboard
        saveData={data.Data || data}
        isLoading={isLoading}
        onFileSelect={handleFileSelect}
        onShowAd={() => setShowAd(true)}
        errorMsg={errorMsg}
      />
      {showAd && <AdPreview onClose={() => setShowAd(false)} />}
    </div>
  );
}

export default App;
