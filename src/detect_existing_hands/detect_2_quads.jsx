/**
 * Example card format: { rank: 'A', suit: 's' } 
 * Assume 'cards' is an array of card objects with a rank and suit.
 */
export function hasQuads(cards) {
    // Create a map for rank frequencies
    const rankCount = {};
  
    // Tally the rank frequencies
    for (const card of cards) {
      const { rank } = card;
      if (!rankCount[rank]) {
        rankCount[rank] = 1;
      } else {
        rankCount[rank]++;
      }
    }
  
    // Check if any rank occurs four times
    for (const rank in rankCount) {
      if (rankCount[rank] === 4) {
        return true;
      }
    }
  
    // If no rank is found to occur four times, return false
    return false;
  }