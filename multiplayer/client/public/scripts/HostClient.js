//This client file will be served by Express server (app.js)
const socket = io();
let isInitialised = false;
let username = '';

initialiseBoard();
/*
document.getElementById('board-state').onclick = () => {
  const userName = document.getElementById('username').value;
  const testBoardState = '<div class="tile" data-index="23"></div><div class="tile" data-index="24"></div><div class="tile" data-index="25"></div><div class="tile" data-index="26"></div><div class="tile" data-index="27"></div><div class="tile" data-index="28"></div><div class="tile" data-index="29"></div><div class="tile" data-index="30"></div>';

  socket.emit('data', JSON.stringify({
    type: 'update_board_state_to_room',
    username: userName,
    board: testBoardState
  }));
};*/

/*
document.getElementById('btn-submit-guess').onclick = () => {
  const userName = document.getElementById('username').value;
  const testGuess = document.getElementById('input-user-guess').value;

  socket.emit('data', JSON.stringify({
    type: 'submit_guess',
    guess: testGuess,
    username: userName
  }));
}*/

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
  switch(data.type) {
    case 'join':
      guestPositionInRoom = Number(data.position) - 1;//Subtract 1 to exclude the host
      mapGuestBoard(guestPositionInRoom);
      break;
  }
});

function mapGuestBoard(position) {
  //let gameBoard = document.querySelector('.game-board-container');
  let board;
  switch(position) {
    case 1:
      board = document.querySelector('.board1');
      board.textContent = 'Player 1'
      break;
  }
}

function initialiseBoard() {
  if (isInitialised)
    return;
 
  //Add the main menu page
  addUserNameTextField();
  addCreateRoomButton();

  isInitialised = true;
}

function addUserNameTextField() {
  let mainMenu = document.getElementById('main-menu');

    //Create username field and create room button
  let usernameField = document.createElement('input');
  usernameField.type = 'text';
  usernameField.classList.add('username');
  usernameField.name = 'username';
  usernameField.id = 'user-name';
  usernameField.placeholder = 'Enter your username';
  mainMenu.appendChild(usernameField);

  mainMenu.appendChild(document.createElement('br'));
  mainMenu.appendChild(document.createElement('br'));  
}

function addCreateRoomButton() {
  //Get the main-menu tag
  let mainMenu = document.getElementById('main-menu');
  let createRoomBtn = document.createElement('button');
  createRoomBtn.id = 'btn-create-room';
  createRoomBtn.innerText = 'Create Room';

  //Add a click event listener to to the button
  createRoomBtn.addEventListener('click', () => {
    createRoom(); //create room before displaying the multiplayer game-play page
    document.getElementById('main-menu').remove(); //Remove the main menu div => main menu page
    loadGameBoardContainer(); //Load multiplayer game loayout with all the boards
    displayHostBoard();
  })

  mainMenu.appendChild(createRoomBtn);
}

function loadGameBoardContainer() {
  let gameBoardContainer = document.createElement('div');
  gameBoardContainer.classList.add('game-board-container');
  
  //Add Player boards
  let mainBoard = document.createElement('div');
  mainBoard.classList.add('main-board');
  gameBoardContainer.appendChild(mainBoard); //Should probably assign the username as the board id...

  //The rest of the boards
  let board1 = document.createElement('div');
  board1.classList.add('board1');
  gameBoardContainer.appendChild(board1);

  let board2 = document.createElement('div');
  board2.classList.add('board2');
  gameBoardContainer.appendChild(board2);

  let board3 = document.createElement('div');
  board3.classList.add('board3');
  gameBoardContainer.appendChild(board3);

  let board4 = document.createElement('div');
  board4.classList.add('board4');
  gameBoardContainer.appendChild(board4);

  document.body.appendChild(gameBoardContainer);
}

// Function that allows the host to create a room
function createRoom() {
  username = document.getElementById('user-name').value;
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