if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>a(e,i),o={module:{uri:i},exports:c,require:r};s[i]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/DartApp/_next/static/XPj-ueLeQLOfFBlbjTwtk/_buildManifest.js",revision:"60aceb54c593782065bb13b0ee16cfc2"},{url:"/DartApp/_next/static/XPj-ueLeQLOfFBlbjTwtk/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/DartApp/_next/static/chunks/247-549b76427246860c.js",revision:"549b76427246860c"},{url:"/DartApp/_next/static/chunks/674a26a7-c9b1395a165d0ea7.js",revision:"c9b1395a165d0ea7"},{url:"/DartApp/_next/static/chunks/framework-49c6cecf1f6d5795.js",revision:"49c6cecf1f6d5795"},{url:"/DartApp/_next/static/chunks/main-411f369a1b4d3f86.js",revision:"411f369a1b4d3f86"},{url:"/DartApp/_next/static/chunks/pages/_app-b023a6d703bbf14b.js",revision:"b023a6d703bbf14b"},{url:"/DartApp/_next/static/chunks/pages/_error-7a92967bea80186d.js",revision:"7a92967bea80186d"},{url:"/DartApp/_next/static/chunks/pages/index-ed716f183e7dfe4d.js",revision:"ed716f183e7dfe4d"},{url:"/DartApp/_next/static/chunks/pages/install-cadc33c0c43378e9.js",revision:"cadc33c0c43378e9"},{url:"/DartApp/_next/static/chunks/pages/matchups-865829c3ece53989.js",revision:"865829c3ece53989"},{url:"/DartApp/_next/static/chunks/pages/resetandwinners-9947bc24f3e8f4df.js",revision:"9947bc24f3e8f4df"},{url:"/DartApp/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/DartApp/_next/static/chunks/webpack-0292e65e2b34bc3a.js",revision:"0292e65e2b34bc3a"},{url:"/DartApp/_next/static/css/4b750a3d6e72ea66.css",revision:"4b750a3d6e72ea66"},{url:"/DartApp/images/favicon-16x16.png",revision:"9c60d2ac3026561a2848db6f501fb337"},{url:"/DartApp/images/favicon-32x32.png",revision:"55b465fb7b39cdb67879ba8c0c6c8ab4"},{url:"/DartApp/images/favicon-64x64.png",revision:"149cbde7d4b98e0033a1de1876af9913"},{url:"/DartApp/images/favicon.ico",revision:"d9f920f446f55ca306170c0b21d49e2b"},{url:"/DartApp/images/icon-192.png",revision:"3a79a60475a0afc36dcb2246cb75ce62"},{url:"/DartApp/images/icon-512.png",revision:"145d6d4cb68d734f8b38d9e5657dd716"},{url:"/DartApp/images/icon-maskable-192.png",revision:"6b1af06ebe1b56f7061d985e13387873"},{url:"/DartApp/images/icon-maskable-512.png",revision:"cebbbb542336954e51e7085df675b237"},{url:"/DartApp/images/icon-maskable-ico-512.png",revision:"b2f8196ef21731aa2f4f7f118b10fa9e"},{url:"/DartApp/images/safari-install-guide.png",revision:"27ca551165e1be777ee8f05ba07ebb7b"},{url:"/DartApp/manifest.json",revision:"0bdd1c5c9e0dd8a206b03bf8651d13ef"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/DartApp",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
