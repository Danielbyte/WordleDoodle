
const dailyWord = 'Daily'; //dummy word that will be replaced by a proper word
let guessedword = '';
let currentRow = 1;
let currentSquareIndex = 0;
const maxWordLength = 5; //Max word is 5 (Player guesses a five letter word)
const alertContainer = document.querySelector('[data-alert-container]');
const FLIP_ANIMATION_DURATION = 400;
const keyboard = document.getElementById('keyboard-container');
let isWin = false;
let isGameOver = false;

createTiles();
startInteraction();

function startInteraction() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('click', keyClickEventHandler);
}

function stopInteraction() {
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('click', keyClickEventHandler);
}

function createTiles() {
    const gameBoard = document.getElementById('board');

    for (let index = 0; index < 30; index++) {
      const tile = document.createElement('div'); //Dynamically create a div tag
      tile.classList.add('tile'); //div tag class is a tile
      tile.setAttribute('data-index', index + 1);
      tile.textContent = '';
      gameBoard.appendChild(tile);
    }
  }

  function keyClickEventHandler() {
    const keys = document.querySelectorAll('.keyboard-row button');
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({target}) => {
        const key = target.getAttribute('data-key');
        switch(key)
        {
          case 'enter':
            submitGuess();
            break;
          case 'del':
            handleDeleteButtonPress();
            break;
          default:
            updateGuessedWord(key);
        }
      }  
    }
  }

  function handleKeyPress(e){
    if (isGameOver || isWin) return;
    
    switch(e.key){
      case 'Enter':
        submitGuess();
        break;
      case 'Backspace':
      case 'Delete':
        handleDeleteButtonPress();
        break;
      default:
        if (e.key.match(/^[A-Za-z]$/)) { //A regular expression that matches letters from A-Z
          updateGuessedWord(e.key.toLowerCase());
        }
        break;
    }
  }

  function submitGuess()
  {
    if (isWin || isGameOver) return;

    guessedword.trim();
    if (guessedword.length < maxWordLength) {
      showAlert('Not enough letters');
      const tiles = document.querySelectorAll('.tile');
      shakeTiles(tiles);
      return;
    }

    if (guessedword.toLowerCase() === dailyWord.toLowerCase()) {
      flipTiles('win');
      return;
    }

    const maxRows = 6;
    if (currentRow === maxRows) {
      flipTiles('lose');
      return;
    }

    //Add condition that checks whether word is valid
    
    //Flip tiles
    stopInteraction();
    flipTiles('next row');
    currentRow += 1; //move to the next row
    guessedword = ''; //Reset guessed word
  }

  function flipTiles(message) {
    const minTileIndex = getMinTileIndex(currentRow);
    const maxTileIndex = getMaxTileIndex(currentRow);
    const activeTiles = getActiveTiles(minTileIndex - 1, maxTileIndex); //Get active tiles
  
    activeTiles.forEach(tile => {
      const tileIndex = Number(tile.dataset.index);
      const tileColumn = getTileColumn(currentRow, tileIndex);
      const letter = tile.textContent.toLowerCase();
      let key = keyboard.querySelector(`[data-key="${letter}"i]`);
    
      setTimeout(() => {
          tile.classList.add('flip');
        }, (tileColumn * FLIP_ANIMATION_DURATION)/2);

        tile.addEventListener('transitionend', (event) => {
          tile.classList.remove('flip');
          if (letter === dailyWord[tileColumn -1].toLowerCase()) {
            tile.setAttribute('data-state', 'correct');
            key.setAttribute('data-state', 'correct');
          }

          else if (dailyWord.toLocaleLowerCase().includes(letter)) {
             tile.setAttribute('data-state', 'wrong-location');
             key.setAttribute('data-state', 'wrong-location')
          }

          else {
             tile.setAttribute('data-state', 'wrong');
             key.setAttribute('data-state', 'wrong');
          }

          if (tileIndex === maxTileIndex) {
            tile.addEventListener('transitionend', () => {
            startInteraction();
            if (message === 'win') winState();

            if (message === 'lose') loseState();
            //Need to check for winning/lose condition..
            }, {once: true})
          }
        }, {once: true});
      
    })
  }

  function winState()
  {
    showAlert('You win');
    isWin = true;
  }

  function loseState() {
    showAlert('You lost');
    isGameOver = true;
  }

  function getActiveTiles(startIndex, stopIndex) {
    const allTiles = document.querySelectorAll('.tile'); //Refernce to the entire game board
    return Array.from(allTiles).slice(startIndex, stopIndex); //Return array of all active tiles
  }

  function handleDeleteButtonPress()
  {
    document.querySelectorAll('.tile')
    .forEach((square)=> {
      const numberOfTries = computeRow(Number(square.dataset.index)) //Reverse engineer the number of tries

      if (square.dataset.index === currentSquareIndex.toString() && numberOfTries === currentRow) //Restrict deletion to current row
      {
        square.textContent = '';
        --currentSquareIndex;
      }
    })

  }

function updateGuessedWord(letter) {
  //Iterate throuh each square block of the game board and assign letter to corresponding board square
  guessedword = '';
  let squares = document.querySelectorAll('.tile');
  for(let i = 0; i < squares.length; i++)
  {
    const currentNumberOfTries = computeRow(squares[i].dataset.index);

    if (squares[i].textContent.trim() === '' && currentNumberOfTries === currentRow) //Only update word for the current row
    {
      squares[i].textContent = letter;
      guessedword += letter;
      currentSquareIndex = i + 1;
      currentRow = computeRow(currentSquareIndex);
      return;
    }

    if(currentNumberOfTries === currentRow && squares[i].textContent !== '') //Update word only for the current row
      guessedword += squares[i].textContent.trim();
  }
}

//Deduce the row
function computeRow(index) {
  let row = index/maxWordLength; //Calculate the current row undex/number of tries
  return Number.isInteger(row) ? row : Math.ceil(row); //Return row number/number of tries as an integer (whole number)
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement('div');
  alert.textContent = message;
  alert.classList.add('alert');
  alertContainer.prepend(alert); //add latest alert at the top

  if (!duration) return;

  setTimeout(() => {
    alert.classList.add('hide');
    alert.addEventListener('transitionend', () => {
      alert.remove();
    }); //Whenever our transition finishes, jst remove it
  }, duration)
}

function shakeTiles(tiles){
  tiles.forEach(tile => {
    row = computeRow(tile.dataset.index);
    if (tile.textContent != '' && row === currentRow) {
       tile.classList.add('shake'); //Add shake animation
       tile.addEventListener('animationend', () => {
       tile.classList.remove('shake'); //Remove class once animation is done
    }, {once: true}); //run shake animation only once
    }
  })
}

function getMinTileIndex(row) { //Get the index of the first tile of row in question
  return maxWordLength * row - 4;
}

function getMaxTileIndex(row) { //Get the index of the last tile of row in question
  return maxWordLength * row;
}

//Get the tile column
function getTileColumn(row, tileIndex) {
  return tileIndex - maxWordLength * (row -1);
}