import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

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
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
