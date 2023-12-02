// alert('js is loaded')

	/*----- constants -----*/

    const PLAYERS = {
      '1': 'Player',
      '-1': 'Dealer'
    }

    const cardValues = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 10, 'Q': 10, 'K': 10, 'A': 11 
    }

    const playerHand = []

    const dealerHand = []

	/*----- state variables -----*/

      let turn
      // let playerScore = calculateHandValue(playerHand)
      // let dealerScore = calculateHandValue(dealerHand)
      let winner

	/*----- cached elements  -----*/


	/*----- event listeners -----*/


	/*----- functions -----*/

// init();

// function init() {
//   turn = 1
//   cards = null
//   winner = null
//   render()
// }

function createDeck() {
  let deck = []
  const suits = ['♣', '♠', '♦', '♥']
  for (let i = 0; i < 6; i++) { // Create 6 decks
    for (let suit of suits) {
      for (let value in cardValues) {
        deck.push({ suit, value })
      }
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

let sixDecks = createDeck();
shuffleDeck(sixDecks);

console.log(sixDecks);
