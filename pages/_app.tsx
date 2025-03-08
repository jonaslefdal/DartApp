import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import router from "next/router";
import ReactModal from "react-modal";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const swPath = process.env.NODE_ENV === "production" ? "/DartApp/sw.js" : "/sw.js";

      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister()); // Remove old SW
      }); 

      navigator.serviceWorker
        .register(swPath)
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.error("❌ Service Worker Registration Failed:", err));
    }
    // Check if the app is already running in PWA mode
    const isPWA = window.matchMedia("(display-mode: standalone)").matches;
    if (isPWA) return;
    
    ReactModal.setAppElement('#__next');


    // Detect if the user is in Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isSafari = userAgent.includes("safari") && !userAgent.includes("chrome");

    // If in Safari and NOT a PWA, redirect to install page
    if (isSafari && router.pathname !== "/install") {
      router.replace("/install");
    }
  }, []);

  useEffect(() => {
    function setVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', setVh);
    setVh();
    return () => window.removeEventListener('resize', setVh);
  }, []);
  

  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
    <div
      className="no-scrollbar overflow-y-auto customScroll"
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <Component {...pageProps} />
    </div>
  </ThemeProvider>
  );
}
