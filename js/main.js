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

const playBtn = document.getElementById('playBtn');
const continueBtn = document.getElementById('continueBtn');
const hitBtn = document.getElementById('hitBtn');
const standBtn = document.getElementById('standBtn');
const restartBtn = document.getElementById('restartBtn');

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

// add separate function for dealer? hidden card is included in initial total
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

  let dealerHandDisplay = [];

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
      // create css and call css class in this js to make cards have style
      document.getElementById('dealerHand').innerHTML = `${dealerHandDisplay.join(' ')}`;
    } else {
      document.getElementById('dealerHand').innerHTML = `Hidden, ${dealerHand[0].value}${dealerHand[0].suit}`;
    }
  }
}

// Blackjack game
let deck = createDeck();
shuffleDeck(deck);

function init() {
  // Reset game state
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';
  wagerAmount = 0;

  // Deal initial cards for the player and dealer
  dealInitialCards();

  // Calculate initial points for player and dealer
  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateHandValue(dealerHand);

  // Update the display to show the hands, points, and other relevant information
  updateDisplay();

  // Prompt for the wager input
  let wagerInput = parseInt(prompt('Enter wager - minimum 25.'));

  if (!isNaN(wagerInput) && wagerInput >= 25 && wagerInput <= chips) {
    chips -= wagerInput; // Deduct the wager from player's chips
    wagerAmount += wagerInput; // Increase wager amount
    updateDisplay();
  } else {
    // Prompt again if the input is invalid
    // Add a message and prevent the player from betting and playing if chips < 25
    while (isNaN(wagerInput) || wagerInput < 25 || wagerInput > chips) {
      wagerInput = parseInt(prompt('Invalid wager amount! Enter wager - minimum 25.'));
    }
    chips -= wagerInput; // Deduct the wager from player's chips
    wagerAmount += wagerInput; // Increase wager amount
    updateDisplay();
  }
}

// Event listener for the play button
document.getElementById('playBtn').addEventListener('click', init);

// // // // // // // //

function blackjack() {
  if (playerPoints === 21) {
    message = 'Blackjack! Player wins!';
    updateDisplay();
    return;
  } else if (dealerPoints === 21) {
    message = 'Dealer has Blackjack! Dealer wins!';
    updateDisplay();
    return;
  }

  updateDisplay();
}

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
    dealerHiddenCard = false; // not working
  }

  if (dealerPoints > 21 || dealerPoints < playerPoints) {
    message = 'Player wins!';
    // add payout rules, 3:2 Blackjack, 1:1 Win, Standoff return wager
  } else if (dealerPoints > playerPoints) {
    message = 'Dealer wins!';
  } else {
    message = 'Standoff';
  }

  document.getElementById('playBtn').style.display = 'none';
  document.getElementById('hitBtn').style.display = 'none';
  document.getElementById('standBtn').style.display = 'none';
  document.getElementById('continueBtn').style.display = 'block';
  document.getElementById('restartBtn').style.display = 'block';

  updateDisplay();
}

// add function double down

// add funtion split (optional)

// re-work to get buttons to appear at appropriate stages in gameplay
document.getElementById('playBtn').addEventListener('click', () => {

  updateDisplay();

  document.getElementById('hitBtn').addEventListener('click', hit);
  document.getElementById('standBtn').addEventListener('click', stand);

  document.getElementById('playBtn').style.display = 'none';
  document.getElementById('hitBtn').style.display = 'block';
  document.getElementById('standBtn').style.display = 'block';
  document.getElementById('continueBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
});

function continueGame() {
  // Clear the hands, points, and message, do not reset chips
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateHandValue(dealerHand);

  updateDisplay();

  init();
}


function restartGame() {
  // Reset all
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';
  chips = 500;
  wagerAmount = 0;

  deck = createDeck();
  shuffleDeck(deck);

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateHandValue(dealerHand);

  updateDisplay();

  init();
}

document.getElementById('continueBtn').addEventListener('click', continueGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);