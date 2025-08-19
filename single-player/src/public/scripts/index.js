let dailyWord = '';
let guessedword = '';
let currentRow = 1;
let currentSquareIndex = 0;
const maxWordLength = 5; //Max word is 5 (Player guesses a five letter word)
const alertContainer = document.querySelector('[data-alert-container]');
const FLIP_ANIMATION_DURATION = 500;
const keyboard = document.getElementById('keyboard-container');
let isWin = false;
let isGameOver = false;
const DANCE_ANIMATION_DURATION = 500;
const maxRows = 7;

createTiles();
startInteraction();
resetLocalStorageDaily();
scheduleMidnightReset();
recoverGameState();

function startInteraction() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('click', keyClickEventHandler);
}

function stopInteraction() {
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('click', keyClickEventHandler);
  saveInteractionState('inactive');
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

  async function submitGuess()
  {
    if (isWin || isGameOver) return;

    guessedword.trim();
    if (guessedword.length < maxWordLength) {
      showAlert('Not enough letters');
      const tiles = document.querySelectorAll('.tile');
      shakeTiles(tiles);
      return;
    }
    //Add condition that checks whether word is valid
    let response = await fetch('../api/v1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      guess: guessedword,
    })
  })

  let data = await response.json();
  let isValidWord = data.isValidWord;
    if (!isValidWord) {
      showAlert('Not a valid word');
      const tiles = document.querySelectorAll('.tile');
      shakeTiles(tiles);
      return;
    }
    
    //Flip tiles
    stopInteraction();
    await flipTiles();

    if (!isWin || !isGameOver)
      currentRow += 1; //move to the next row

    guessedword = ''; //Reset guessed word
    saveRow();
  }

  async function flipTiles() {
    const minTileIndex = getMinTileIndex(currentRow);
    const maxTileIndex = getMaxTileIndex(currentRow);
    const activeTiles = getActiveTiles(minTileIndex - 1, maxTileIndex); //Get active tiles
    let wordGuess = '';

    //Get the guessed word
    activeTiles.forEach(tile => {
      wordGuess += tile.textContent.toUpperCase();
    })
  
    await getTileStates(wordGuess);
  }

  async function winState(tiles)
  {
    isWin = true;
    stopInteraction();
    dancingTiles(tiles);
    showAlert('You win', 5000);
  }

  async function loseState() {
    showAlert(dailyWord.toLocaleUpperCase(), null);
    isGameOver = true;
    stopInteraction();
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
  //Iterate through each square block of the game board and assign letter to corresponding board square
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
    let row = computeRow(tile.dataset.index);
    if (tile.textContent != '' && row === currentRow) {
       tile.classList.add('shake'); //Add shake animation
       tile.addEventListener('animationend', () => {
       tile.classList.remove('shake'); //Remove class once animation is done
    }, {once: true}); //run shake animation only once
    }
  })
}

function dancingTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {

      tile.classList.add('dance'); //Add shake animation
      tile.addEventListener('animationend', () => {
      tile.classList.remove('dance'); //Remove class once animation is done
      }, {once: true}); //run shake animation only once
      }, index * DANCE_ANIMATION_DURATION/5)
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

async function getTileStates(userGuess) {
  await fetch('../api/v1/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      guess: userGuess,
      numbeOfTries: currentRow
    })
  })
  .then(response => {
    if(!response.ok) throw new Error('Failed to set tile states');
    return response.json();
  })
  .then(result => {

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

        tile.addEventListener('transitionend', async () => {
          tile.classList.remove('flip');
          tile.setAttribute('data-state', result.states[tileColumn-1]); //Set tile states
          key.setAttribute('data-state', result.states[tileColumn-1]); //Set keboard states
          
          if (tileIndex === maxTileIndex) {
            tile.addEventListener('transitionend', async () => {
            startInteraction();
            saveKeyboardState();
            saveBoardState();
            saveInteractionState('active');

            //Check if user has won
            if (result.winState) {
              await winState(activeTiles);
              stopInteraction();
            }

            if (currentRow === maxRows && result.winState === false) {
              dailyWord = result.word;//Only returned at the end of game (when player loses), else the backend API will return an empty string 
              await loseState();
            }
            }, {once: true})
          }
        }, {once: true});
    })
  })
}

function saveKeyboardState() {
  //Function will save keyboard state
  const keyboard = document.getElementById('keyboard-container');
  //Save keyboard state
  window.localStorage.setItem('keyboardState', keyboard.innerHTML);
  updateSaveStatus();
}

function saveBoardState() {
  //Function will save board state
  const board = document.getElementById('board-container');
  //Save game board state
  window.localStorage.setItem('boardState', board.innerHTML);
}

function updateSaveStatus() {
  window.localStorage.setItem('saveStatus', true);
}

function recoverGameState() {
  const saveStatus = window.localStorage.getItem('saveStatus'); //Retrieve save status

  if (!saveStatus) //Nothing saved, return (guard clause)
    return;

  //Recover game board status
  const savedBoard = window.localStorage.getItem('boardState');

  if (savedBoard) {
    document.getElementById('board-container').innerHTML = savedBoard;
  }

  //Recover keyboard status
  const savedKeyBoard = window.localStorage.getItem('keyboardState');

  if (savedKeyBoard) {
    document.getElementById('keyboard-container').innerHTML = savedKeyBoard;
  }

  //Recover interaction state
  const interaction = window.localStorage.getItem('interactionState');
  
  if (interaction === 'active') {
    //Recover row
    let row = window.localStorage.getItem('row');

    if (row) currentRow = Number(row); //Recover row

    startInteraction();
  } else if (interaction === 'inactive') stopInteraction();
}

function saveInteractionState(state) {
  window.localStorage.setItem('interactionState', state);
}

function saveRow() {
  window.localStorage.setItem('row', currentRow);
}

//Function resets the saved game states so that user is allowed to play the following day
function resetLocalStorageDaily() {
  /*
   * Store last reset date
   * on page load, check if today's date is similar to last reset date
   * if they are not, clear local storage and update last reset date
   */

  const today = new Date().toDateString();
  let lastDayOfReset = window.localStorage.getItem('lastResetDate');

  if (lastDayOfReset !== today) {
    //clear local storage
    window.localStorage.clear(); //Could clear specific keys, I haven't found a use case that requires that as of yet...

    //Update last reset date
    window.localStorage.setItem('lastResetDate', today);
  }
}

//This function will schedule a daily reset at 12 AM to cater for a use case where application remains open overnight
function scheduleMidnightReset() {
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);

  const msUntilMidinight = nextMidnight - now; //get time in miliseconds before next midnight (12 AM)

  setTimeout(async() => {
    window.localStorage.clear();
    window.localStorage.setItem('lastResetDate', now.toDateString());

    //Reset the word of the day
    await fetch('../api/v1/reset', {
      method: 'POST'
    }).then ((response) => {
      if(response.ok)
        return response.json();
      else
        throw 'failed'
    }).catch( (e) => {
      alert(e);
    });

    //Re-schechule again for next midnight
    scheduleMidnightReset();
  }, msUntilMidinight);
}