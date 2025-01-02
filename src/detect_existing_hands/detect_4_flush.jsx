/**
* Example card format: { rank: 'A', suit: 's' } 
* Assume 'cards' is an array of card objects with a rank and suit.
*/



export function hasFlush(cards) {
    // Create a map of suits => array of ranks
    const suitMap = {}
    for (const card of cards) {
      const { rank, suit } = card
      if (!suitMap[suit]) {
        suitMap[suit] = []
      }
      suitMap[suit].push(rank)
    }
  
    // First, check if there's a suit with at least 5 cards (basic flush)
    let foundFlush = false
    for (const suit in suitMap) {
      if (suitMap[suit].length >= 5) {
        foundFlush = true
        break
      }
    }
    if (!foundFlush) {
      return false
    }
  
    // If there's a flush, check if there's also a straight flush with A as high or low
    if (isStraightFlush(cards)) {
      return false
    }
  
    // If there's a flush but not a straight flush, it’s a non-straight flush
    return true
  
    /**
     * Checks whether there's at least one straight flush in the given cards.
     * This version treats A as high or low, so A-2-3-4-5 is a valid straight flush.
     */
    function isStraightFlush(allCards) {
      // Group by suit
      const suitToRanks = {}
      for (const c of allCards) {
        const { rank, suit } = c
        if (!suitToRanks[suit]) {
          suitToRanks[suit] = []
        }
        suitToRanks[suit].push(rank)
      }
  
      // Check each suit to see if it has 5+ cards forming a straight
      for (const suit in suitToRanks) {
        const ranks = suitToRanks[suit]
        if (ranks.length < 5) {
          continue
        }
        // If any suit contains 5 consecutive ranks (with Ace as high or low), return true
        if (containsFiveConsecutive(ranks)) {
          return true
        }
      }
      return false
    }
  
    /**
     * Returns true if the given set of ranks (e.g. ['2','3','A','4','5','K']) 
     * contains at least one 5-card run with Ace as high or low.
     */
    function containsFiveConsecutive(ranks) {
      // Map each rank to all possible indices. 
      // In poker, Ace can be rank 1 (low) or rank 14 (high).
      // We'll store each rank as one or more numeric indices.
      const rankIndexMap = {
        '2': [2],
        '3': [3],
        '4': [4],
        '5': [5],
        '6': [6],
        '7': [7],
        '8': [8],
        '9': [9],
        'T': [10],
        'J': [11],
        'Q': [12],
        'K': [13],
        'A': [1, 14], // Ace can play as '1' or as '14'
      }
  
      // Collect all possible indices for each card in 'ranks'
      let allIndices = []
      for (const r of ranks) {
        if (rankIndexMap[r]) {
          // If the card is an Ace, we add both 1 and 14.
          // Otherwise, we add the single value from rankIndexMap.
          allIndices = allIndices.concat(rankIndexMap[r])
        }
      }
  
      // Sort them and remove duplicates (so we don't get stuck counting same index multiple times)
      allIndices = [...new Set(allIndices)].sort((a, b) => a - b)
  
      // Now we scan these sorted indices to see if there's a run of 5 consecutive numbers
      let consecutiveCount = 1
      for (let i = 1; i < allIndices.length; i++) {
        if (allIndices[i] === allIndices[i - 1] + 1) {
          consecutiveCount++
        } else {
          consecutiveCount = 1
        }
        if (consecutiveCount >= 5) {
          return true
        }
      }
      return false
    }
  }