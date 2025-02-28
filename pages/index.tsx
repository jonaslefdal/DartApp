import { useState, useEffect } from "react";
import Page from "@/components/page";
import Section from "@/components/section";
import Input from "@/components/inputs";
import { useRouter } from "next/router";
import { generateMatchups } from "@/utils/teamGenerator";


const Index = () => {
	const router = useRouter();


  type Match = {
    team1: string[];
    team2: string[];
  };
  type Round = {
    court: string;
    matches: Match[];
  };
  
const [players, setPlayers] = useState<string[]>([""]); // Default state
const [courts, setCourts] = useState<string[]>(["Bane 1", "Bane 2"]);
const [isLoaded, setIsLoaded] = useState(false); // Track if data is loaded

// ✅ Load data from localStorage AFTER the component mounts (Client-side only)
useEffect(() => {
  const storedPlayers = localStorage.getItem("players");
  const storedCourts = localStorage.getItem("courts");

  if (storedPlayers) setPlayers(JSON.parse(storedPlayers));
  if (storedCourts) setCourts(JSON.parse(storedCourts));

  setIsLoaded(true); // Mark that we have loaded data
}, []);

// ✅ Save to localStorage when players or courts change
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("players", JSON.stringify(players));
  }
}, [players, isLoaded]);

useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("courts", JSON.stringify(courts));
  }
}, [courts, isLoaded]);

  // Handle input changes
  const handlePlayerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayers = [...players];
    newPlayers[index] = e.target.value;

    if (index === players.length - 1 && e.target.value.trim() !== "") {
      newPlayers.push("");
    }

    setPlayers(newPlayers);
  };

  const handleCourtChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newCourts = [...courts];
    newCourts[index] = e.target.value;
    setCourts(newCourts);
  };

  // Manually add players & courts
  const addPlayer = () => setPlayers([...players, ""]);
  const addCourt = () => setCourts([...courts, `Bane ${courts.length + 1}`]);
  const removeCourt = () => setCourts([...courts, `Bane ${courts.length - 1 }`]);

  // Clear data function
  const clearData = () => {
    //setPlayers([""]);
    setCourts(["Bane 1", "Bane 2"]);
    //localStorage.removeItem("players");
    localStorage.removeItem("courts");
    localStorage.removeItem("matchups");
    localStorage.removeItem("onBreak");
    localStorage.removeItem("pastTeams");
    localStorage.removeItem("pastPairs");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { matchups, onBreak } = generateMatchups(players, courts);
    router.push("/matchups");
  };
  
  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          Velg lag nå.
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Players */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Players</h3>
            {players.map((player, index) => (
              <Input
                key={`spiller-${index}`}
                label={`Spiller ${index + 1}`}
                name={`spiller${index}`}
                value={player}
                onChange={(e) => handlePlayerChange(index, e)}
              />
            ))}
            <button
              type="button"
              onClick={addPlayer}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              + Ny Spiller
            </button>
          </div>

          {/* Courts */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Courts</h3>
            {courts.map((court, index) => (
              <Input
                key={`bane-${index}`}
                label={`Bane ${index + 1}`}
                name={`bane${index}`}
                value={court}
                onChange={(e) => handleCourtChange(index, e)}
              />
            ))}
            <button
              type="button"
              onClick={addCourt}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              + Ny Bane
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Submit
          </button>

          {/* Reset Data Button */}
          <button
            type="button"
            onClick={clearData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reset Data
          </button>
        </form>
      </Section>
    </Page>
  );
};

export default Index;
