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

  // Collect unique ranks present in the cards
  const uniqueRanks = new Set();
  for (const card of cards) {
    const { rank } = card;
    if (rankIndexMap[rank] !== undefined) {
      uniqueRanks.add(rank);
    }
  }

  // Convert unique ranks to sorted indices
  let sortedIndices = Array.from(uniqueRanks)
    .map(rank => rankIndexMap[rank])
    .sort((a, b) => a - b);

  // Check for Ace-low straight (A-2-3-4-5)
  const aceLowStraight = ['A', '2', '3', '4', '5'];
  const hasAceLowStraight = aceLowStraight.every(rank => uniqueRanks.has(rank));

  if (hasAceLowStraight) {
    return true;
  }

  // Check for any 5 consecutive ranks
  let consecutiveCount = 1;
  for (let i = 1; i < sortedIndices.length; i++) {
    if (sortedIndices[i] === sortedIndices[i - 1] + 1) {
      consecutiveCount++;
      if (consecutiveCount === 5) {
        return true;
      }
    } else {
      consecutiveCount = 1;
    }
  }

  return false;
}