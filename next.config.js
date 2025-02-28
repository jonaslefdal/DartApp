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
	basePath: isProd ? "/DartApp" : "", // Only use basePath in production
	assetPrefix: isProd ? "/DartApp/" : "",
	reactStrictMode: true,
	trailingSlash: true, // Ensures URLs work properly on GitHub Pages
});

module.exports = nextConfig;
