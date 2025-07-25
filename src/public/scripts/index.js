const dailyWord = 'Daily'; //dummy word that will be replaced by a proper word
let guessedword = '';
let currentRow = 0;
let currentSquareIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  keyPressEventHandler();
})

function createSquares() {
    const gameBoard = document.getElementById('board');

    for (let index = 0; index < 30; index++) {
      const square = document.createElement('div'); //Dynamically create a div tag
      square.classList.add('square'); //div tag class is a square
      square.setAttribute('data-index', index + 1);
      square.textContent = '';
      gameBoard.appendChild(square);
    }
  }

  function keyPressEventHandler() {
    const keys = document.querySelectorAll('.keyboard-row button');
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({target}) => {
        const key = target.getAttribute('data-key');
        switch(key)
        {
          case 'enter':
            handleEnterKeyPress();
            break;
          case 'del':
            handleDeleteButtonPress();
            break;
          default:
            updateGuessedWords(key);
        }
      }  
    }
  }

  function handleEnterKeyPress()
  {
    if (guessedword.length < 5)
      console.log('Word too short!!!');

    if (guessedword.toLowerCase() === dailyWord.toLowerCase())
      console.log('You win!!!');
  }

  function handleDeleteButtonPress()
  {
    document.querySelectorAll('.square')
    .forEach((square)=> {
      console.log(currentSquareIndex.toString());
      if (square.dataset.index === currentSquareIndex.toString())
      {
        square.textContent = '';
        --currentSquareIndex;
      }
    })

  }

function updateGuessedWords(letter) {
  //Iterate throuh each square block of the game board and assign letter to corresponding board square
  guessedword = '';
  let squares = document.querySelectorAll('.square');
  for(let i = 0; i < squares.length; i++)
  {
    if (squares[i].textContent.trim() === '')
    {
      squares[i].textContent = letter;
      guessedword += letter;
      currentSquareIndex = i + 1;
      currentRow = computeRow(currentSquareIndex);
      break;
    }
    guessedword += squares[i].textContent.trim();
  }
}

//Deduce the row
function computeRow(index) {
  const maxNumberOfColumns = 5; //Max word is 5 (Player guesses a five letter word)

  let row = index/maxNumberOfColumns; //Calculate the current row undex/number of tries
  return Number.isInteger(row) ? row : Math.ceil(row); //Return row number/number of tries as an integer (whole number)
}