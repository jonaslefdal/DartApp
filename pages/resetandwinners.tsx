import Page from "@/components/page";
import Section from "@/components/section";
import { useEffect, useState } from "react";

const ResetAndWinners = () => {
  type Match = {
    team1: string[];
    team2: string[];
  };

  type Round = {
    court: string;
    matches: Match[];
  };

  const [courts, setCourts] = useState<string[]>(["Bane 1", "Bane 2", "Bane 3", "Bane 4"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to clear data
  const clearData = () => {
    const defaultCourts = ["Bane 1", "Bane 2", "Bane 3", "Bane 4"];
    setCourts(defaultCourts);
    localStorage.setItem("courts", JSON.stringify(defaultCourts));
    localStorage.setItem("sessionDate", new Date().toDateString());
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

    window.location.reload();
  };

	const [wins, setWins] = useState<{ [player: string]: number }>({});
  
	useEffect(() => {
	  const storedWins = localStorage.getItem("wins");
	  if (storedWins) {
		setWins(JSON.parse(storedWins));
	  }
	}, []);
  
  const convertToCSV = (data: { [player: string]: number }): string => {
    const rows = [
      ["Match Result Export"],
      ["Player", "Wins"],
      ...Object.entries(data)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([player, count]) => [player, count])
    ];
  
    return rows.map(row => row.join(";")).join("\n"); // Change comma to semicolon
  };
  
  
  const downloadCSV = () => {
    const csvContent = "\uFEFF" + convertToCSV(wins); // Add BOM for UTF-8 encoding
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
  
    link.setAttribute("href", url);
    link.setAttribute("download", `session_wins_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  return (
    <Page>
      <Section>
        <h2 className="text-xl text-center font-semibold">
          Denne knappen fjerner all data som hvem som har vært på lag, hvor mange pauser personer har hatt osv..
        </h2>

        {/* Reset Data Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-10 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reset Data
          </button>
        </div>

        <h2 className="text-l text-center mt-6 font-semibold">Du burde ikke trykke på denne mens en sesjon holder på</h2>

        {/* Custom Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold">Er du sikker?</h3>
              <p className="text-sm text-white-600 mt-2">
                Dette vil slette alle lag og pausehistorikk. Dette kan ikke angres.
              </p>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-white-700 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Avbryt
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => {
                    clearData();
                    setIsModalOpen(false);
                  }}
                >
                  Ja, reset data
                </button>
              </div>
            </div>
          </div>
        )}

<h1 className="text-3xl font-bold text-center mt-10 mb-6">Antall seire</h1>
        <div className="max-w-md mx-auto">
          {Object.keys(wins).length > 0 ? (
            <>
              <table className="w-full text-start text-white">
                <thead>
                  <tr>
                    <th className="border-b text-start border-gray-600 p-2">Spiller</th>
                    <th className="border-b text-start border-gray-600 p-2">Seire</th>
                  </tr>
                </thead>
                <tbody>
				{Object.entries(wins)
				.sort(([, countA], [, countB]) => countB - countA)
				.map(([player, count]) => (
					<tr key={player}>
					<td className="border-b border-gray-600 p-2">{player}</td>
					<td className="border-b border-gray-600 p-2">{count}</td>
					</tr>
				))}
                </tbody>
              </table>
              <div className="flex justify-center mt-6">
                <button
                  onClick={downloadCSV}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Eksorter som CSV
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center">Det er ingen seiersmestere enda.</p>
          )}
        </div>
	
      </Section>
    </Page>
  );
};

export default ResetAndWinners;
