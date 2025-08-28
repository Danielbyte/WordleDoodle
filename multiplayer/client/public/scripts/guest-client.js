const socket = io();
let username = '';
let roomId = '';
let clientRoomPosition;
displayGuestMainMenu();

function displayGuestMainMenu() {
  addRoomCodeTextField();
  addUserNameTextField();
  addJoinRoomButton();
}

function addRoomCodeTextField() {
  let menuContainer = document.querySelector('.guest-main-menu-container');
  let roomCodeTextField = document.createElement('input');
  roomCodeTextField.type = 'text';
  roomCodeTextField.name = 'room-code';
  roomCodeTextField.id = 'room-code';
  roomCodeTextField.placeholder = 'Enter Room Code';
  menuContainer.appendChild(roomCodeTextField);

  menuContainer.appendChild(document.createElement('br'));
  menuContainer.appendChild(document.createElement('br'));
}

function addUserNameTextField() {
  let menuContainer = document.querySelector('.guest-main-menu-container');
  let userNameTextField = document.createElement('input');
  userNameTextField.type = 'text';
  userNameTextField.name = 'username';
  userNameTextField.id = 'username';
  userNameTextField.placeholder = 'Enter your Username';
  userNameTextField.appendChild(document.createElement('br'));
  userNameTextField.appendChild(document.createElement('br'));
  menuContainer.appendChild(userNameTextField);

  menuContainer.appendChild(document.createElement('br'));
  menuContainer.appendChild(document.createElement('br'));
}

function addJoinRoomButton() {
  let joinRoomButton = document.createElement('button');
  joinRoomButton.id = 'join-room';
  joinRoomButton.innerText = 'Join Room';

  //Add event listener to the join room button
  joinRoomButton.addEventListener('click', () => {
    //Clear the menu page
    let menu = document.querySelector('.guest-main-menu-container');
    //Get guest username
    username = document.getElementById('username').value;

    //guest joins room
    roomId = document.getElementById('room-code').value; //Reference to room code
    socket.emit('data', JSON.stringify({
      type: 'join',
      roomcode: roomId,
      username: username,
      isHost: false
    }));
    
    menu.remove();
    displayGameBoard();
  })

  //Append button to main menu container
  document.querySelector('.guest-main-menu-container').appendChild(joinRoomButton);
}

//Game board
function displayGameBoard() {
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
  gameBoardContainer.appendChild(board4); //chat panel this...

  document.body.appendChild(gameBoardContainer);
  displayGuestBoard();
  createTiles();
  addKeyBoard();
}

function displayGuestBoard() {
  let mainBoard = document.querySelector('.main-board');
  let boardContainer = document.createElement('div');
  boardContainer.id = 'board-container';
  let board = document.createElement('div');
  board.id = 'board';

  boardContainer.appendChild(board);
  let game = document.createElement('div');
  game.id = 'game';

  game.appendChild(boardContainer);
  mainBoard.appendChild(game);
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

  function addKeyBoard() {
    let keyBoardContainer = document.createElement('div');
    let keyBoard = `<div class="keyboard-row">
          <button data-key="q">q</button>
          <button data-key="w">w</button>
          <button data-key="e">e</button>
          <button data-key="r">r</button>
          <button data-key="t">t</button>
          <button data-key="y">y</button>
          <button data-key="u">u</button>
          <button data-key="i">i</button>
          <button data-key="o">o</button>
          <button data-key="p">p</button>
        </div>
        <div class="keyboard-row">
          <div class="spacer-half"></div>
          <button data-key="a">a</button>
          <button data-key="s">s</button>
          <button data-key="d">d</button>
          <button data-key="f">f</button>
          <button data-key="g">g</button>
          <button data-key="h">h</button>
          <button data-key="j">j</button>
          <button data-key="k">k</button>
          <button data-key="l">l</button>
          <div class="spacer-half"></div>
        </div>
        <div class="keyboard-row">
          <button data-key="enter" class="wide-button">Enter</button>
          <button data-key="z">z</button>
          <button data-key="x">x</button>
          <button data-key="c">c</button>
          <button data-key="v">v</button>
          <button data-key="b">b</button>
          <button data-key="n">n</button>
          <button data-key="m">m</button>
          <button data-key="del" class="wide-button">&#x232B;</button>
        </div>`;

    keyBoardContainer.innerHTML = keyBoard;


    let game = document.getElementById('game');
    game.appendChild(keyBoardContainer);
  }

  //Websocket server event listeners
  socket.on('message', (payload) => {
    let data = JSON.parse(payload);
    console.log(data);

    let guestPositionInRoom;
    let userName;
    switch(data.type) {
      case 'join':
        userName = data.username;
        if (userName === username) {
          clientRoomPosition = Number(data.position);
          return; //Some guard clause, no need to map board if username is the same as the main guest..
        }

        guestPositionInRoom = Number(data.position);
        if (guestPositionInRoom > clientRoomPosition) {
          guestPositionInRoom -= 2; //Displace by 2 positions (1 for the host and the other for the client)
        } else {
          guestPositionInRoom -= 1;
        }
        mapGuestBoards(guestPositionInRoom, userName);
        break;
    }
  });

  function mapGuestBoards(position, userName) {
    let board;
    switch(position) {
      case 1:
        board = document.querySelector('.board1');
        board.textContent = `@${userName}`;
        break;
      
        case 2:
          board = document.querySelector('.board2');
          board.textContent = `@${userName}`;
          break;

        case 3:
          board = document.querySelector('.board3');
          board.textContent = `@${userName}`;
          break;
    }
  }
  