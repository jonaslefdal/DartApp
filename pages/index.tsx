import { useState, useEffect } from "react";
import Page from "@/components/page";
import Section from "@/components/section";
import Input from "@/components/inputs";
import { useRouter } from "next/router";

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
const [courts, setCourts] = useState<string[]>(["Court 1", "Court 2"]);
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
  const addCourt = () => setCourts([...courts, `Court ${courts.length + 1}`]);

  // Clear data function
  const clearData = () => {
    //setPlayers([""]);
    setCourts(["Court 1", "Court 2"]);
    //localStorage.removeItem("players");
    localStorage.removeItem("courts");
    localStorage.removeItem("matchups");
    localStorage.removeItem("onBreak");
    localStorage.removeItem("pastTeams");
    localStorage.removeItem("pastPairs");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    let shuffledPlayers = [...players.filter(p => p.trim() !== "")].sort(() => Math.random() - 0.5);
    const courtCount = courts.length;
    const matchups: Round[] = [];
    let onBreak: string[] = [];
    
    // Load or create pair history
    let pastPairs: string[][] = JSON.parse(localStorage.getItem("pastPairs") || "[]");
    let repeatedTeamLogged = false; // Flag to log the first repeated team occurrence
  
    // 1) Create courts
    for (let i = 0; i < courtCount; i++) {
      matchups.push({ court: courts[i], matches: [] });
    }
  
    // 2) Check if a pair has played together
    const hasPlayedTogether = (p1: string, p2: string) => {
      return pastPairs.some(pair => pair.includes(p1) && pair.includes(p2));
    };
  
    // 3) Get a team (2 players), try to avoid repeats.
    // If unable to find a unique team after max attempts, allow repeats.
    const getTeam = (allowRepeats = false): string[] => {
      if (shuffledPlayers.length < 2) return [];
      let attempts = 0;
      const maxAttempts = shuffledPlayers.length * 2;
      while (attempts < maxAttempts) {
        const player1 = shuffledPlayers.pop()!;
        const player2 = shuffledPlayers.pop()!;
        if (allowRepeats || !hasPlayedTogether(player1, player2)) {
          pastPairs.push([player1, player2]); // store new pair
          return [player1, player2];
        } else {
          // Put them back and try again
          shuffledPlayers.unshift(player2, player1);
        }
        attempts++;
      }
      // If we couldn't find a unique pair, allow repeats
      const p1 = shuffledPlayers.pop()!;
      const p2 = shuffledPlayers.pop()!;
      if (!repeatedTeamLogged) {
        console.warn("First matchup with an already played team encountered.");
        repeatedTeamLogged = true;
      }
      pastPairs.push([p1, p2]);
      return [p1, p2];
    };
  
    // 4) Assign players to each court (one round)
    for (let i = 0; i < courtCount; i++) {
      if (shuffledPlayers.length < 4) break;
      const team1 = getTeam(); // tries to avoid repeats
      const team2 = getTeam(); // tries to avoid repeats
      if (team1.length === 0 || team2.length === 0) {
        continue;
      }
      matchups[i].matches.push({ team1, team2 });
    }
  
    // 5) Leftover players → on break
    onBreak = [...shuffledPlayers];
  
    console.log("Generated Matchups:", matchups);
    console.log("Players on Break:", onBreak);
    console.log("Past Pairs:", pastPairs);
  
    localStorage.setItem("matchups", JSON.stringify(matchups));
    localStorage.setItem("onBreak", JSON.stringify(onBreak));
    localStorage.setItem("pastPairs", JSON.stringify(pastPairs));
  
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
                key={`player-${index}`}
                label={`Player ${index + 1}`}
                name={`player${index}`}
                value={player}
                onChange={(e) => handlePlayerChange(index, e)}
              />
            ))}
            <button
              type="button"
              onClick={addPlayer}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              + Add Player
            </button>
          </div>

          {/* Courts */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Courts</h3>
            {courts.map((court, index) => (
              <Input
                key={`court-${index}`}
                label={`Court ${index + 1}`}
                name={`court${index}`}
                value={court}
                onChange={(e) => handleCourtChange(index, e)}
              />
            ))}
            <button
              type="button"
              onClick={addCourt}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              + Add Court
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
