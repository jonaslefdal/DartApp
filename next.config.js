const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	cacheOnFrontEndNav: true, // Ensures navigation works without full reloads
  });
  
  const isProd = process.env.NODE_ENV === "production";
  const basePath = isProd ? "/DartApp" : ""; // Define basePath BEFORE using it
  
  const nextConfig = withPWA({
	output: "export", // Enables static export for GitHub Pages
	images: {
	  unoptimized: true, // Required for GitHub Pages
	},
	basePath, // Use basePath variable
	assetPrefix: basePath, // Use basePath for assets
	reactStrictMode: true,
	trailingSlash: true, // Ensures GitHub Pages compatibility
	swcMinify: true,
	env: {
	  NEXT_PUBLIC_BASE_PATH: basePath, // Make basePath available in the client
	},
  });
  
  module.exports = nextConfig;
  