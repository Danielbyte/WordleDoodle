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
        updateGuessedWords(key);
      }  
    }
  }

function updateGuessedWords(letter) {
  //Iterate throuh each square block of the game board and assign letter to corresponding board square
  let squares = document.querySelectorAll('.square');
  for(let i = 0; i < squares.length; i++)
  {
    if (squares[i].textContent.trim() === '')
    {
      squares[i].textContent = letter;
      break;
    }
  }
}