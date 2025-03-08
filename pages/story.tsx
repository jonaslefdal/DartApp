import Page from "@/components/page";
import Section from "@/components/section";
import { useState } from "react";

const Story = () => {
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
  };

  return (
    <Page>
      <Section>
        <h2 className="text-xl font-semibold">
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

        <h2 className="text-l mt-6 font-semibold">Du burde ikke trykke på denne mens en sesjon holder på</h2>

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
      </Section>
    </Page>
  );
};

export default Story;
