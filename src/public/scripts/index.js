document.addEventListener("DOMContentLoaded", () => {
  createSquares();
})

function createSquares() {
    const gameBoard = document.getElementById('board');

    for (let index = 0; index < 30; index++) {
      const square = document.createElement('div'); //Dynamically create a div tag
      square.classList.add('square'); //div tag class is a square
      square.setAttribute('id', index + 1);
      gameBoard.appendChild(square);
    }
  }