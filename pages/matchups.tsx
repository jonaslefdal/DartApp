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

  useEffect(() => {
    setPlayers(JSON.parse(localStorage.getItem("players") || "[]"));
    setCourts(JSON.parse(localStorage.getItem("courts") || "[]"));
    setRounds(JSON.parse(localStorage.getItem("matchups") || "[]"));
    setOnBreak(JSON.parse(localStorage.getItem("onBreak") || "[]"));
  }, []);

  const regenerateTeams = () => {
    if (players.length < 4) {
      alert("Not enough players to generate teams.");
      return;
    }
    const { matchups, onBreak } = generateMatchups(players, courts);
    setRounds(matchups);
    setOnBreak(onBreak);
  };

  return (
    <Page>
      <Section>
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
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Tilbake til personer
          </button>
        </div>
      </Section>
    </Page>
  );
};

export default Matchups;
