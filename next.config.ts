import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization - allow Cloudinary domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
    ],
  },

  // Experimental features
  experimental: {
    // typedRoutes: true, // Enable when i18n is set up
  },
};

export default nextConfig;
