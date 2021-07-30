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


//create new game button click handler
window.onload = function() {
    id('startBtn').addEventListener("click", startGame);

    //add event listener to each number in numberController
    for (let index = 0; index < id("numberContainer").children.length; index++) {
      id("numberContainer").children[index].addEventListener("click", function() {
        //if selecting is not disabled,
        if (!disableSelect) {
          //if number is already selected,
          if (this.classList.contains("selected")) {
            //remove selection
            this.classList.remove("selected");
            selectedNum = null;
          } else {
            //deselect all numbers
            for (let i = 0; i < 9; i++) {
              id("numberContainer").children[i].classList.remove("selected");
            }
            //select it and update selectedNum
            this.classList.add("selected");
            selectedNum = this;
            updateMove();
          }
        }
      })
      
    }
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

//timer function
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

//generate the sudoku board when new game created
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
      tile.addEventListener("click", function(){
        //if selecting is not disabled,
        if (!disableSelect) {
          //if tile is already selected,
          if (tile.classList.contains("selected")) {
            //remove selection
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //deselect all selected
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //add selection and update
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
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

//update tiles with selected numbers
function updateMove() {
  //if a number and a tile are selected

  if (selectedTile && selectedNum) {
    //set the tile to correct number
    selectedTile.textContent = selectedNum.textContent;
    
    //if the selected number matches the number in the solution key
    if (checkCorrect(selectedTile)) {
      //deselect the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      //clear the selected variables
      selectedNum = null;
      selectedTile = null;

      //check if the board is completed
      if (checkDone()) {
        endGame();
      }

      //if the number does not match the number in the solution
    } else {
      //disable selecting new number for a second
      disableSelect = true;
      //make the tile turn red
      selectedTile.classList.add("incorrect");
      //run in one second
      setTimeout(function() {
        //subtract the lives by one
        lives--;
        //if no lives left, end the game
        if(lives === 0) {
          endGame();

          //if lives is not zero
        } else {
          //Update the lives display
          id("lives").textContent = "Lives Remaining: " + lives;
          //reenable selecting numbers and tile
          disableSelect = false;
        }
        //restore tile color and remove selected from both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");

        //clear the tiles text and variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

//checkDone func
function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") {
      return false;
    } 
  }
  return true;
}

//endGame function
function endGame() {
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);

  //dispay win or lose
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "You Lost 🥲";
  }else {
    id("lives").textContent = "You won! 🎊😌";
  }
}

function checkCorrect(tile) {
  // set solution based on the difficulty
  let solution;
  if (id("diff1").checked) {
    solution = easy[1];
  }else if(id("diff2").checked) {
    solution = medium[1];
  }else {
    solution = hard[1];
  }

  // if tile number is equal to the solution number
  if (solution.charAt(tile.id) === tile.textContent ) {
    return true;
  }else {
    return false;
  }
}

//clears privious board
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