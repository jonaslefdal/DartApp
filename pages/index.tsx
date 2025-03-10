import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import Page from "@/components/page";
import Section from "@/components/section";
import Input from "@/components/inputs";
import { useRouter } from "next/router";
import { generateMatchups } from "@/utils/teamGenerator";
import ReactModal from 'react-modal'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';


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

  // Manual input state for players
  const [players, setPlayers] = useState<string[]>([""]);
  const [courts, setCourts] = useState<string[]>([
    "Bane 1",
    "Bane 2",
    "Bane 3",
    "Bane 4",
  ]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Whether to show the predefined names panel
  const [showDefaultNames, setShowDefaultNames] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [matchWinners, setMatchWinners] = useState<{ [key: string]: "left" | "right" }>({});



  // Hardcoded list of over 60 names
// Replace your existing defaultNames array with these names:
const defaultNames = [
  "Adrian Vevatne",
  "Andreas Klausen",
  "Ane Hernæs",
  "Benjamin Baxter",
  "Charlotte Boe",
  "Eline Furuseth",
  "Ella Espe",
  "Emilie Fjeldheim",
  "Erik Risa",
  "Erlend Falkeid",
  "Erlend Gjesdal",
  "Even Harjo Bakke",
  "Halvard Kvinge",
  "Henrik Torgersen",
  "Ingrid Vestad",
  "Joachim Lambine",
  "Jonas Ericsson",
  "Jonas Lefdal",
  "Julian Haarberg",
  "Kasper Borgen",
  "Katinka Westli",
  "Kristine Høgnes",
  "Lotte Dovland",
  "Mads Ancher Grøn",
  "Magnus Ytterbø",
  "Magnus Støfring",
  "Marius Winge",
  "Mats Bender Schøyen",
  "Mats Raustøl",
  "Nicklas Holm Andersen",
  "Nils Anders Kjærefjord",
  "Olav Andre Brekke",
  "Olav Zahl Nyrnes",
  "Ole Bosåen",
  "Oliver Falck Heng",
  "Philip Løvås",
  "Rikke Kampenes",
  "Selma Holme",
  "Simen Brauti",
  "Simen Tandberg",
  "Sondre Evjen",
  "Sondre Håland",
  "Stian Viken",
  "Tea Johansen",
  "Thomas Sandmo",
  "Thomas Fjermestad",
  "Tora",
  "Tobias Reitan",
  "Truls Fikseaunet",
  "Ulrikke Dietz",
  "Vegard Omnes Rike",
  "Morten Gumpen"
].sort();

  // Load data from localStorage on mount
  useEffect(() => {
    const storedPlayers = localStorage.getItem("players");
    const storedCourts = localStorage.getItem("courts");

    if (storedPlayers) setPlayers(JSON.parse(storedPlayers));
    if (storedCourts) setCourts(JSON.parse(storedCourts));

    setIsLoaded(true);
  }, []);

  // Save players and courts to localStorage when they change
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



  // Handle manual player input changes
  const handlePlayerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayers((prevPlayers) => {
      const updated = [...prevPlayers];
      updated[index] = e.target.value;

      // If the user types into the last field, add a new empty field
      if (index === updated.length - 1 && e.target.value.trim() !== "") {
        updated.push("");
      }
      return updated;
    });
  };

  const handleCourtChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newCourts = [...courts];
    newCourts[index] = e.target.value;
    setCourts(newCourts);
  };

  // Add an empty player line
  const addPlayer = () => setPlayers((prev) => [...prev, ""]);

  // Add a new court
  const addCourt = () => setCourts([...courts, `Bane ${courts.length + 1}`]);

  // Remove a court
  const deleteCourt = (index: number) => {
    const newCourts = courts.filter((_, i) => i !== index);
    setCourts(newCourts);
    localStorage.setItem("courts", JSON.stringify(newCourts));
  };

  // Remove a player from the array
  const deletePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    localStorage.setItem("players", JSON.stringify(newPlayers));
  };

  // Toggle a predefined name in/out of the players array
  const toggleDefaultName = (name: string) => {
    setPlayers((prevPlayers) => {
      let updated = [...prevPlayers];

      // Remove trailing empty field if present
      if (updated.length && !updated[updated.length - 1].trim()) {
        updated.pop();
      }

      // If the name is already in players, remove it. Otherwise, add it.
      if (updated.includes(name)) {
        updated = updated.filter((p) => p !== name);
      } else {
        updated.push(name);
      }

      // Re-add an empty field at the end for manual entry
      updated.push("");

      return updated;
    });
  };

  // Check if a name is in the players array (for button color)
  const isNameSelected = (name: string) => {
    // ignoring trailing empty field if present
    const validPlayers = players.filter((p) => p.trim() !== "");
    return validPlayers.includes(name);
  };

  // Toggle showing/hiding the predefined names panel
  const toggleDefaultNamesPanel = () => {
    setShowDefaultNames((prev) => !prev);
  };

  // 1. Define a function to remove all players
  const removeAllPlayers = () => {
  setPlayers([""]);  // Reset to just an empty input
  localStorage.setItem("players", JSON.stringify([""]));
  };

  // On submit, increment the round count and generate teams from players
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Increment round count
    const storedRoundCount = localStorage.getItem("roundCount");
    let currentRoundCount = storedRoundCount ? parseInt(storedRoundCount, 10) : 0;
    currentRoundCount += 1;
    localStorage.setItem("roundCount", currentRoundCount.toString());

     // Reset winners each time we generate new teams
     localStorage.removeItem("matchWinners");
     setMatchWinners({});

    // Filter out any empty strings from the players array
    const finalPlayers = players.filter((p) => p.trim() !== "");

    const { matchups, onBreak } = generateMatchups(finalPlayers, courts);
    router.push("/matchups");
  };

  const modalContentRef = useRef<HTMLDivElement>(null);


  // Helper function to prompt for resetting data
  useEffect(() => {
    const currentSessionDate = new Date().toDateString();
    const storedSessionDate = localStorage.getItem("sessionDate");
  
    if (storedSessionDate !== currentSessionDate) {
      setIsResetModalOpen(true); // Show the reset modal
    }
  }, []);

  const updateSessionDate = () => {
    const currentSessionDate = new Date().toDateString();
    localStorage.setItem("sessionDate", currentSessionDate);
  }
  

  const clearData = () => {
      updateSessionDate();
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
      window.location.reload();
    }

