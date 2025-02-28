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
    // Sjekk om appen kjører som en PWA
    setIsPWA(window.matchMedia("(display-mode: standalone)").matches);

    // Oppdag om brukeren er i Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsSafari(userAgent.includes("safari") && !userAgent.includes("chrome"));
  }, []);

  return (
    <Page>
      <Section>
        {isPWA ? (
          <div className="text-center text-green-500 text-xl">
            ✅ Du har allerede installert appen!
          </div>
        ) : isSafari ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Installer DartApp på din telefon</h2>
            <p className="text-lg mb-4">Følg disse trinnene for å installere appen:</p>
            <ol className="text-left space-y-4">
              <li>1️⃣ Åpne denne siden i Safari.</li>
              <li>2️⃣ Trykk på <span className="text-blue-500 font-bold">Del</span>-knappen (⏏️).</li>
              <li>3️⃣ Bla ned og trykk på <span className="text-blue-500 font-bold">&quot;Legg til på Hjem-skjermen&quot;</span>.</li>
              <li>4️⃣ Bekreft ved å trykke på <span className="text-green-500 font-bold">&quot;Legg til&quot;</span>.</li>
            </ol>
            
            <Image
            priority={true} // {false} | {true}
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/safari-install-guide.png`} 
            alt="Installering av appen i Safari"
            width={500}  
            height={400} 
            className="mx-auto mt-6 rounded-lg shadow-lg"
            />

            <button
              onClick={() => router.push("/")}
              className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Tilbake til appen
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xl">
            🛑 Denne guiden er kun for Safari-brukere.
          </div>
        )}
      </Section>
    </Page>
  );
};

export default InstallGuide;
