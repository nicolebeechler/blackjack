const PLAYERS = {
  '1': 'Player',
  '-1': 'Dealer'
};

const cardValues = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11 
};

let playerHand = [];
let dealerHand = [];
let playerPoints = 0;
let dealerPoints = 0;
let message = '';
let chips = 500; 
let wagerAmount = 0;
let wins = 0;
let losses = 0;
let standoffs = 0;
let blackjacks = 0;

const playBtn = document.getElementById('playBtn');
const continueBtn = document.getElementById('continueBtn');
const hitBtn = document.getElementById('hitBtn');
const standBtn = document.getElementById('standBtn');
const restartBtn = document.getElementById('restartBtn');
const doubleDownBtn = document.getElementById('doubleDownBtn');

function createDeck() {
  let deck = [];
  const suits = ['♣', '♠', '♦', '♥'];
  for (let i = 0; i < 6; i++) { 
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
    if (sum > 21) sum -= 10; 
  });
  return sum;
}

function calculateDealerHandValue() {
  let sum = 0;
  let hasAce = false;

  for (let i = 0; i < dealerHand.length; i++) {
    const card = dealerHand[i];
    if (!(i === 1 && dealerHiddenCard)) {
      sum += cardValues[card.value];
      if (card.value === 'A') {
        hasAce = true;
      }
    }
  }

  if (hasAce && sum > 21) {
    sum -= 10;
  }

  return sum;
}

let dealerHiddenCard = true; 

function updateDisplay() {
  document.getElementById('playerName').innerText = `Player`;
  document.getElementById('dealerName').innerText = `Dealer`;
  document.getElementById('playerPoints').innerText = `Points: ${playerPoints}`;
  document.getElementById('dealerPoints').innerText = `Points: ${dealerPoints}`;
  document.getElementById('message').innerText = message;
  document.getElementById('chips').innerText = `Chips: ${chips}`;
  document.getElementById('wager').innerText = `Wager: ${wagerAmount}`;
  document.getElementById('stats').innerHTML = `
    Wins: ${wins} &nbsp Blackjacks: ${blackjacks} &nbsp Losses: ${losses} &nbsp Standoffs: ${standoffs}
    `;
  
  document.getElementById('playerHand').innerHTML = `${playerHand.map(card => `${card.value}${card.suit}`).join(' ')}`;
  
  const playerHandElement = document.getElementById('playerHand');
  playerHandElement.innerHTML = ''; 

  const playerHandCards = playerHand.map(card => {
    const cardEl = document.createElement('div');
    cardEl.textContent = `${card.value}${card.suit}`;
    cardEl.classList.add('card'); 
    return cardEl;
  });

  playerHandCards.forEach(cardEl => {
    playerHandElement.appendChild(cardEl);
    playerHandElement.appendChild(document.createTextNode(' ')); 
  });

  document.getElementById('dealerHand').innerHTML = `${dealerHand.map(card => `${card.value}${card.suit}`).join(' ')}`;
  
  let dealerHandDisplay = [];

  if (dealerHand.length >= 2 && playerPoints !== 0) {
    dealerHandDisplay = dealerHand.map((card, index) => {
      if (index === 1 && dealerHiddenCard) {
        return 'Hidden'; 
      } else {
        return `${card.value}${card.suit}`;
      }
    });

    document.getElementById('dealerHand').innerHTML = `${dealerHandDisplay.join(' ')}`;
  } else {
    document.getElementById('dealerHand').innerHTML = `${dealerHand[0].value}${dealerHand[0].suit}`;
  }

  const dealerHandElement = document.getElementById('dealerHand');
  dealerHandElement.innerHTML = ''; 

  const dealerHandCards = dealerHand.map((card, index) => {
    const cardEl = document.createElement('div');

    if (index === 1 && dealerHiddenCard) {
      cardEl.textContent = 'Hidden';
      cardEl.setAttribute('id', 'hidden');
    } else {
      cardEl.textContent = `${card.value}${card.suit}`;
    }

    cardEl.classList.add('card'); 
    return cardEl;
  });

  dealerHandCards.forEach((cardEl, index) => {
    dealerHandElement.appendChild(cardEl);
    if (index < dealerHand.length - 1) {
      dealerHandElement.appendChild(document.createTextNode(' ')); 
    }
  });
}

let deck = createDeck();
shuffleDeck(deck);

function blackjack() {
  if (playerPoints === 21) {
    message = 'Blackjack! Player wins!';
    chips += wagerAmount * 1.5; 
    wins++;
    blackjacks++;
    updateDisplay(); 

    if (message === 'Blackjack! Player wins!') {
      document.getElementById('playBtn').style.display = 'none';
      document.getElementById('hitBtn').style.display = 'none';
      document.getElementById('standBtn').style.display = 'none';
      document.getElementById('continueBtn').style.display = 'block';
      document.getElementById('restartBtn').style.display = 'block';
      document.getElementById('doubleDownBtn').style.display = 'none';
    }
  } else if (dealerPoints === 21) {
    message = 'Dealer has Blackjack! Dealer wins!';
    losses++;
    updateDisplay();

    if (message === 'Dealer has Blackjack! Dealer wins!') {
      document.getElementById('playBtn').style.display = 'none';
      document.getElementById('hitBtn').style.display = 'none';
      document.getElementById('standBtn').style.display = 'none';
      document.getElementById('continueBtn').style.display = 'block';
      document.getElementById('restartBtn').style.display = 'block';
      document.getElementById('doubleDownBtn').style.display = 'none';
    }
  }

  updateDisplay(); 
  return;
}