const modalRef = useRef<HTMLDivElement>(null);

const openModal = () => {
  setShowDefaultNames(true);
  if (modalRef.current) disableBodyScroll(modalRef.current, { reserveScrollBarGap: true });
  document.body.classList.add("modal-open");
};

const closeModal = () => {
  if (modalRef.current) enableBodyScroll(modalRef.current);
  setShowDefaultNames(false);
  document.body.classList.remove("modal-open");
};


  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          Velg lag nå.
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
         {/* Manual Player Input */}
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Spillere
            </h3>
            {/* Wrap the players list in a scrollable container */}
            <div className="max-h-80 no-scrollbar overflow-y-auto">
              {players.map((player, index) => (
                <div key={`spiller-${index}`} className="flex items-center space-x-2 w-full">
                  <div className="flex-1">
                    <Input
                      label={`Spiller ${index + 1}`}
                      name={`spiller${index}`}
                      value={player}
                      onChange={(e) => handlePlayerChange(index, e)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePlayer(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mt-6"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={addPlayer}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                + Ny Spiller
              </button>
              <button
                type="button"
                onClick={removeAllPlayers}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Fjern alle spillere
              </button>
            </div>
          </div>


{/* Predefined Names Panel */}
<div className="mt-4">
  <button
    type="button"
    onClick={openModal}
    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
  >
    {showDefaultNames ? "Skjul forhåndsdefinerte navn" : "Vis forhåndsdefinerte navn"}
  </button>

  {showDefaultNames && (
  <div
    id="dialog"
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 py-4 overflow-hidden touch-none"
    onClick={closeModal}
  >
    <div
      ref={modalRef}
      className="relative bg-zinc-900 rounded-lg shadow-xl p-4 w-full max-w-md max-h-[90vh] no-scrollbar overflow-y-auto overscroll-contain"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={closeModal}
        className="sticky top-2 float-right px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 z-50"
      >
        X
      </button>

      <div className="grid grid-cols-2 gap-2 mt-9">
        {defaultNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => toggleDefaultName(name)}
            className={`
              py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150
              ${isNameSelected(name)
                ? "bg-green-500 text-white shadow-md"
                : "bg-red-500 text-white shadow-md"}
              active:scale-95
              hover:brightness-110
            `}
          >
            {name}
          </button>
        ))}
      </div>



    </div>
  </div>
)}

</div>
          {/* Courts */}
          <div className="flex-row justify-center mt-4">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Courts
            </h3>
            {courts.map((court, index) => (
              <div key={`bane-${index}`} className="flex items-center space-x-2">
                <Input
                  label={`Bane ${index + 1}`}
                  name={`bane${index}`}
                  value={court}
                  onChange={(e) => handleCourtChange(index, e)}
                />
                {/* Only show delete button for the last court */}
                {index === courts.length - 1 && (
                  <button
                    type="button"
                    onClick={() => deleteCourt(index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mt-6"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addCourt}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              + Ny Bane
            </button>
          </div>

          <div className="flex justify-center mt-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="flex-center mt-4 px-5 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Generer Lag
            </button>
          </div>
        </form>

        {/* Custom Reset Prompt Modal */}
        {isResetModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold">Vil du resette data?</h3>
              <p className="text-sm text-white-600 mt-2">
                Hei, det er en dag siden sist du spilte. Vil du resette data?
              </p>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-white-700 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={() => {updateSessionDate();
                    setIsResetModalOpen(false)}}
                >
                  Avbryt
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => {
                    clearData(); // Reset data
                    setIsResetModalOpen(false); // Close modal
                  }}
                >
                  Ja, reset data
                </button>
              </div>
            </div>
          </div>
        )}

      </Section>
    </Page>
  );
};

export default Index;
