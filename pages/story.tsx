import Page from '@/components/page'
import Section from '@/components/section'
import { useState } from 'react';


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
	
	
	// Clear data function
	const clearData = () => {
		const defaultCourts = ["Bane 1", "Bane 2", "Bane 3", "Bane 4"];
		setCourts(defaultCourts);
		localStorage.setItem("courts", JSON.stringify(defaultCourts));
		localStorage.removeItem("matchups");
		localStorage.removeItem("onBreak");
		localStorage.removeItem("pastTeams");
		localStorage.removeItem("pastPairs");
		localStorage.removeItem("pastBreaks");
		localStorage.removeItem("breakCounts");
		localStorage.removeItem("roundCount");
	  };
	  

return (
<Page>
		<Section>
			<h2 className='text-xl font-semibold'>Denne knappen fjerner all data som hvem som har vært på lag, hvor mange pauser personer har hatt osv..</h2>
			<div className="flex justify-center">
			{/* Reset Data Button */}
			<button
            type="button"
            onClick={clearData}
            className="mt-10 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Reset Data
          </button>
		</div>
		<h2 className='text-l mt-6 font-semibold'>Du burde ikke trykke på denne mens en sesjon holder på</h2>

		</Section>
	</Page>
)}

export default Story
