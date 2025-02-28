const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	cacheOnFrontEndNav: true, // Ensures navigation works without full reloads
});

const isProd = process.env.NODE_ENV === "production";

const nextConfig = withPWA({
  output: "export", // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  images: {
	unoptimized: true, // Required for GitHub Pages
  },
  basePath: process.env.NODE_ENV === "production" ? "/DartApp" : "", // Only use basePath in production
  assetPrefix: process.env.NODE_ENV === "production" ? "/DartApp/" : "",
  reactStrictMode: true,
  trailingSlash: true, // Ensures GitHub Pages compatibility
});
  

module.exports = nextConfig;
