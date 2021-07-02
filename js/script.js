let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-score", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-score",
    div: "#dealer-box",
    score: 0,
  },
  cards: [
    "2S",
    "3S",
    "4S",
    "5S",
    "6S",
    "7S",
    "8S",
    "9S",
    "10S",
    "KS",
    "JS",
    "QS",
    "AS",
  ],
  cardsMap: {
    "2S": 2,
    "3S": 3,
    "4S": 4,
    "5S": 5,
    "6S": 6,
    "7S": 7,
    "8S": 8,
    "9S": 9,
    "10S": 10,
    KS: 10,
    JS: 10,
    QS: 10,
    AS: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  hit:true,
  isStand: false,
  tunrsOver: false,
};
const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const lostSound = new Audio("sounds/aww.mp3");

document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);

document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", dealerLogic);

document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

function blackjackHit() {
  if ( blackjackGame['hit'] === true ) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
    
  }
  blackjackGame["isStand"] = true;
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    setTimeout(() => {
      hitSound.play();
    }, 20);
  }
}

function blackjackDeal() {
  if (blackjackGame["turnsOver"] === true) {
    // showResult(computeWinner());
    
    blackjackGame["hit"] = true;
    blackjackGame["isStand"] = false;
    let yourImages = document
      .querySelector("#your-box")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;

    document.querySelector("#your-blackjack-score").textContent = 0;
    document.querySelector("#dealer-blackjack-score").textContent = 0;
    document.querySelector("#your-blackjack-score").style.color = "white";
    document.querySelector("#dealer-blackjack-score").style.color = "white";
    document.querySelector("#blackjack-result").textContent = "Let's Play!";
    blackjackGame["turnsOver"] = false;
  }
}

function updateScore(card, activePlayer) {
  if (card === "AS") {
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] < 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  }
  // If adding 11 keeps me below 21, add. Ohterwise, add 1
  else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function dealerLogic() {
 
  blackjackGame['hit'] = false;
  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(800);
  }
  blackjackGame["turnsOver"] = true;
  let winner = computeWinner();
  showResult(winner);
  blackjackGame['isStand'] = false;
  
  // blackjackGame["turnsOver"] = false;
}

// Compute winner and return who just won

function computeWinner() {
  let winner;
  if (blackjackGame["turnsOver"] === true && blackjackGame['isStand'] === true ) {
    //  blackjackGame['isStand'] = false;
    if (YOU["score"] <= 21) {
      //condition: higher score than the dealer or when dealer busts but you're 21 or less
      if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
        blackjackGame["wins"]++;
        winner = YOU;
        
      } else if (YOU["score"] < DEALER["score"]) {
        blackjackGame["losses"]++;
        winner = DEALER;
        
      } else if (YOU["score"] === DEALER["score"]) {
        blackjackGame["draws"]++;
        
      }
      //condition when user bust but dealer does not bust
    } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
      blackjackGame["losses"]++;
      winner = DEALER;
      
      // condition when you AND the dealer busts
    } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
      blackjackGame["draws"]++;
      
    }

    console.log(blackjackGame);
    console.log("Winner is ", winner);
    return winner;
  }
  
}

function showResult(winner) {
  let message;

  if (blackjackGame["turnsOver"] === true && blackjackGame['isStand'] === true) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "You Won!";

      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You Lost!";

      lostSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "You Drew!";
    }

    document.querySelector("#blackjack-result").textContent = message;
    
  }
}
