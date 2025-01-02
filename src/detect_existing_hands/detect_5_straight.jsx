/**
 * Example card format: { rank: 'A', suit: 's' }
 * Assume 'cards' is an array of card objects with a rank and suit.
 */

export function hasStraight(cards) {
    // Use "10" instead of 'T' to match how the rest of your app formats ten cards.
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const rankIndexMap = {};
    for (let i = 0; i < rankOrder.length; i++) {
      rankIndexMap[rankOrder[i]] = i;
    }
  
    // Collect suits by rank index.
    const rankSuits = Array(rankOrder.length).fill(null).map(() => new Set());
  
    for (const card of cards) {
      const { rank, suit } = card;
      // If the rankIndexMap doesn't have rank, skip or handle it gracefully
      if (rankIndexMap[rank] === undefined) {
        continue;
      }
      const idx = rankIndexMap[rank];
      rankSuits[idx].add(suit);
    }
  
    // We'll look for any 5 consecutive rank indices
    const neededRun = 5;
    for (let start = 0; start <= rankOrder.length - neededRun; start++) {
      let consecutiveCount = 1;
      for (let next = start + 1; next < rankOrder.length; next++) {
        // If rankSuits[next] has no cards, there's a break in ranks
        if (rankSuits[next].size === 0) {
          break;
        }
        // Check if next is indeed consecutive
        if (next === (start + consecutiveCount)) {
          consecutiveCount++;
        } else {
          break;
        }
        if (consecutiveCount === neededRun) {
          let commonSuits = new Set(rankSuits[start]);
          for (let runIdx = start + 1; runIdx < start + neededRun; runIdx++) {
            const suitsHere = rankSuits[runIdx];
            commonSuits = new Set([...commonSuits].filter(s => suitsHere.has(s)));
            if (commonSuits.size === 0) {
              // no single suit in all 5 ranks
              break;
            }
          }
          // If commonSuits is empty, there's no single suit spanning all 5 ranks => non-flush straight
          if (commonSuits.size === 0) {
            return true;
          }
        }
      }
    }
  
    return false;
  }