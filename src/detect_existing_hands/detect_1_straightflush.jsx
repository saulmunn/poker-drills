/**
 * Example card format: { rank: 'A', suit: 's' } 
 * Assume 'cards' is an array of card objects with a rank and suit.
 */

export function hasStraightFlush(cards) {
  // Define an ordered list of ranks and create a lookup for their positions.
  const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const rankIndexMap = {};
  for (let i = 0; i < rankOrder.length; i++) {
    rankIndexMap[rankOrder[i]] = i;
  }

  // Group cards by suit.
  const suitGroups = {};
  for (const card of cards) {
    const { rank, suit } = card;
    if (!suitGroups[suit]) {
      suitGroups[suit] = [];
    }
    suitGroups[suit].push(rank);
  }

  // Helper function to check if there's a run of 5 consecutive ranks.
  function hasFiveConsecutive(ranks) {
    // Convert rank symbols to their indices and sort them.
    let sortedIndices = [...new Set(ranks)] // Remove duplicates
      .map(rank => rankIndexMap[rank])
      .sort((a, b) => a - b);

    // Check for regular consecutive sequence
    let consecutiveCount = 1;
    for (let i = 1; i < sortedIndices.length; i++) {
      if (sortedIndices[i] === sortedIndices[i - 1] + 1) {
        consecutiveCount++;
      } else {
        // Reset if there's a break (and ignore duplicates).
        consecutiveCount = 1;
      }
      if (consecutiveCount >= 5) {
        return true;
      }
    }

    // **New Code: Check for Ace-low straight (A-2-3-4-5)**
    const aceLowSequence = [rankIndexMap['A'], rankIndexMap['2'], rankIndexMap['3'], rankIndexMap['4'], rankIndexMap['5']];
    const hasAceLow = aceLowSequence.every(index => sortedIndices.includes(index));
    if (hasAceLow) {
      return true;
    }

    return false;
  }

  // For each suit, check if there are at least 5 cards and if those ranks form 5 consecutive indices.
  for (const suit in suitGroups) {
    if (suitGroups[suit].length >= 5 && hasFiveConsecutive(suitGroups[suit])) {
      return true;
    }
  }

  return false;
}