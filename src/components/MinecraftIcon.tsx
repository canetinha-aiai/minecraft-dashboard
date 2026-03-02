import Image from "next/image";
import { useState } from "react";
import { getItemImageUrl } from "../utils/minecraftData";

interface MinecraftIconProps {
  id: string; // The minecraft id, ex: "minecraft:apple", "grass_block"
  size?: number; // Size in pixels
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * A robust Next.js Image wrapper that automatically resolves Minecraft item URLs,
 * enforces pixelated rendering, and handles 404/429 errors from the image provider
 * gracefully by falling back to a transparent empty pixel instead of infinite loops.
 */
export function MinecraftIcon({
  id,
  size = 16,
  alt = "",
  style,
  className,
}: MinecraftIconProps) {
  const [errorStage, setErrorStage] = useState(0);

  // Fallback progression for Wikipedia:
  // stage 0: returns default capitalized wiki URL (from getItemImageUrl)
  // stage 1: returns exact lowercase ID link (handles hunger, etc)
  // stage 2: returns transparent pixel

  const transparentFallback =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  let currentSrc = transparentFallback;
  if (errorStage === 0) {
    currentSrc = getItemImageUrl(id);
  } else if (errorStage === 1) {
    const rawId = id.includes(":") ? id.split(":")[1] : id;
    currentSrc = `https://minecraft.wiki/w/Special:FilePath/${rawId}.png`;
  }

  return (
    <Image
      height={size}
      width={size}
      src={currentSrc}
      alt={alt || id}
      className={className}
      onError={() => {
        // Progress the error stage to try different wiki capitalizations
        if (errorStage < 2) setErrorStage((prev) => prev + 1);
      }}
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
        objectFit: "contain",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
