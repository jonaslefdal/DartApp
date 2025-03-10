import Page from "@/components/page";
import Section from "@/components/section";
import { useEffect, useState } from "react";
import LZString from "lz-string";

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
  const [isModalCopyOpen, setIsModalCopyOpen] = useState(false);
  const [exportedData, setExportedData] = useState(""); // Holds exported text
  const [importCode, setImportCode] = useState("");
  const [showImportSuccess, setShowImportSuccess] = useState(false); // State for import success modal
  const [showCopySuccess, setShowCopySuccess] = useState(false); // State for import success modal
  const [showImportFail, setShowImportFail] = useState<{ show: boolean; message: string }>({ show: false, message: "" });


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


 // Function to export and compress localStorage data
 const exportLocalStorage = () => {
  const jsonData = JSON.stringify(localStorage);
  const compressedData = LZString.compressToBase64(jsonData);
  setExportedData(compressedData); // Store in state to display in modal
  setIsModalCopyOpen(true); // Open modal with data
};

// Function to copy export data to clipboard
const copyToClipboard = () => {
  navigator.clipboard.writeText(exportedData).then(() => {
    setIsModalCopyOpen(false);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000); 
  });
};

const importLocalStorage = () => {
  try {
    if (!importCode.trim()) {
      setShowImportFail({ show: true, message: "Ingen kode skrevet" });
      setTimeout(() => setShowImportFail({ show: false, message: "" }), 2000);
      return;
    }
    const decompressedData = LZString.decompressFromBase64(importCode);
    const data = JSON.parse(decompressedData);
    for (let key in data) {
      localStorage.setItem(key, data[key]);
    }
    setImportCode(""); 
    setShowImportSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 500); 
  } catch (error) {
    setShowImportFail({ show: true, message: "Feil ved import!" });
    setTimeout(() => setShowImportFail({ show: false, message: "" }), 2000);
  }
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
                  Eksporter som CSV
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center">Det er ingen seiersmestere enda.</p>
          )}
        </div>

        {/* Button to export all data */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={exportLocalStorage}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Del all Data
          </button>
        </div>

         {/* Export Modal */}
         {isModalCopyOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold text-white">Kopier data</h3>
              <p className="text-sm text-gray-400 mt-2">Trykk på knappen for å kopiere eksportert data.</p>

              {/* Input field to show export data */}
              <input
                type="text"
                readOnly
                value={exportedData}
                className="w-full mt-4 p-2 text-white rounded-md border border-gray-300"
              />

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-gray-300 border border-gray-500 rounded-md hover:bg-gray-700"
                  onClick={() => setIsModalCopyOpen(false)}
                >
                  Lukk
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={copyToClipboard}
                >
                  Kopier
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Import Section */}
        <div className="mt-4 w-full flex justify-center">
          <div className="flex w-full max-w-sm items-center gap-2">
            <input
              type="text"
              placeholder="Lim inn kode her..."
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              className="flex-1 min-w-0 p-2 border rounded-md text-white bg-gray-800"
            />
            <button
              onClick={importLocalStorage}
              className="flex whitespace-nowrap px-2 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Importer Data
            </button>
          </div>
        </div>

        {showImportSuccess && (
        <div 
          
        className="fixed left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white py-3 px-5 rounded-xl shadow-md flex items-center gap-2 transition-opacity duration-300 opacity-100 flex-nowrap"

        style={{ top: `calc(env(safe-area-inset-top, 0px) + 56px)` }} // 56px is an estimate for navbar height
      >
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="white" 
        className="w-5 h-5 flex-shrink-0"
        >
        <path fillRule="evenodd" d="M21.707 4.293a1 1 0 0 1 0 1.414l-12 12a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414L9 15.586 20.293 4.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
      </svg>
          <span className="whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
            Importert vellykket!
            </span>
        </div>
      )}
        {showCopySuccess && (
        <div 
          
          className="fixed left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white py-3 px-5 rounded-xl shadow-md flex items-center gap-2 transition-opacity duration-300 opacity-100 flex-nowrap"

          style={{ top: `calc(env(safe-area-inset-top, 0px) + 56px)` }} // 56px is an estimate for navbar height
        >
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="white" 
          className="w-5 h-5 flex-shrink-0"
          >
          <path fillRule="evenodd" d="M21.707 4.293a1 1 0 0 1 0 1.414l-12 12a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414L9 15.586 20.293 4.293a1 1 0 0 1 1.414 0z" clipRule="evenodd" />
        </svg>
        
        <span className="whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
        Kode kopiert!</span>
        </div>  
      )}
        {showImportFail.show && (
        <div 
        className="fixed left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white py-3 px-5 rounded-xl shadow-md flex items-center gap-2 transition-opacity duration-300 opacity-100 flex-nowrap"

          style={{ top: `calc(env(safe-area-inset-top, 0px) + 56px)` }} // 56px is an estimate for navbar height
        >
          <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="white" 
      className="w-5 h-5 flex-shrink-0"
      >
        <path fillRule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L12 10.586l4.293-4.293a1 1 0 1 1 1.414 1.414L13.414 12l4.293 4.293a1 1 0 1 1-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 1 1-1.414-1.414L10.586 12 6.293 7.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
      </svg>
      
      <span className="whitespace-nowrap min-w-0 overflow-hidden text-ellipsis">
      {showImportFail.message}</span>
        </div>
      )}

        
    
  
	
      </Section>
    </Page>
  );
};

export default ResetAndWinners;
