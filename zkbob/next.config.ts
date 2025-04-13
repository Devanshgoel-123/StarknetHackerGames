import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.scalebranding.com"
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com"
      },
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com"
      },
      {
        protocol: "https",
        hostname: "media-hosting.imagekit.io"
      },
      {
        protocol:"https",
        hostname:'raw.githubusercontent.com'
      },
      {
        protocol:"https",
        hostname:"assets.coingecko.com"
      }
    ],
  },
  compress: true,
  reactStrictMode: false,
  sassOptions: {
    includePaths: ['./styles'],
  },
};

export default nextConfig;