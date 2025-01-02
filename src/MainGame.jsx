import React, { useState, useEffect } from 'react'
import { detectAnyExistingHands } from './detect_existing_hands/detect_anyexistinghands'

// Create a 52-card deck (each card is something like "2H", "2D", ..., "AS")
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
const SUITS = ['H','D','C','S']
const FULL_DECK = []
for (let r of RANKS) {
  for (let s of SUITS) {
    FULL_DECK.push(r + s)
  }
}

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
    const newDeck = [...FULL_DECK]
    shuffle(newDeck)
    const pocket = drawCards(newDeck, 2)
    const community = drawCards(newDeck, 3)
    const parsed = [...pocket, ...community].map(parseCard)
    const detected = detectAnyExistingHands(parsed)

    setPocketCards(pocket)
    setCommunityCards(community)
    setCorrectHand(detected)
    setUserGuess('')
    setFeedback('')
  }

  useEffect(() => {
    generateNewProblem()
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    if (!userGuess) return

    if (userGuess === correctHand) {
      setFeedback('Correct!')
      setTimeout(() => {
        generateNewProblem()
      }, 500)
    } else {
      setFeedback(`Wrong. The correct answer is "${correctHand}".`)
      setTimeout(() => {
        generateNewProblem()
      }, 1500)
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-100 flex items-center justify-center px-4 font-[Arial]">
      <div className="relative max-w-md w-full bg-white shadow-md rounded p-6 text-center">
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