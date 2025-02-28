import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Page from "@/components/page";
import Section from "@/components/section";

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
  const [onBreak, setOnBreak] = useState<string[]>([]); // Players who didn't get assigned

  useEffect(() => {
    const storedMatchups = localStorage.getItem("matchups");
    if (storedMatchups) {
      const parsedMatchups: Round[] = JSON.parse(storedMatchups);
      setRounds(parsedMatchups);
    }

    // Get leftover players from storage
    const storedBreakPlayers = localStorage.getItem("onBreak");
    if (storedBreakPlayers) {
      setOnBreak(JSON.parse(storedBreakPlayers));
    }
  }, []);

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
              Players on Break
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
            onClick={() => router.replace("/")}
            className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Back to Team Generator
          </button>
        </div>
      </Section>
    </Page>
  );
};

export default Matchups;
