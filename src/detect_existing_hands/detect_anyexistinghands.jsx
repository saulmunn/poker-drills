import { hasStraightFlush } from './detect_1_straightflush.jsx'
import { hasQuads } from './detect_2_quads.jsx'
import { hasFullHouse } from './detect_3_fullhouse.jsx'
import { hasFlush } from './detect_4_flush.jsx'
import { hasStraight } from './detect_5_straight.jsx'
import { hasThreeOfAKind } from './detect_6_threeofakind.jsx'
import { hasTwoPair } from './detect_7_twopair.jsx'
import { hasPair } from './detect_8_pair.jsx'

export function detectAnyExistingHands(cards) {
    if (hasStraightFlush(cards)) {
      return 'straight flush'
    } else if (hasQuads(cards)) {
      return 'quads'
    } else if (hasFullHouse(cards)) {
      return 'full house'
    } else if (hasFlush(cards)) {
      return 'flush'
    } else if (hasStraight(cards)) {
      return 'straight'
    } else if (hasThreeOfAKind(cards)) {
      return 'three of a kind'
    } else if (hasTwoPair(cards)) {
      return 'two pair'
    } else if (hasPair(cards)) {
      return 'pair'
    } else {
      return 'high card'
    }
  }  