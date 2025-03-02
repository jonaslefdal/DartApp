export type Match = {
  team1: string[];
  team2: string[];
};

export type Round = {
  court: string;
  matches: Match[];
};

const hasPlayedTogether = (p1: string, p2: string, pastPairs: string[][]) => {
  return pastPairs.some(pair => pair.includes(p1) && pair.includes(p2));
};

const getTeam = (shuffledPlayers: string[], pastPairs: string[][], allowRepeats = false): string[] => {
  if (shuffledPlayers.length < 2) return [];

  let bestPair: string[] | null = null;

  for (let i = 0; i < shuffledPlayers.length - 1; i++) {
    for (let j = i + 1; j < shuffledPlayers.length; j++) {
      const player1 = shuffledPlayers[i];
      const player2 = shuffledPlayers[j];

      if (!hasPlayedTogether(player1, player2, pastPairs)) {
        bestPair = [player1, player2];

        shuffledPlayers.splice(j, 1);
        shuffledPlayers.splice(i, 1);

        pastPairs.push(bestPair);
        return bestPair;
      }
    }
  }

  if (allowRepeats || !bestPair) {
    const p1 = shuffledPlayers.pop()!;
    const p2 = shuffledPlayers.pop()!;
    console.log(`⚠️ No unique pairs left. Allowing repeat: ${p1} and ${p2}`);
    pastPairs.push([p1, p2]);
    return [p1, p2];
  }

  return bestPair;
};
export const generateMatchups = (
    players: string[],
    courts: string[]
  ): { matchups: Round[]; onBreak: string[] } => {
    // Load past pairs and break counts
    let pastPairs: string[][] = JSON.parse(localStorage.getItem("pastPairs") || "[]");
    let breakCounts: { [player: string]: number } = JSON.parse(localStorage.getItem("breakCounts") || "{}");
  
    // Calculate the current maximum break count among existing players
    const currentBreakValues = Object.values(breakCounts);
    const maxBreakCount = currentBreakValues.length > 0 ? Math.max(...currentBreakValues) : 0;
  
    // Initialize break counts for any new players by setting them to the highest count
    players.forEach(player => {
      if (player.trim() !== "" && breakCounts[player] === undefined) {
        breakCounts[player] = maxBreakCount;
      }
    });
  
    // Sort players: those with higher break counts come first (priority to play)
    const sortedPlayers = players
      .filter(p => p.trim() !== "")
      .sort((a, b) => (breakCounts[b] - breakCounts[a]) || (Math.random() - 0.5));
  
    // Determine how many courts we can actually fill
    const maxCourtsWeCanFill = Math.floor(sortedPlayers.length / 4);
  
    // We only use as many courts as we can fully populate
    // (If you prefer to keep the entire courts array and show empty matches for
    //  leftover courts, you can skip the slice, but then only iterate up to maxCourtsWeCanFill below)
    const courtsToUse = courts.slice(0, maxCourtsWeCanFill);
  
    // Determine how many players are needed for those courts
    const playersNeeded = courtsToUse.length * 4;
  
    // Split players into playing (first playersNeeded) and on-break (the rest)
    const playersForPlay = sortedPlayers.slice(0, playersNeeded);
    const playersOnBreak = sortedPlayers.slice(playersNeeded);
  
    // Prepare rounds for each court we are actually using
    const matchups: Round[] = courtsToUse.map(court => ({ court, matches: [] }));
  
    // Shuffle playersForPlay and form matches
    let playingPlayers = [...playersForPlay].sort(() => Math.random() - 0.5);
  
    for (let i = 0; i < courtsToUse.length; i++) {
      // We already know we have enough players for these courts, but just to be safe:
      if (playingPlayers.length < 4) break;
  
      const team1 = getTeam(playingPlayers, pastPairs);
      const team2 = getTeam(playingPlayers, pastPairs);
  
      if (team1.length === 0 || team2.length === 0) continue;
  
      matchups[i].matches.push({ team1, team2 });
    }
  
    // Increment break counts for players on break
    playersOnBreak.forEach(player => {
      breakCounts[player] = (breakCounts[player] || 0) + 1;
    });
  
    // Save updated data to localStorage
    localStorage.setItem("matchups", JSON.stringify(matchups));
    localStorage.setItem("onBreak", JSON.stringify(playersOnBreak));
    localStorage.setItem("pastPairs", JSON.stringify(pastPairs));
    localStorage.setItem("breakCounts", JSON.stringify(breakCounts));
  
    return { matchups, onBreak: playersOnBreak };
  };
  