/*
 * Create a list that holds all of your cards
 */
const cards = ["fa-diamond", "fa-diamond",
               "fa-paper-plane-o", "fa-paper-plane-o",
               "fa-anchor", "fa-anchor",
               "fa-bolt", "fa-bolt",
               "fa-cube", "fa-cube",
               "fa-leaf", "fa-leaf",
               "fa-bicycle", "fa-bicycle",
               "fa-bomb", "fa-bomb"]

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function generateCard(card){
    return `<li class="card" data-framework="${card}"><i class="fa ${card}"></i></li>`;
  }

function generateCardsHTML(){
    shuffle(cards);
    var cardsHTML = cards.map(generateCard);
    return cardsHTML.join('');
}

function displayCards(){
    var deck = document.querySelector(".deck");
    deck.innerHTML = generateCardsHTML();
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* start the game */
function gameInit(){
    displayCards();

    const allCards = document.querySelectorAll('.card');
    //add addEventListener to all cards
    allCards.forEach(card => card.addEventListener('click', flipCard));
};

/* star ratings*/
let stars= document.querySelector(".stars");

/* Reset to 5 stars */
function resetStarRating(){
const star = `<li><i class="fa fa-star"></i></li>`;
stars.innerHTML = star + star + star + star + star;
};

/* game variables*/
let hasFlippedCard = false;
let lockBoard = false;
let openCards = [];
let firstCard, secondCard;
let moveCounter = 0 ;
let gameOver = false;
let threeTry = 0; // when you makes 3 moves without matching a pair, you lose 1 star.
let isFirstClick = true; // First Click Indicator, to start the game

/* flip the card*/
function flipCard() {
// if Board is locked, can't flip the card
  if (lockBoard) return;
// if double click on the same card, you can't flip the same card
  if (this === firstCard) return;
// if game is over, you can't flip the card
  if (gameOver) return;
// if this is the first click, start the timer
  if(isFirstClick) {
      // Start our timer
      startTimer();
      // Change our First Click indicator's value
      isFirstClick = false;
  }

  this.classList.add('open', 'show');
  if (!hasFlippedCard){
    //first click
    hasFlippedCard = true;
    addOpenCards(this);
    firstCard =this;
  } else {
    //second click
    moveCounter ++;
    displayMove(moveCounter);
    addOpenCards(this);
    secondCard = this;

    //check for match
    checkForMatch();
  }
}

function addOpenCards(card){
  openCards.push(card);
}

function checkForMatch(){
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch? lockCards():unflipCards();
}

/*once cards are matchs, lock the matched cards*/
function lockCards(){
  firstCard.removeEventListener('click',flipCard);
  secondCard.removeEventListener('click',flipCard);
  setTimeout(()=>{
    firstCard.classList.remove('open','show');
    secondCard.classList.remove('open','show');
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    threeTry = 0;
    checkGameOver();
  },300);
}

/* If the flipped cards are not matched, unflip the the cards */
function unflipCards(){
  lockBoard = true;
  threeTry ++;
  setTimeout(()=>{
    firstCard.classList.remove('open','show');
    secondCard.classList.remove('open','show');
    openCards.splice(-2,2);
    if(threeTry ===3){
      if (stars.childElementCount >1){
        stars.removeChild(stars.lastElementChild);
      }
      threeTry= 0;
    }
    resetBoard();
  },1500);
}

function resetBoard(){
  [hasFlippedCard, lockBoard] = [false,false];
  [firstCard, secondCard] = [null, null];
}

function checkGameOver(){
  let cardsAllMatch = openCards.length === cards.length;
  cardsAllMatch? isOver():resetBoard();
}

function displayMove(moveCounter){
  let moves= document.querySelector(".moves");
  moves.innerHTML = moveCounter ;
}

function isOver(){
  // Stop our timer
  stopTimer();
  // Update model content
  updateAlertMsg();
  gameOveralert();
}

function updateAlertMsg(){
  let alertMsg= document.querySelector(".modal-body");
  alertMsg.innerHTML = `*** ${stars.childElementCount} stars ***
        \nYou finish game in ${totalSeconds} seconds with ${moveCounter} moves!
        \nWould you like to play agin?`;
};

function gameOveralert(){
  $("#exampleModal").modal();
  //check if patient wants to Replay
};

/* Timer */
let timerContainer = document.querySelector(".timer");
let liveTimer;
let totalSeconds = 0;

// Set the default value to the timer's container
timerContainer.innerHTML = 'Timer: ' + totalSeconds + 's';

function startTimer() {
   liveTimer = setInterval(function() {
       // Increase the totalSeconds by 1
       totalSeconds++;
       // Update the HTML Container with the new time
       timerContainer.innerHTML = 'Timer: ' + totalSeconds + 's';
   }, 1000);
}

function stopTimer() {
    clearInterval(liveTimer);
}

/* Restart Button */
const restartBtn = document.querySelector(".restart");
const yesBtn = document.querySelector("#YES");

function resetGame() {
    resetBoard();

    /* reset star ratings to 5 stars */
    resetStarRating();

    /* Reset timer */
    stopTimer();
    totalSeconds = 0;
    timerContainer.innerHTML = totalSeconds + "s";

    /* Reset moves count */
    moveCounter = 0 ;
    displayMove(moveCounter);

    /* Reset All other Game Variables */
    openCards = [];
    gameOver = false;
    threeTry = 0;
    isFirstClick = true;

    gameInit();
}

restartBtn.addEventListener("click", resetGame);
yesBtn.addEventListener("click",yesToPlay)

function yesToPlay(){
  $('button#YES').attr("data-dismiss","modal"); 
  resetGame();
};

gameInit();
