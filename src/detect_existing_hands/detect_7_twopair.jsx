/**
 * Example card format: { rank: 'A', suit: 's' }
 * Assume 'cards' is an array of card objects with a rank and suit.
 */

export function hasTwoPair(cards) {
    // Create a frequency map of ranks
    const rankCount = {}
    for (const card of cards) {
      const { rank } = card
      if (rankCount[rank]) {
        rankCount[rank]++
      } else {
        rankCount[rank] = 1
      }
    }
  
    // Count how many ranks appear two or more times
    let pairCount = 0
    for (const rank in rankCount) {
      if (rankCount[rank] >= 2) {
        pairCount++
        if (pairCount >= 2) {
          return true
        }
      }
    }
  
    return false
  }