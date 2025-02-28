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
  
  export const generateMatchups = (players: string[], courts: string[]): { matchups: Round[], onBreak: string[] } => {
    const shuffledPlayers = [...players.filter(p => p.trim() !== "")].sort(() => Math.random() - 0.5);
    const courtCount = courts.length;
    const matchups: Round[] = [];
    let onBreak: string[] = [];
  
    let pastPairs: string[][] = JSON.parse(localStorage.getItem("pastPairs") || "[]");
  
    for (let i = 0; i < courtCount; i++) {
      matchups.push({ court: courts[i], matches: [] });
    }
  
    for (let i = 0; i < courtCount; i++) {
      if (shuffledPlayers.length < 4) break;
  
      const team1 = getTeam(shuffledPlayers, pastPairs);
      const team2 = getTeam(shuffledPlayers, pastPairs);
  
      if (team1.length === 0 || team2.length === 0) continue;
  
      matchups[i].matches.push({ team1, team2 });
    }
  
    onBreak = [...shuffledPlayers];
  
    localStorage.setItem("matchups", JSON.stringify(matchups));
    localStorage.setItem("onBreak", JSON.stringify(onBreak));
    localStorage.setItem("pastPairs", JSON.stringify(pastPairs));
  
    return { matchups, onBreak };
  };
  