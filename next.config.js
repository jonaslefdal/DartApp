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
	basePath: "/DartApp", // Change this to match your GitHub repo name
	assetPrefix: "/DartApp/",
	reactStrictMode: true,
  });
  
  module.exports = nextConfig;
  