//This client file will be served by Express server (app.js)
const socket = io();
let username = '';
let maxOpponents = 4;
const maxWordLength = 5; //Max word is 5 (Player guesses a five letter word)

initialiseBoard();

//Event listeners, this was will be for errors returned by the websocket server
socket.on('response', (payload) => {
  let data = JSON.parse(payload);
  console.log(data);
});


//This event listener will handle successful responses from the websocket server
socket.on('message', (payload) => {
  let data = JSON.parse(payload);
  console.log(data);

  //Map guest(s) to board the minute they join
  /*
   * Flow of things:
   * socket server should respond with the guest's number (n) in the room, i.e, if the guest is third person to join room => server should send a 3
   * n will then be used to map the game boards.
   * That is, n = 1 => map board to board1...
   */
  let guestPositionInRoom;
  switch (data.type) {
    case 'join':
      //guestPositionInRoom = Number(data.position) - 1;//Subtract 1 to exclude the host
      break;

    case 'board_broadcast':
      guestPositionInRoom = data.position - 1;
      updateGuestBoardStates(guestPositionInRoom, data.placements, data.row);
      break;
  }
});

function updateGuestBoardStates(position, states, row) {
  switch (position) {
    case 1:
      updateGuestBoard('tile1', states, row);
      break;

    case 2:
      updateGuestBoard('tile2', states, row);
      break;

    case 3:
      updateGuestBoard('tile3', states, row);
      break;

    case 4:
      updateGuestBoard('tile4', states, row)
      break;

    default:
      break;
  }
}

function updateGuestBoard(tileClass, states, row) {
  const minTileIndex = getMinTileIndex(row);
  const maxTileIndex = getMaxTileIndex(row);
  const activeTiles = getActiveTiles(minTileIndex - 1, maxTileIndex, tileClass); //Get active tiles

  activeTiles.forEach(tile => {
    const tileIndex = Number(tile.dataset.index);
    const tileColumn = getTileColumn(row, tileIndex);
    tile.setAttribute('data-state', states[tileColumn - 1])
  })
}

function getMinTileIndex(row) { //Get the index of the first tile of row in question
  return maxWordLength * row - 4;
}

function getMaxTileIndex(row) { //Get the index of the last tile of row in question
  return maxWordLength * row;
}

function getActiveTiles(startIndex, stopIndex, tileClass) {
  const allTiles = document.querySelectorAll(`.${tileClass}`); //Refernce to the entire game board
  return Array.from(allTiles).slice(startIndex, stopIndex); //Return array of all active tiles
}

//Get the tile column
function getTileColumn(row, tileIndex) {
  return tileIndex - maxWordLength * (row - 1);
}

function initialiseBoard() {
  loadGameBoardContainer();
  
  try {
    fetch('/multiplayer/username', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          username = data.username;
          createRoom(username);
          displayHostBoard();
        }
      })
  } catch (err) {
    console.error(err);
  }
}

function loadGameBoardContainer() {
  let gameBoardContainer = document.querySelector('.game-board-container');

  //The rest of the boards
  let board1 = document.createElement('div');
  board1.classList.add('board1');
  gameBoardContainer.appendChild(board1);

  let board2 = document.createElement('div');
  board2.classList.add('board2');
  gameBoardContainer.appendChild(board2);

  let chat = document.createElement('div');
  chat.classList.add('chat');
  gameBoardContainer.appendChild(chat);

  let board3 = document.createElement('div');
  board3.classList.add('board3');
  gameBoardContainer.appendChild(board3);

  let board4 = document.createElement('div');
  board4.classList.add('board4');
  gameBoardContainer.appendChild(board4);

  document.body.appendChild(gameBoardContainer);
  createGuestBoards();
  configureGuestBoards();
}

function createGuestBoards() {
  //Create mini-boards for the other guest opponents
  for (let i = 1; i <= maxOpponents; i++) {
    createBoard(`board${i}`, `board-${i}`);
  }
}

function createBoard(configBoard, configBoardId) {
  let boardToBeConfigured = document.querySelector(`.${configBoard}`);
  let boardContainer = document.createElement('div');
  boardContainer.id = 'board-container';
  let board = document.createElement('div');
  board.id = configBoardId;

  boardContainer.appendChild(board);
  let game = document.createElement('div');
  game.id = 'game';
  game.appendChild(boardContainer);
  boardToBeConfigured.appendChild(game);
}

function configureGuestBoards() {
  for (let i = 1; i <= maxOpponents; i++)
    configureBoard(`board-${i}`, `tile${i}`);
}

function configureBoard(boardId, tileClass) {
  const gameBoard = document.getElementById(boardId);

  for (let index = 0; index < 30; index++) {
    const tile = document.createElement('div'); //Dynamically create a div tag
    tile.classList.add(tileClass); //div tag class is a tile
    tile.setAttribute('data-index', index + 1);
    tile.textContent = '';
    gameBoard.appendChild(tile);
  }
}

// Function that allows the host to create a room
function createRoom(username) {
  socket.emit('data', JSON.stringify({
    type: 'create',
    username: username,
    isHost: true
  }));
}

function displayHostBoard() {
  createWordOfTheDayTextField();
  createStartGameButton();
}

function createWordOfTheDayTextField() {
  let hostBoard = document.querySelector('.main-board');
  let hostBoardContainer = document.createElement('div');
  hostBoardContainer.classList.add('host-board-container');


  let wordOfTheDayTextField = document.createElement('input');
  wordOfTheDayTextField.id = 'word-of-the-day';
  wordOfTheDayTextField.name = 'word-of-the-day';
  wordOfTheDayTextField.placeholder = 'Set word';
  hostBoardContainer.appendChild(wordOfTheDayTextField);

  hostBoardContainer.appendChild(document.createElement('br'));
  hostBoardContainer.appendChild(document.createElement('br'));
  hostBoard.appendChild(hostBoardContainer);
}

function createStartGameButton() {
  let hostBoardContainer = document.querySelector('.host-board-container');
  let hostBoard = document.querySelector('.main-board');

  let startGameButton = document.createElement('button');
  startGameButton.id = 'btn-start-game';
  startGameButton.innerText = 'Start Game';

  startGameButton.addEventListener('click', () => {
    const _word = document.getElementById('word-of-the-day').value;
    socket.emit('data', JSON.stringify({
      type: 'start_game',
      username: username,
      isHost: true,
      word: _word
    }));
  });

  hostBoardContainer.appendChild(startGameButton);
  hostBoard.appendChild(hostBoardContainer);
}