let firstHit = false;

function init() {
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';
  wagerAmount = 0;

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateDealerHandValue(dealerHand);

  updateDisplay();

  let wagerInput = parseInt(prompt('Enter bet - minimum 25.'));

  if (!isNaN(wagerInput) && wagerInput >= 25 && wagerInput <= chips) {

    chips -= wagerInput; 
    wagerAmount += wagerInput; 
    updateDisplay();

  } else {

    while (isNaN(wagerInput) || wagerInput < 25 || wagerInput > chips) {
      wagerInput = parseInt(prompt('Enter bet - minimum 25.'));
    }
    chips -= wagerInput; 
    wagerAmount += wagerInput; 
    updateDisplay();
  }
blackjack();
updateDisplay();
}

document.getElementById('playBtn').addEventListener('click', init);

function hit() {
  const newCard = deck.shift();
  playerHand.push(newCard);
  playerPoints = calculateHandValue(playerHand);
  updateDisplay();

  if (!firstHit) {
    firstHit = false;
    document.getElementById('doubleDownBtn').style.display = 'none';
    updateDisplay();
  }

  if (playerPoints > 21) {
    message = 'Player busts! Dealer wins!';
    losses++;
    updateDisplay();

    if (message.includes('busts')) {
      document.getElementById('playBtn').style.display = 'none';
      document.getElementById('hitBtn').style.display = 'none';
      document.getElementById('standBtn').style.display = 'none';
      document.getElementById('continueBtn').style.display = 'block';
      document.getElementById('restartBtn').style.display = 'block';
      document.getElementById('doubleDownBtn').style.display = 'none';
    }
    return;
  }
}

function stand() {

  dealerHiddenCard = false;
  updateDisplay();

  while (dealerPoints < 17) {
    const newCard = deck.shift();
    dealerHand.push(newCard);
    dealerPoints = calculateDealerHandValue(dealerHand);
    updateDisplay();
  }

  if (playerPoints > 21 && dealerPoints > 21) {
    message = 'Both bust!';
    chips += wagerAmount;
    losses++;
  } else if (playerPoints > 21 && dealerPoints <=21 ) { 
    message = 'Dealer wins!';
    losses++;
  } else if (dealerPoints > 21 || dealerPoints < playerPoints) {
    message = 'Player wins!';
    chips += wagerAmount * 2; 
    wins++;
  } else if (dealerPoints > playerPoints) {
    message = 'Dealer wins!';
    losses++;
  } else {
    message = 'Standoff';
    chips += wagerAmount; 
    standoffs++;
  }

  document.getElementById('playBtn').style.display = 'none';
  document.getElementById('hitBtn').style.display = 'none';
  document.getElementById('standBtn').style.display = 'none';
  document.getElementById('continueBtn').style.display = 'block';
  document.getElementById('restartBtn').style.display = 'block';
  document.getElementById('doubleDownBtn').style.display = 'none';

  updateDisplay();
}

function doubleDown() {
  chips -= wagerAmount; 
  wagerAmount *= 2; 

  const newCard = deck.shift();
  playerHand.push(newCard);
  playerPoints = calculateHandValue(playerHand);
  updateDisplay();

  stand();
}

function hideDoubleDownBtn() {
  document.getElementById('doubleDownBtn').style.display = 'none';
};

document.getElementById('playBtn').addEventListener('click', () => {

  updateDisplay();

  document.getElementById('doubleDownBtn').addEventListener('click', doubleDown);
  document.getElementById('hitBtn').addEventListener('click', hit, hideDoubleDownBtn);
  document.getElementById('standBtn').addEventListener('click', stand);

  document.getElementById('playBtn').style.display = 'none';
  document.getElementById('doubleDownBtn').style.display = 'none';
  document.getElementById('hitBtn').style.display = 'block';
  document.getElementById('standBtn').style.display = 'block';
  document.getElementById('continueBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
});

function continueGame() {
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';

  dealerHiddenCard = true;

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateDealerHandValue(dealerHand);

  updateDisplay();

  init();

  document.getElementById('playBtn').style.display = 'none';
  document.getElementById('doubleDownBtn').style.display = 'block';
  document.getElementById('hitBtn').style.display = 'block';
  document.getElementById('standBtn').style.display = 'block';
  document.getElementById('continueBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
}


function restartGame() {
  playerHand = [];
  dealerHand = [];
  playerPoints = 0;
  dealerPoints = 0;
  message = '';
  chips = 500;
  wagerAmount = 0;
  wins = 0;
  losses = 0;
  blackjacks = 0;
  standoffs = 0;

  deck = createDeck();
  shuffleDeck(deck);

  dealerHiddenCard = true;

  dealInitialCards();

  playerPoints = calculateHandValue(playerHand);
  dealerPoints = calculateDealerHandValue(dealerHand);

  updateDisplay();

  init();

  document.getElementById('playBtn').style.display = 'none';
  document.getElementById('doubleDownBtn').style.display = 'none';
  document.getElementById('doubleDownBtn').style.display = 'block';
  document.getElementById('hitBtn').style.display = 'block';
  document.getElementById('standBtn').style.display = 'block';
  document.getElementById('continueBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
}

document.getElementById('continueBtn').addEventListener('click', continueGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);