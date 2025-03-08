import { useState } from "react";

export type Match = {
  team1: string[];
  team2: string[];
};

export type Round = {
  court: string;
  matches: Match[];
};

function hasPlayedTogether(
  p1: string,
  p2: string,
  pastPairs: string[][]
): boolean {
  return pastPairs.some(pair => pair.includes(p1) && pair.includes(p2));
}

function getCombinations<T>(array: T[], k: number): T[][] {
  const results: T[][] = [];

  function helper(start: number, combo: T[]) {
    if (combo.length === k) {
      results.push([...combo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combo.push(array[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }

  helper(0, []);
  return results;
}

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[r]] = [copy[r], copy[i]];
  }
  return copy;
}

/**
 * Returns the three possible pairings for 4 players,
 * but randomized in order.
 */
function getPairings<T>(four: T[]): [T, T, T, T][] {
  const pairings: [T, T, T, T][] = [
    [four[0], four[1], four[2], four[3]], // (a, b) & (c, d)
    [four[0], four[2], four[1], four[3]], // (a, c) & (b, d)
    [four[0], four[3], four[1], four[2]], // (a, d) & (b, c)
  ];
  return shuffleArray(pairings);
}

function formMatchesForAllCourts(
  players: string[],
  courtsCount: number,
  pastPairs: string[][]
): Match[] | null {
  // If we can't fill all courts with 4 players each, fail early.
  if (players.length < courtsCount * 4) {
    return null;
  }

  const matches: Match[] = new Array(courtsCount); // we'll fill this up

  /**
   * Recursive helper: tries to fill the match for `courtIndex`.
   */
  function backtrack(courtIndex: number, availablePlayers: string[]): boolean {
    if (courtIndex === courtsCount) {
      // We've assigned matches for all courts
      return true;
    }

    // Get and shuffle all combinations of 4 players from availablePlayers
    const combosOf4 = shuffleArray(getCombinations(availablePlayers, 4));

    for (const fourPlayers of combosOf4) {
      // Try each randomized pairing among these 4 players
      for (const [p1, p2, p3, p4] of getPairings(fourPlayers)) {
        if (
          !hasPlayedTogether(p1, p2, pastPairs) &&
          !hasPlayedTogether(p3, p4, pastPairs)
        ) {
          // This pairing is valid. Tentatively use it.
          pastPairs.push([p1, p2]);
          pastPairs.push([p3, p4]);

          matches[courtIndex] = {
            team1: [p1, p2],
            team2: [p3, p4],
          };

          // Remove these 4 from the pool and recurse
          const nextPlayers = availablePlayers.filter(p => !fourPlayers.includes(p));
          if (backtrack(courtIndex + 1, nextPlayers)) {
            return true;
          }

          // Backtrack (undo the assignment)
          pastPairs.pop();
          pastPairs.pop();
        }
      }
    }
    return false;
  }

  if (backtrack(0, players)) {
    return matches;
  } else {
    return null;
  }
}

/**
 * Fallback pairing: Sequentially picks teams from playersPool.
 * Uses allowRepeats to ensure we can form teams even if pairs have been seen.
 */
const getTeam = (
  playersPool: string[],
  pastPairs: string[][],
  allowRepeats = false
): string[] => {
  if (playersPool.length < 2) return [];

  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    for (let i = 0; i < playersPool.length - 1; i++) {
      for (let j = i + 1; j < playersPool.length; j++) {
        if (!hasPlayedTogether(playersPool[i], playersPool[j], pastPairs)) {
          const team = [playersPool[i], playersPool[j]];
          playersPool.splice(j, 1);
          playersPool.splice(i, 1);
          pastPairs.push(team);
          return team;
        }
      }
    }
    // No valid pair found on this pass; try a different order.
    playersPool.sort(() => Math.random() - 0.5);
    attempt++;
  }

  // Fallback after maxAttempts: allow repeat.
  const p1 = playersPool.pop()!;
  const p2 = playersPool.pop()!;
  console.log(`⚠️ No unique pairs found after ${maxAttempts} attempts. Allowing repeat: ${p1} and ${p2}`);
  pastPairs.push([p1, p2]);
  return [p1, p2];
};


export const generateMatchups = (
  players: string[],
  courts: string[]
): { matchups: Round[]; onBreak: string[] } => {
    
  // 1. Load stored data
  let pastPairs: string[][] = JSON.parse(localStorage.getItem("pastPairs") || "[]");
  let breakCounts: { [player: string]: number } = JSON.parse(
    localStorage.getItem("breakCounts") || "{}"
  );

  // 2. Clean up your player list, handle new players, etc.
  players = players.filter(p => p.trim() !== "");
  const currentBreakValues = Object.values(breakCounts);
  const maxBreakCount = currentBreakValues.length > 0 ? Math.max(...currentBreakValues) : 0;

  // Initialize break counts for new players
  players.forEach(player => {
    if (breakCounts[player] === undefined) {
      breakCounts[player] = maxBreakCount;
    }
  });

  // 3. Sort players by your chosen criteria (e.g. break count)
  // This ensures players who have had more breaks are prioritized.
  const sortedPlayers = players.sort((a, b) => (breakCounts[b] - breakCounts[a]));

  // 4. Figure out how many courts we can fill.
  const maxCourtsWeCanFill = Math.floor(sortedPlayers.length / 4);
  // Instead of shuffling courts, simply take the first few.
  const courtsToUse = courts.slice(0, maxCourtsWeCanFill);

  // 5. Split off the players who will actually play.
  const playersNeeded = courtsToUse.length * 4;
  // Select the top players based on break count...
  let playersForPlay = sortedPlayers.slice(0, playersNeeded);
  // ... then shuffle them so their court assignment varies.
  playersForPlay = shuffleArray(playersForPlay);

  // Players on break are the remaining players.
  const playersOnBreak = sortedPlayers.slice(playersNeeded);

  // 6. Use the backtracking approach to form matches for these courts.
  let matches = formMatchesForAllCourts(playersForPlay, courtsToUse.length, pastPairs);

  // 7. Fallback logic: if backtracking fails, pair players sequentially allowing repeats.
  if (matches === null) {
    console.warn("No arrangement without repeats was found. Falling back to repeated pairs...");
    let fallbackMatches: Match[] = [];
    // Clone and shuffle the players so order is randomized.
    let playersPool = shuffleArray([...playersForPlay]);

    // Create as many matches as there are courts.
    while (fallbackMatches.length < courtsToUse.length && playersPool.length >= 4) {
      const team1 = getTeam(playersPool, pastPairs, true);
      const team2 = getTeam(playersPool, pastPairs, true);
      if (team1.length === 0 || team2.length === 0) break;
      fallbackMatches.push({ team1, team2 });
    }
    matches = fallbackMatches;
  }

  // 8. Build the final Round[] structure using the organized courts.
  let matchups: Round[] = matches.map((m, i) => ({
    court: courtsToUse[i],
    matches: [m],
  }));

  // 9. Update break counts for players on break.
  playersOnBreak.forEach(player => {
    breakCounts[player] = (breakCounts[player] || 0) + 1;
  });

  // 10. Save updated data.
  localStorage.setItem("matchups", JSON.stringify(matchups));
  localStorage.setItem("onBreak", JSON.stringify(playersOnBreak));
  localStorage.setItem("pastPairs", JSON.stringify(pastPairs));
  localStorage.setItem("breakCounts", JSON.stringify(breakCounts));

  return { matchups, onBreak: playersOnBreak };
};

