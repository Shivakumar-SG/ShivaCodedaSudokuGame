//load boards
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

//creating vars
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

//function to element id
function id(id) {
    return document.getElementById(id);
}
function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}


//main
window.onload = function() {
    id('startBtn').addEventListener("click", startGame);
}

function startGame() {
  //Choose board difficulty
  let board;
  if (id("diff1").checked) {
    board = easy[0];
  }else if(id("diff2").checked) {
    board = medium[0];
  }else {
    board = hard[0];
  }

  //set lives
  lives = 5;
  disableSelect = false;
  id("lives").textContent = 'Lives Remaining: ' + lives;
  //crate board based on difficulty
  generateBoard(board);

  //starts timer
  startTimer();

  //sets theme based on input
  if( id("theme2").checked ) {
    qs("body").classList.add("dark");
  }else{
    qs("body").classList.remove("dark");
  }

  //show numberContainer
  id("numberContainer").classList.remove("hidden");
}

function startTimer() {
  //set time based on input
  if ( id("timer1").checked ) timeRemaining = 180;
  else if ( id("timer2").checked) timeRemaining = 300;
  else timeRemaining = 600;

  //set time for first time
  id("timer").textContent = timeConversion(timeRemaining);
  //set timer to update every second
  timer = setInterval(function() {
    timeRemaining--;
    //if no time remaining, end the Game
    if ( timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining);
  },1000)
}

//convert seconds to mm:ss format
function timeConversion(time) {
  let minutes = Math.floor(time/60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time%60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function generateBoard(board) {
  //clear previous board
  clearPrevious();

  //increment tile ids
  let idCount = 0;
  //create 81 tiles
  for (let index = 0; index < 81; index++) {
    //create new paragraph element
    let tile = document.createElement("p");
    //if the tile is not supposed to be blank,
    if (board.charAt(index) != "-") {
      //set tile text to correctnumber
      tile.textContent = board.charAt(index);
    } else {
      //add click event listener to tile element
    }
    //assign tile id
    tile.id  = idCount;
    //increment tile ids for next tile
    idCount++;
    //add tile class to all tiles
    tile.classList.add("tile");

    //add border 
    if( (tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBorder");
    }
    if( (tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6 ) {
      tile.classList.add("rightBorder");
    }

    // add tile to board
    id("board").appendChild(tile);
  }
}

function clearPrevious() {

  //access all the tiles
  let tiles = qsa(".tile");

  //remove each tiles
  for (let index = 0; index < tiles.length; index++) {
    tiles[index].remove();    
  }

  //if there is a timer clear it
  if(timer) clearTimeout(timer);

  //Deselect selected number
  for (let index = 0; index < id("numberContainer").children.length; index++) {
    id("numberContainer").children[index].classList.remove("selected");    
  }

  //clear selected variables
  selectedTile = null;
  selectedNum = null;
}