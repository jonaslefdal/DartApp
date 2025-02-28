import { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css"; // Ensure this path is correct

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
	const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  
	if (isStandalone) {
	  document.addEventListener("click", (event) => {
		let target = event.target as HTMLElement;
  
		// Ensure we get the actual `<a>` element in case the click was on a child element
		while (target && target.tagName !== "A") {
		  target = target.parentElement as HTMLElement;
		}
  
		if (target && target.tagName === "A") {
		  const link = target as HTMLAnchorElement;
		  
		  // Only handle internal links
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