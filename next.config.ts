import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only the ward icon (public/chapel-icon.svg) is served as SVG, and it
    // ships with the app rather than coming from user input, so the usual
    // SVG/XSS risk next/image guards against doesn't apply here.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
