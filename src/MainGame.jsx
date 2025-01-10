import React, { useState, useEffect } from 'react'
import { detectAnyExistingHands } from './detect_existing_hands/detect_anyexistinghands'

// **Import High-Ranking Hand Detection Scripts**
import { hasStraightFlush } from './detect_existing_hands/detect_1_straightflush.jsx'
import { hasQuads } from './detect_existing_hands/detect_2_quads.jsx'
import { hasFullHouse } from './detect_existing_hands/detect_3_fullhouse.jsx'
import { hasFlush } from './detect_existing_hands/detect_4_flush.jsx'
import { hasStraight } from './detect_existing_hands/detect_5_straight.jsx'
import { hasThreeOfAKind } from './detect_existing_hands/detect_6_threeofakind.jsx'

// **Map High-Ranking Hands to Their Detection Functions**
const HIGH_RANKING_HANDS = {
  'straight flush': hasStraightFlush,
  'quads': hasQuads,
  'full house': hasFullHouse,
  'flush': hasFlush,
  'straight': hasStraight,
  'three of a kind': hasThreeOfAKind
}

// Create a 52-card deck (each card is something like "2H", "2D", ..., "AS")
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const SUITS = ['H','D','C','S']
const FULL_DECK = []
for (let r of RANKS) {
  for (let s of SUITS) {
    FULL_DECK.push(r + s)
  }
}

// Define the list of acceptable pocket combinations
const ACCEPTABLE_POCKETS = [
  'AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'AKo', 
  'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'AQo', 'KQo', 
  'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'AJo', 'KJo', 'QJo', 'JJ', 
  '99', '88', '77', '66', '55', '44', '33', '22'
]

// Randomly shuffle an array in place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Draw n cards from a deck (mutates the deck array)
function drawCards(deck, n) {
  const drawn = deck.slice(0, n)
  deck.splice(0, n)
  return drawn
}

// Convert 'AH' => { rank: 'A', suit: 'H' }
function parseCard(cardString) {
  const suit = cardString.slice(-1)
  const rank = cardString.slice(0, -1)
  return { rank, suit }
}

// Maps rank/suit to the file name in ./src/assets/cards-svgs/
// Example: { rank: 'K', suit: 'H' } => 'KH.svg'
function getCardAssetName({ rank, suit }) {
  const rankMap = {
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': 'T',
    'J': 'J',
    'Q': 'Q',
    'K': 'K',
    'A': 'A'
  }
  const suitMap = {
    'H': 'H',
    'D': 'D',
    'C': 'C',
    'S': 'S'
  }
  const rankName = rankMap[rank]
  const suitName = suitMap[suit]
  return `${rankName}${suitName}.svg`
}

// **New Utility Function: Format Pocket Cards**
function formatPocket(pocket) {
  const [card1, card2] = pocket
  const rank1 = card1.slice(0, -1)
  const suit1 = card1.slice(-1)
  const rank2 = card2.slice(0, -1)
  const suit2 = card2.slice(-1)

  // Determine if the pocket is suited or offsuit
  const suited = suit1 === suit2 ? 's' : 'o'

  // Sort the ranks based on predefined order
  const sortedRanks = [rank1, rank2].sort((a, b) => {
    const order = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
    return order.indexOf(a) - order.indexOf(b)
  })

  // If both ranks are the same, return without suit indicator
  if (sortedRanks[0] === sortedRanks[1]) {
    return `${sortedRanks[1]}${sortedRanks[0]}`
  }

  return `${sortedRanks[1]}${sortedRanks[0]}${suited}`
}

