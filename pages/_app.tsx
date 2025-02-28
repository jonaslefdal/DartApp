import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css"; // Ensure this path is correct

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Ensure navigation stays inside the PWA and prevents opening Safari
    if (window.matchMedia("(display-mode: standalone)").matches) {
      document.addEventListener("click", (event) => {
        const target = event.target as HTMLAnchorElement;

        if (target.tagName === "A" && target.href.startsWith(window.location.origin)) {
          event.preventDefault();
          router.push(target.pathname);
        }
      });
    }
  }, []);
    return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );}

export default MyApp;