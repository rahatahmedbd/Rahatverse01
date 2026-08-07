import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
      {
        protocol: "https",
        hostname: "rahatahmedbd.github.io",
        pathname: "/**",
      },
    ],
    // Optimize for all viewports: mobile gets smaller images, desktop gets larger
    deviceSizes: [360, 390, 430, 640, 768, 1024, 1280, 1440, 1536, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 320, 384, 640, 750, 828, 1080],
    formats: ["image/avif", "image/webp"],
    // Allow SVG placeholders like gallery-blood.svg without breaking
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
