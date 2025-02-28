const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	cacheOnFrontEndNav: true,
	disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
	runtimeCaching: [
	  {
		urlPattern: /^https:\/\/jonaslefdal\.github\.io\/DartApp\/matchups\/?$/,
		handler: "NetworkFirst",
		options: {
		  cacheName: "matchups-cache",
		  expiration: {
			maxEntries: 10,
			maxAgeSeconds: 60 * 60 * 24,
		  },
		},
	  },
	  {
		urlPattern: /^https:\/\/jonaslefdal\.github\.io\/DartApp\/.*/,
		handler: "StaleWhileRevalidate",
		options: {
		  cacheName: "pages-cache",
		  expiration: {
			maxEntries: 50,
			maxAgeSeconds: 60 * 60 * 24 * 7,
		  },
		},
	  },
	],
  });
  
  const isProd = process.env.NODE_ENV === "production";
  
  const nextConfig = withPWA({
	output: "export",
	images: {
	  unoptimized: true, // Required for GitHub Pages
	},
	basePath: isProd ? "/DartApp" : "", // GitHub Pages needs "/DartApp", local dev does not
	assetPrefix: isProd ? "/DartApp/" : "",
	reactStrictMode: true,
	trailingSlash: true, // Ensures URL compatibility
  });
  
  module.exports = nextConfig;
  