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

    ReactModal.setAppElement('#__next');

    // Detect if the user is in Safari (for redirect)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isSafari = userAgent.includes("safari") && !userAgent.includes("chrome");

    const checkStandalone = () => {
      const isPWA = window.matchMedia("(display-mode: standalone)").matches;

      if (isPWA || isSafari === false || router.pathname === "/install") return;

      router.replace("/install");
    };

    checkStandalone();
  }, []);

  // Separate Effect: Dynamically handle safe-area and viewport height
  useEffect(() => {
    const setVhAndSafeArea = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // Dynamically always set safe-area (regardless of PWA)
      const bottomInset = getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty(
        '--bottom-offset',
        bottomInset || '0px'
      );
    };

    // Initial run
    setVhAndSafeArea();

    // Run on resize and PWA standalone state change
    window.addEventListener('resize', setVhAndSafeArea);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', setVhAndSafeArea);

    // Cleanup listeners
    return () => {
      window.removeEventListener('resize', setVhAndSafeArea);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', setVhAndSafeArea);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
      <div className="no-scrollbar overflow-y-auto full-height customScroll">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
