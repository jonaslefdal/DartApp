import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css"; // Ensure this path is correct

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
	if (window.matchMedia("(display-mode: standalone)").matches) {
	  document.addEventListener("click", (event) => {
		let target = event.target as HTMLElement;
  
		// Traverse up in case the click was inside a nested element
		while (target && target.tagName !== "A") {
		  target = target.parentElement as HTMLElement;
		}
  
		if (target && target.tagName === "A") {
		  const link = target as HTMLAnchorElement;
		  if (link.href.startsWith(window.location.origin)) {
			event.preventDefault();
			router.push(new URL(link.href).pathname);
		  }
		}
	  });
	}
  }, [router]);
  
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