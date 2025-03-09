import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Page from "@/components/page";
import Section from "@/components/section";
import { generateMatchups } from "@/utils/teamGenerator";

type Match = {
  team1: string[];
  team2: string[];
};

type Round = {
  court: string;
  matches: Match[];
};

const Matchups = () => {
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [onBreak, setOnBreak] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [courts, setCourts] = useState<string[]>([]);
  const [pastPairs, setPastPairs] = useState<string[][]>([]);
  const [matchWinners, setMatchWinners] = useState<{ [key: string]: "left" | "right" }>({});
  const [roundCount, setRoundCount] = useState<number>(0);
  const [wins, setWins] = useState<{ [player: string]: number }>({});

  // Load stored data (including wins) on mount
  useEffect(() => {
    setPlayers(JSON.parse(localStorage.getItem("players") || "[]"));
    setCourts(JSON.parse(localStorage.getItem("courts") || "[]"));
    setRounds(JSON.parse(localStorage.getItem("matchups") || "[]"));
    setOnBreak(JSON.parse(localStorage.getItem("onBreak") || "[]"));
    setPastPairs(JSON.parse(localStorage.getItem("pastPairs") || "[]"));

    const storedWinners = localStorage.getItem("matchWinners");
    if (storedWinners) {
      setMatchWinners(JSON.parse(storedWinners));
    }

    const storedRoundCount = localStorage.getItem("roundCount");
    if (storedRoundCount) {
      setRoundCount(parseInt(storedRoundCount, 10));
    }

    const storedWins = localStorage.getItem("wins");
    if (storedWins) {
      setWins(JSON.parse(storedWins));
    }
  }, []);

  useEffect(() => {
    checkAndPromptReset();
  }, []);

  // Helper function to prompt for resetting data
  function checkAndPromptReset() {
    const currentSessionDate = new Date().toDateString();
    const storedSessionDate = localStorage.getItem("sessionDate");

    if (storedSessionDate !== currentSessionDate) {
      // Mobile-friendly prompt
      const shouldReset = window.confirm(
        "Hei, det er en dag siden sist du spillte, vil du resette data?"
      );

      if (shouldReset) {
        localStorage.setItem("courts", JSON.stringify(["Bane 1", "Bane 2", "Bane 3", "Bane 4"]));
        localStorage.removeItem("matchups");
        localStorage.removeItem("onBreak");
        localStorage.removeItem("pastTeams");
        localStorage.removeItem("pastPairs");
        localStorage.removeItem("lastRoundPlayers");
        localStorage.removeItem("pastBreaks");
        localStorage.removeItem("breakCounts");
        localStorage.removeItem("roundCount");
        localStorage.removeItem("currentCount");
        localStorage.removeItem("matchWinners");
        localStorage.removeItem("wins");
        console.log("Pairing data has been reset.");
      }
      // In either case, update the session date to current
      localStorage.setItem("sessionDate", currentSessionDate);
    }
  }

  // Helper to compute repeated pairs
  const getRepeatedPairs = (pairs: string[][]): string[][] => {
    const counts: { [key: string]: number } = {};
    const pairMap: { [key: string]: string[] } = {};
    pairs.forEach((pair) => {
      const sortedPair = [...pair].sort();
      const key = sortedPair.join(" - ");
      counts[key] = (counts[key] || 0) + 1;
      pairMap[key] = sortedPair;
    });
    return Object.keys(counts)
      .filter((key) => counts[key] > 1)
      .map((key) => pairMap[key]);
  };

  const repeatedPairs = getRepeatedPairs(pastPairs);

  // Updated handler to track individual wins
  const handleWin = (roundIndex: number, matchIndex: number, side: "left" | "right") => {
    const matchKey = `${roundIndex}-${matchIndex}`;
    const currentWinner = matchWinners[matchKey];

    // Copy wins so we can update it
    const updatedWins = { ...wins };

    // Find the players for each team in the match
    const currentRound = rounds[roundIndex];
    if (!currentRound) return;
    const currentMatch = currentRound.matches[matchIndex];
    if (!currentMatch) return;
    
    // Helper to update win counts for a team
    const updateTeamWins = (team: string[], delta: number) => {
      team.forEach((player) => {
        updatedWins[player] = (updatedWins[player] || 0) + delta;
        // Ensure wins don't drop below 0
        if (updatedWins[player] < 0) {
          updatedWins[player] = 0;
        }
      });
    };

    // If there is a previous winner and it's different from the new side,
    // remove wins from the previous team and add wins for the new one.
    if (currentWinner && currentWinner !== side) {
      if (currentWinner === "left") {
        updateTeamWins(currentMatch.team1, -1);
      } else if (currentWinner === "right") {
        updateTeamWins(currentMatch.team2, -1);
      }
      updateTeamWins(side === "left" ? currentMatch.team1 : currentMatch.team2, 1);
    } else if (!currentWinner) {
      // No winner yet, add wins for the selected team.
      updateTeamWins(side === "left" ? currentMatch.team1 : currentMatch.team2, 1);
    }
    // Update state and localStorage for wins
    setWins(updatedWins);
    localStorage.setItem("wins", JSON.stringify(updatedWins));

    // Finally, update matchWinners for this match
    const updatedWinners = { ...matchWinners, [matchKey]: side };
    setMatchWinners(updatedWinners);
    localStorage.setItem("matchWinners", JSON.stringify(updatedWinners));
  };

  const regenerateTeams = () => {
    const newCount = roundCount + 1;
    setRoundCount(newCount);
    localStorage.setItem("roundCount", newCount.toString());

    // Reset winners each time we generate new teams
    localStorage.removeItem("matchWinners");
    setMatchWinners({});

    if (players.length < 4) {
      alert("Not enough players to generate teams.");
      return;
    }

    const { matchups, onBreak } = generateMatchups(players, courts);
    setRounds(matchups);
    setOnBreak(onBreak);
    setPastPairs(JSON.parse(localStorage.getItem("pastPairs") || "[]"));
    // Note: wins persist across team generations until a manual reset or time-based reset.
  };

  function getCourtNumber(court?: string): number {
    if (!court) return 0; // If it's undefined or empty, return 0
    const match = court.match(/\d+/); 
    return match ? parseInt(match[0], 10) : 0;
  }
  

  return (
    <Page>
      <Section>
        {/* Center the entire content and limit max width */}
        <div className="max-w-md mx-auto space-y-6 no-scrollbar overflow-y-auto">
          {roundCount > 9 && (
            <div className="bg-red-500 text-white p-4 rounded-md">
              <p className="text-center font-bold">
                Hei! Du har spilt over 10 runder. Er det på tide å resette?
              </p>
              <div className="text-center mt-2">
                <button
                  onClick={() => router.push("/resetandwinners")}
                  className="px-4 py-2 bg-white text-red-500 font-semibold rounded-md hover:bg-red-100"
                >
                  Nullstill økt
                </button>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-center">Matchups</h2>

          {rounds.length > 0 ? (
            rounds
              .slice()
              .sort((a, b) => getCourtNumber(a.court) - getCourtNumber(b.court))
              .map((round, roundIndex) => (
                <div
                  key={roundIndex}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4"
                >
                  <h3 className="text-xl font-semibold text-center text-white">
                    {round.court}
                  </h3>

                  {round.matches.length > 0 ? (
                    round.matches.map((match, matchIndex) => {
                      const matchKey = `${roundIndex}-${matchIndex}`;
                      return (
                        <div
                          key={matchIndex}
                          className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-gray-700 p-4 rounded-md shadow-md"
                        >
                          {/* Left side (Team 1) */}
                          <div
                            onClick={() => handleWin(roundIndex, matchIndex, "left")}
                            className={`flex flex-col items-center w-full sm:w-1/2 cursor-pointer
                              rounded-md transition-colors duration-300 p-2
                              ${matchWinners[matchKey] === "left" ? "bg-green-700" : "bg-gray-800"}
                            `}
                          >
                            {match.team1.map((player, i) => (
                              <p
                                key={i}
                                className="text-white font-medium md:text-base lg:text-sm text-center w-full sm:max-w-full whitespace-normal break-normal"
                              >
                                {player} 
                              </p>
                            ))}
                          </div>

                          <div className="text-white text-3xl font-bold flex items-center justify-center -mt-3 -mb-2">
                            🎯
                          </div>

                          {/* Right side (Team 2) */}
                          <div
                            onClick={() => handleWin(roundIndex, matchIndex, "right")}
                            className={`flex flex-col items-center w-full sm:w-1/2 cursor-pointer
                              rounded-md transition-colors duration-300 p-2
                              ${matchWinners[matchKey] === "right" ? "bg-green-700" : "bg-gray-800"}
                            `}
                          >
                            {match.team2.map((player, i) => (
                              <p
                                key={i}
                                className="text-white font-medium md:text-base lg:text-sm text-center w-full sm:max-w-full whitespace-normal break-normal"
                              >
                                {player}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-center">
                      No matches found for this court
                    </p>
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-400 text-center">
              No matchups found. Go back and generate teams!
            </p>
          )}

          <h2 className="text-2xl font-bold text-center">På pause</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {onBreak.map((player, i) => (
              <span
                key={i}
                className="py-2 px-2 flex items-center justify-center bg-red-500 text-white font-medium text-sm rounded-md shadow-md text-center whitespace-normal break-normal"
              >
                {player}
              </span>
            ))}
          </div>

          {/* Generate New Teams Button */}
          <div className="flex justify-center">
            <button
              onClick={regenerateTeams}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Generer nytt spill
            </button>
          </div>
        </div>
      </Section>
    </Page>
  );
};

export default Matchups;