export default function MainGame() {
  const [pocketCards, setPocketCards] = useState([])
  const [communityCards, setCommunityCards] = useState([])
  const [correctHand, setCorrectHand] = useState(null)
  const [userGuess, setUserGuess] = useState('')
  const [feedback, setFeedback] = useState('')

  const possibleHands = [
    'straight flush',
    'quads',
    'full house',
    'flush',
    'straight',
    'three of a kind',
    'two pair',
    'pair',
    'high card',
  ]

  function generateNewProblem() {
    const MAX_RETRIES = 500
    let attempts = 0
    let isValidBoard = false
    let pocket = []
    let community = []
    let parsed = []
    let detected = null

    // Step 1: Generate a random number between 1 and 5
    const randomNumber = Math.floor(Math.random() * 5) + 1

    if (randomNumber === 1) {
      // Step 2A: Attempt to generate a high-ranking hand
      while (attempts < MAX_RETRIES && !isValidBoard) {
        attempts++
        const newDeck = [...FULL_DECK]
        shuffle(newDeck)
        pocket = drawCards(newDeck, 2)
        community = drawCards(newDeck, 5)
        parsed = [...pocket, ...community].map(parseCard)
        detected = detectAnyExistingHands(parsed)

        // Step 2A.1: Check for any high-ranking hand
        for (let hand in HIGH_RANKING_HANDS) {
          if (HIGH_RANKING_HANDS[hand](parsed)) {
            isValidBoard = true
            setPocketCards(pocket)
            setCommunityCards(community)
            setCorrectHand(detected)
            setUserGuess('')
            setFeedback('')
            break // Exit the loop as a valid board has been found
          }
        }
      }

      // Step 3: Handle failure to generate a high-ranking hand
      if (!isValidBoard) {
        // Optionally, inform the user before reloading
        alert('Unable to generate a high-ranking hand after multiple attempts. Reloading the game.')
        window.location.reload()
      }
    } else {
      // Step 2B: Proceed with normal board generation
      const newDeck = [...FULL_DECK]
      shuffle(newDeck)
      pocket = drawCards(newDeck, 2)
      community = drawCards(newDeck, 5)
      parsed = [...pocket, ...community].map(parseCard)
      detected = detectAnyExistingHands(parsed)

      // Step 2B.1: Check if the pocket is acceptable
      const formattedPocket = formatPocket(pocket)
      if (ACCEPTABLE_POCKETS.includes(formattedPocket)) {
        setPocketCards(pocket)
        setCommunityCards(community)
        setCorrectHand(detected)
        setUserGuess('')
        setFeedback('')
      } else {
        // If pocket is not acceptable, recursively generate a new problem
        generateNewProblem()
      }
    }
  }

  useEffect(() => {
    generateNewProblem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    if (!userGuess) return

    if (userGuess === correctHand) {
      setFeedback('✅ Correct!')
      setTimeout(() => {
        generateNewProblem()
      }, 500)
    } else {
      setFeedback(`❌ Wrong. The correct answer is "${correctHand}". (Moving on in 5s.)`)
      setTimeout(() => {
        generateNewProblem()
      }, 5000)
    }
  }

  return (
    <div className="h-auto overflow-hidden bg-gray-100 flex items-center justify-center px-4 font-[Arial]">
      <div className="relative max-w-full w-full bg-white shadow-md rounded-2xl p-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          What's the best hand on the current board?
        </h1>

        {/* Community cards on top */}
        <div className="mb-2 text-gray-700 font-semibold">Community Cards</div>
        <div className="flex justify-center space-x-2 mb-4">
          {communityCards.map((card) => {
            const parsed = parseCard(card)
            return (
              <img
                key={card}
                src={`/card-svgs/${getCardAssetName(parsed)}`}
                alt={card}
                className="w-28 h-auto" // Increased size from w-20 to w-28
              />
            )
          })}
        </div>

        {/* Pocket cards on bottom */}
        <div className="mb-2 text-gray-700 font-semibold">Pocket Cards</div>
        <div className="flex justify-center space-x-2 mb-4">
          {pocketCards.map((card) => {
            const parsed = parseCard(card)
            return (
              <img
                key={card}
                src={`/card-svgs/${getCardAssetName(parsed)}`}
                alt={card}
                className="w-28 h-auto" // Increased size from w-20 to w-28
              />
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-2 mb-4 w-full">
            {possibleHands.map((hand) => (
              <label
                key={hand}
                className={`flex items-center justify-center border rounded p-2 cursor-pointer text-sm
                  ${
                    userGuess === hand
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
              >
                <input
                  type="radio"
                  name="hand"
                  value={hand}
                  checked={userGuess === hand}
                  onChange={(e) => setUserGuess(e.target.value)}
                  className="hidden"
                />
                {hand}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-8 rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Submit
          </button>
        </form>

        {/* Reserve space for feedback so it doesn't bump everything. */}
        <div className="mt-4 h-8 flex items-center justify-center">
          {feedback && (
            <span className="text-lg text-gray-900">
              {feedback}
            </span>
          )}
        </div>

        {/* Footer with attribution */}
        <div className="mt-6 text-xs text-gray-600">
          Made by{' '}
          <a href="https://openai.com/o1/" target="_blank" rel="noopener noreferrer" className="underline">
            o1
          </a>{' '}
          and{' '}
          <a href="https://saulmunn.com" target="_blank" rel="noopener noreferrer" className="underline">
            Saul Munn
          </a>{' '}
          —{' '}
          <a href="https://github.com/saulmunn/poker-drills" target="_blank" rel="noopener noreferrer" className="underline">
            code
          </a>
          .
        </div>
      </div>
    </div>
  )
}