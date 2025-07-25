const dailyWord = 'Daily'; //dummy word that will be replaced by a proper word
let guessedword = '';

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
            console.log('Delete last letter');
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
      break;
    }
    guessedword += squares[i].textContent.trim();
  }
}