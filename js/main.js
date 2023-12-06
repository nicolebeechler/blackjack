// alert('js is loaded')

/*----- constants -----*/

const PLAYERS = {
  '1': 'Player',
  '-1': 'Dealer'
};

const cardValues = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11 
};

/*----- state variables -----*/

let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
let message = '';
let chips = 500; 
let wagerAmount = 0;

/*----- cached elements  -----*/

/*----- event listeners -----*/

/*----- functions -----*/

function createDeck() {
  let deck = [];
  const suits = ['♣', '♠', '♦', '♥'];
  for (let i = 0; i < 6; i++) { // Create 6 decks
    for (let suit of suits) {
      for (let value in cardValues) {
        deck.push({ suit, value });
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

function dealInitialCards() {
  playerHand.push(...deck.splice(0, 2));
  dealerHand.push(...deck.splice(0, 2));
}

function calculateHandValue(hand) {
  let sum = hand.reduce((total, card) => total + cardValues[card.value], 0);
  hand.filter(card => card.value === 'A').forEach(_ => {
    if (sum > 21) sum -= 10; // Change Ace value from 11 to 1 if needed
  });
  return sum;
}

let dealerHiddenCard = true; // Track if the dealer's second card is hidden

function updateDisplay() {
  document.getElementById('playerName').innerText = `Player`;
  document.getElementById('dealerName').innerText = `Dealer`;
  document.getElementById('playerPoints').innerText = `Points: ${playerPoints}`;
  document.getElementById('dealerPoints').innerText = `Points: ${dealerPoints}`;
  document.getElementById('playerHand').innerText = `${playerHand.map(card => `${card.value}${card.suit}`).join(' ')}`;
  document.getElementById('dealerHand').innerText = `${dealerHand.map(card => `${card.value}${card.suit}`).join(' ')}`;
  document.getElementById('message').innerText = message;
  document.getElementById('chips').innerText = `Chips: ${chips}`;
  document.getElementById('wager').innerText = `Wager: ${wagerAmount}`;

  if (dealerHand.length >= 2 && playerPoints !== 0) {
    const dealerHandDisplay = dealerHand.map((card, index) => {
      if (index === 1 && dealerHiddenCard) {
        return 'Hidden';
      } else {
        return `${card.value}${card.suit}`;
      }
    });
    if (dealerHand.length >= 2 && playerPoints !== 0) {
      const dealerHandDisplay = dealerHand.map((card, index) => {
        if (index === 1 && dealerHiddenCard) {
          return 'Hidden';
        } else {
          return `${card.value}${card.suit}`;
        }
      });
      
      document.getElementById('dealerHand').innerHTML = `${dealerHandDisplay.join(' ')}`;
    } else {
      document.getElementById('dealerHand').innerHTML = `[Hidden], ${dealerHand[0].value}${dealerHand[0].suit}`;
    }
  }
}

// Blackjack game
let deck = createDeck();
shuffleDeck(deck);

document.getElementById('playBtn').addEventListener('click', () => {
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';
  wagerAmount = 0;

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateHandValue(dealerHand);

  updateDisplay();

  let wagerInput = parseInt(prompt('Enter wager - minimum 25.'));

  if (!isNaN(wagerInput) && wagerInput >= 25 && wagerInput <= chips) {
    chips -= wagerInput; // Deduct the wager from player's chips
    wagerAmount += wagerInput; // Display wager amount
    updateDisplay();
  } else {
    document.getElementById('message').innerText = 'Invalid wager amount!';
  }
});

function hit() {
  const newCard = deck.shift();
  playerHand.push(newCard);
  playerPoints = calculateHandValue(playerHand);
  updateDisplay();

  if (playerPoints > 21) {
    message = 'Player busts! Dealer wins!';
    updateDisplay();
    return;
  }
}

function stand() {
  while (dealerPoints < 17) {
    const newCard = deck.shift();
    dealerHand.push(newCard);
    dealerPoints = calculateHandValue(dealerHand);
    dealerHiddenCard = false;
  }

  if (dealerPoints > 21 || dealerPoints < playerPoints) {
    message = 'Player wins!';
  } else if (dealerPoints > playerPoints) {
    message = 'Dealer wins!';
  } else {
    message = 'It\'s a tie!';
  }

  updateDisplay();
}

document.getElementById('playBtn').addEventListener('click', () => {

  updateDisplay();

  document.getElementById('hitBtn').addEventListener('click', hit);
  document.getElementById('standBtn').addEventListener('click', stand);
});

function continueGame() {
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateHandValue(dealerHand);

  updateDisplay();
}

function replayGame() {
  deck = createDeck();
  shuffleDeck(deck);

  continueGame();
}

document.getElementById('continueBtn').addEventListener('click', continueGame);
document.getElementById('replayBtn').addEventListener('click', replayGame);

document.getElementById('playBtn').addEventListener('click', continueGame);