import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Replit environment
  devIndicators: {
    appIsrStatus: false,
  },
  // Ensure assets work in iframe environment
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Enable trust proxy for Replit
  experimental: {
    allowedRevalidateHeaderKeys: [],
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
