/**
 * Example card format: { rank: 'A', suit: 's' }
 * Assume 'cards' is an array of card objects with a rank and suit.
 */

export function hasPair(cards) {
    const rankCount = {};
  
    for (const card of cards) {
      const { rank } = card;
      if (!rankCount[rank]) {
        rankCount[rank] = 1;
      } else {
        rankCount[rank]++;
      }
    }
  
    for (const rank in rankCount) {
      if (rankCount[rank] === 2) {
        return true;
      }
    }
  
    return false;
  }