/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mc-heads.net" },
      { protocol: "https", hostname: "crafatar.com" },
      { protocol: "https", hostname: "visage.surgeplay.com" },
      { protocol: "https", hostname: "minotar.net" },
      { protocol: "https", hostname: "mcasset.cloud" },
      { protocol: "https", hostname: "minecraft.wiki" },
    ],
    minimumCacheTTL: 604800, // Cache external images for 1 week to avoid 429s
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
