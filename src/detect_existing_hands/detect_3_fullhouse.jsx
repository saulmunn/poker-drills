/**
 * Example card format: { rank: 'A', suit: 's' }
 * Assume 'cards' is an array of card objects with a rank and suit.
 */

export function hasFullHouse(cards) {
    const rankCount = {};
  
    for (const card of cards) {
      const { rank } = card;
      rankCount[rank] = (rankCount[rank] || 0) + 1;
    }
  
    // Collect ranks that can serve as a "three" and ranks that can serve as a "pair"
    const tripleCandidates = [];
    const pairCandidates = [];
  
    for (const rank in rankCount) {
      const count = rankCount[rank];
      if (count >= 3) {
        tripleCandidates.push(rank);
      }
      if (count >= 2) {
        pairCandidates.push(rank);
      }
    }
  
    // Check if there's at least one suitable "triple" rank and a different suitable "pair" rank
    for (const tripleRank of tripleCandidates) {
      for (const pairRank of pairCandidates) {
        // If the triple and pair are different ranks, that's a full house.
        // Also, in some card-set scenarios, having four or more of a single rank plus at least one more rank with two or more can still form a valid full house in a 5-card selection.
        if (tripleRank !== pairRank) {
          return true;
        }
        if (rankCount[tripleRank] >= 4 && pairCandidates.length > 1) {
          // For example, if you have AAAA plus a pair of Kings, it's still a full house in the best 5-card hand.
          return true;
        }
      }
    }
  
    return false;
  }