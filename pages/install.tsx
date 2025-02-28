import { useEffect, useState } from "react";
import Page from "@/components/page";
import Section from "@/components/section";
import { useRouter } from "next/router";
import Image from "next/image";


const InstallGuide = () => {
  const router = useRouter();
  const [isPWA, setIsPWA] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Check if the app is running as a PWA
    setIsPWA(window.matchMedia("(display-mode: standalone)").matches);

    // Detect if the browser is Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsSafari(userAgent.includes("safari") && !userAgent.includes("chrome"));
  }, []);

  return (
    <Page>
      <Section>
        {isPWA ? (
          <div className="text-center text-green-500 text-xl">
            Du har allerede installert appen!
          </div>
        ) : isSafari ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Installer DartApp på din telefon</h2>
            <p className="text-lg mb-4">Følg disse trinnene for å sette den opp:</p>
            <ol className="text-left space-y-4">
              <li>1️⃣ Åpne denne siden i safari.</li>
              <li>2️⃣ Trykk på <span className="text-blue-500 font-bold">Dele</span> knappen (⏏️).</li>
              <li>3️⃣ Bla ned og trykk på <span className="text-blue-500 font-bold">"Legg til på hjemskjerm"</span>.</li>
              <li>4️⃣ Confirm ved å trykke <span className="text-green-500 font-bold">"Legg til"</span>.</li>
            </ol>
            <Image
            src="/images/safari-install-guide.png"
            alt="Install Guide"
            width={500}  // Adjust size as needed
            height={400} // Adjust size as needed
            className="mx-auto mt-6 rounded-lg shadow-lg"
            />

            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Back to App
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xl">
            This guide is only for Safari users.
          </div>
        )}
      </Section>
    </Page>
  );
};

export default InstallGuide;
