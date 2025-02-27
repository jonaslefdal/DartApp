import Page from '@/components/page'
import Section from '@/components/section'
import Input from "@/components/inputs"; 
import { useState } from 'react';

const Index = () => {
	const [players, setPlayers] = useState([""]); // Start with one player input
	const [courts, setCourts] = useState(["Court 1", "Court 2"]); // Start with two courts
	
	
	const handlePlayerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const newPlayers = [...players];
		newPlayers[index] = e.target.value;
	  
		// Auto-add a new empty field if all are filled
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
	  

		const addPlayer = () => setPlayers([...players, ""]); // Add new empty player input
		const addCourt = () => setCourts([...courts, `Court ${courts.length + 1}`]); // Auto-increment Court #

	  
	
		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			console.log("Submitted Players:", players.filter(p => p.trim() !== ""));
			console.log("Submitted Courts:", courts.filter(c => c.trim() !== ""));
		  };
		  
	
	  

	return (
	<Page>
		<Section>
			<h2 className='text-xl font-semibold text-zinc-800 dark:text-zinc-200'>
				Velg lag nå.
			</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					You love rice, and so does the rest of the world. In the crop year
					2008/2009, the milled rice production volume amounted to over{' '}
					<span className='font-medium text-zinc-900 dark:text-zinc-50'>
						448 million tons
					</span>{' '}
					worldwide.
				</p>

				<br />

				<p className='text-sm text-zinc-600 dark:text-zinc-400'>
					<a
						href='https://github.com/mvllow/next-pwa-template'
						className='underline'
					>
						Source
					</a>
				</p>
			</div>
		</Section>
		<Section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          Velg lag nå.
        </h2>
		<form onSubmit={handleSubmit} className="mt-4 space-y-6">
		{/* Player Inputs */}
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

		{/* Court Inputs */}
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
		</form>


      </Section>
	</Page>
)
}

export default Index
