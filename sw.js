if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>a(e,i),o={module:{uri:i},exports:c,require:r};s[i]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/DartApp/_next/static/Y8qa3Xwze1qVLVg6_W2ww/_buildManifest.js",revision:"4684ac6267fcc50723741945b298fdb5"},{url:"/DartApp/_next/static/Y8qa3Xwze1qVLVg6_W2ww/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/DartApp/_next/static/chunks/814-f8032cc443494001.js",revision:"f8032cc443494001"},{url:"/DartApp/_next/static/chunks/framework-5429a50ba5373c56.js",revision:"5429a50ba5373c56"},{url:"/DartApp/_next/static/chunks/main-8edca9532c334692.js",revision:"8edca9532c334692"},{url:"/DartApp/_next/static/chunks/pages/_app-8d2952b46b8d6ca5.js",revision:"8d2952b46b8d6ca5"},{url:"/DartApp/_next/static/chunks/pages/_error-5a00309fd5f4b49e.js",revision:"5a00309fd5f4b49e"},{url:"/DartApp/_next/static/chunks/pages/index-02591eee2b901bae.js",revision:"02591eee2b901bae"},{url:"/DartApp/_next/static/chunks/pages/matchups-34de4aef338e4124.js",revision:"34de4aef338e4124"},{url:"/DartApp/_next/static/chunks/pages/story-990e2645a3ecd0c9.js",revision:"990e2645a3ecd0c9"},{url:"/DartApp/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/DartApp/_next/static/chunks/webpack-0292e65e2b34bc3a.js",revision:"0292e65e2b34bc3a"},{url:"/DartApp/_next/static/css/f9aaba6d9f6221ac.css",revision:"f9aaba6d9f6221ac"},{url:"/DartApp/images/favicon.png",revision:"bd8c7fe660cc983b056829ecb85e4e8b"},{url:"/DartApp/images/icon-192.png",revision:"2858c0676121054a901c256df4bc2666"},{url:"/DartApp/images/icon-512.png",revision:"dd2976f67c63a78e6c0f71168767eab2"},{url:"/DartApp/images/icon-maskable-192.png",revision:"0b702de4b33fe8e96c1553b2f70f3ae8"},{url:"/DartApp/images/icon-maskable-512.png",revision:"0708d251b1a0316d2c06b684bf20c026"},{url:"/DartApp/manifest.json",revision:"6a9c9ff4e8c32e03a46d8330e9aa89ab"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/DartApp",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
