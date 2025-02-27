/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
  });
  
  const nextConfig = withPWA({
	output: "export", // Enables static export
	images: {
	  unoptimized: true, // Required for GitHub Pages
	},
	basePath: process.env.NODE_ENV === "production" ? "/DartApp" : "", // Only use basePath in production
	assetPrefix: process.env.NODE_ENV === "production" ? "/DartApp/" : "",
	reactStrictMode: true,
  });
  
  module.exports = nextConfig;
  