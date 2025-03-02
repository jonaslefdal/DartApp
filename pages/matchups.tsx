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

  const [roundCount, setRoundCount] = useState<number>(0);


  useEffect(() => {
    setPlayers(JSON.parse(localStorage.getItem("players") || "[]"));
    setCourts(JSON.parse(localStorage.getItem("courts") || "[]"));
    setRounds(JSON.parse(localStorage.getItem("matchups") || "[]"));
    setOnBreak(JSON.parse(localStorage.getItem("onBreak") || "[]"));
    setPastPairs(JSON.parse(localStorage.getItem("pastPairs") || "[]"));

  // Load the roundCount from localStorage if it exists
  const storedRoundCount = localStorage.getItem("roundCount");
  if (storedRoundCount) {
    setRoundCount(parseInt(storedRoundCount, 10));
  }
}, []);

// Helper function to compute repeated pairs from pastPairs
const getRepeatedPairs = (pairs: string[][]): string[][] => {
  const counts: { [key: string]: number } = {};
  const pairMap: { [key: string]: string[] } = {};
  pairs.forEach((pair) => {
    // Sort so order doesn't matter
    const sortedPair = [...pair].sort();
    const key = sortedPair.join(" - ");
    counts[key] = (counts[key] || 0) + 1;
    pairMap[key] = sortedPair;
  });
  return Object.keys(counts)
    .filter((key) => counts[key] > 1)
    .map((key) => pairMap[key]);
};

// Compute the repeated pairs (if any)
const repeatedPairs = getRepeatedPairs(pastPairs);

  const regenerateTeams = () => {
    const newCount = roundCount + 1;
    setRoundCount(newCount);
    localStorage.setItem("roundCount", newCount.toString());

    if (players.length < 4) {
      alert("Not enough players to generate teams.");
      return;
    }
    const { matchups, onBreak } = generateMatchups(players, courts);
    setRounds(matchups);
    setOnBreak(onBreak);

    setPastPairs(JSON.parse(localStorage.getItem("pastPairs") || "[]"));

  };

  return (
    <Page>
      <Section>
                
                
{/* Persistent Banner */}
{roundCount > 6 && (
          <div className="bg-red-500 text-white p-4 rounded-md mb-4">
          <p className="text-center font-bold">
              Etter over 7 runder kan spillere bli parret med de samme lagkameratene.
            </p>
            <p className="text-center">
              Lag genereres med en metode som sjekker om to spillere har spilt sammen før.
            </p>
            {repeatedPairs.length > 0 && (
              <p className="text-center mt-2">
                Gjentatte par:{" "}
                {repeatedPairs.map((pair, index) => (
                  <span key={index}>
                    {pair.join(" og ")}
                    {index < repeatedPairs.length - 1 && ", "}
                  </span>
                ))}
              </p>
            )}
            <div className="text-center mt-2">
              <button
                onClick={() => router.push("/story")}
                className="px-4 py-2 bg-white text-red-500 font-semibold rounded-md hover:bg-red-100"
              >
                Nullstill økt
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6">Matchups</h2>

        {/* Matchups Display */}
        {rounds.length > 0 ? (
          rounds.map((round, roundIndex) => (
            <div key={roundIndex} className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
              <h3 className="text-lg font-semibold text-center text-white mb-4">
                {round.court}
              </h3>

              {round.matches.length > 0 ? (
                round.matches.map((match, matchIndex) => (
                  <div
                    key={matchIndex}
                    className="flex justify-center items-center gap-8 bg-gray-700 p-4 rounded-md shadow-md"
                  >
                    {/* Team 1 */}
                    <div className="flex flex-col items-end">
                      {match.team1.map((player, i) => (
                        <p key={i} className="text-white font-medium text-lg">
                          {player}
                        </p>
                      ))}
                    </div>

                    {/* Court Divider */}
                    <div className="text-white text-xl font-bold">⚡</div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-start">
                      {match.team2.map((player, i) => (
                        <p key={i} className="text-white font-medium text-lg">
                          {player}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No matches found for this court</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No matchups found. Go back and generate teams!</p>
        )}

        {/* Players On Break */}
        {onBreak.length > 0 && (
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg mt-6">
            <h3 className="text-lg font-semibold text-center text-red-400 mb-2">
              Spillere på pause
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {onBreak.map((player, i) => (
                <span key={i} className="px-4 py-2 bg-red-500 text-white rounded-md">
                  {player}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center">
        <button
          onClick={regenerateTeams}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Generer nytt spill
        </button>

        </div>
      </Section>
    </Page>
  );
};

export default Matchups;
