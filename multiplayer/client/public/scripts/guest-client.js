const socket = io();
let username = '';
let roomId = '';
let clientRoomPosition;
let guessedword = '';
let currentRow = 1;
let currentSquareIndex = 0;
const maxWordLength = 5; //Max word is 5 (Player guesses a five letter word)
let isWin = false;
let isGameOver = false;
let gameStarted = false;
let isTyping = false;
//const alertContainer = document.querySelector('[data-alert-container]');
const FLIP_ANIMATION_DURATION = 500;
let maxOpponents = 3;
let formFieldsValid;

displayGuestMainMenu();

function displayGuestMainMenu() {
  addRoomCodeTextField();
  addUserNameTextField();
  addJoinRoomButton();
}

function addRoomCodeTextField() {
  //Create input field container
  let inputField = document.createElement('div');
  inputField.classList.add('input-field');

  let menuContainer = document.querySelector('.guest-main-menu-container');
  let roomCodeTextField = document.createElement('input');
  roomCodeTextField.type = 'text';
  roomCodeTextField.name = 'room-code';
  roomCodeTextField.id = 'room-code';
  roomCodeTextField.classList.add('room-code');
  roomCodeTextField.classList.add()
  roomCodeTextField.placeholder = 'Enter Room Code';

  inputField.appendChild(roomCodeTextField);

  //Error message container
  let errorContainer = document.createElement('div');
  errorContainer.classList.add('error-message');
  errorContainer.id = 'js-roomcode-error-card';
  //Append the turtle image
  let turtleImg = document.createElement('img');
  turtleImg.src = '/cdn/images/tortoise.png';
  turtleImg.loading = 'lazy';
  errorContainer.appendChild(turtleImg);
  //Append the error message paragraph to hold the actual message
  let errorMsgParagraph = document.createElement('p');
  errorMsgParagraph.id = 'js-room-code-error-message';
  errorContainer.appendChild(errorMsgParagraph);

  //Append the error message container to input field
  inputField.appendChild(errorContainer);

  menuContainer.appendChild(inputField);
}

function addUserNameTextField() {
  //Create input field container
  let inputField = document.createElement('div');
  inputField.classList.add('input-field');

  let menuContainer = document.querySelector('.guest-main-menu-container');
  let userNameTextField = document.createElement('input');
  userNameTextField.type = 'text';
  userNameTextField.name = 'username';
  userNameTextField.id = 'username';
  userNameTextField.classList.add('username');
  userNameTextField.placeholder = 'Enter your Username';
  inputField.appendChild(userNameTextField);

  //Error message container
  let errorContainer = document.createElement('div');
  errorContainer.classList.add('error-message');
  errorContainer.id = 'js-username-error-card';
  //Append turtle image
  let turtleImg = document.createElement('img');
  turtleImg.src = '/cdn/images/tortoise.png';
  turtleImg.loading = 'lazy';
  errorContainer.appendChild(turtleImg);
  //Append error message paragraph
  const errorMsgParagraph = document.createElement('p');
  errorMsgParagraph.id = 'js-username-error-message';
  errorContainer.appendChild(errorMsgParagraph);

  //Append the error message container to the input filed
  inputField.appendChild(errorContainer);

  menuContainer.appendChild(inputField);
}

function addJoinRoomButton() {
  let joinRoomButton = document.createElement('button');
  joinRoomButton.id = 'join-room';
  joinRoomButton.classList.add('btn-join-room');
  joinRoomButton.innerText = 'Join Room';

  //Add event listener to the join room button
  joinRoomButton.addEventListener('click', () => {
    //Clear the menu page
    let menu = document.querySelector('.guest-main-menu-container');
    //Get guest username
    username = document.getElementById('username').value;

    formFieldsValid = true;

    validateRoomCode();
    validateUsername();

    if (!formFieldsValid) return;

    //guest joins room
    roomId = document.getElementById('room-code').value; //Reference to room code
    socket.emit('data', JSON.stringify({
      type: 'join',
      roomcode: roomId,
      username: username,
      isHost: false
    }), (response) => {
      if (!response.success) { //Check if this response was successful
        const message = response.message;

        if (message.toLowerCase().startsWith('username')) { //Checks if error response pertains the username
          const roomcode = document.getElementById('username'); //Reference to the entered roomcode
          const errMsgContainer = document.getElementById('js-username-error-card');
          const messageParagraph = document.getElementById('js-username-error-message');
          setError(roomcode, errMsgContainer, messageParagraph, message);
          return;
        }
        const roomcode = document.getElementById('room-code'); //Reference to the entered roomcode
        const errMsgContainer = document.getElementById('js-roomcode-error-card');
        const messageParagraph = document.getElementById('js-room-code-error-message');
        setError(roomcode, errMsgContainer, messageParagraph, message);
      } else {
        menu.remove();
        document.body.style.all = 'unset';
        document.body.style.backgroundColor = '#0e0f11';
        displayGameBoard();
      }
    });
  })

  //Append button to main menu container
  document.querySelector('.guest-main-menu-container').appendChild(joinRoomButton);
}

const validateUsername = () => {
  const username = document.getElementById('username');
  const errMsgContainer = document.getElementById('js-username-error-card');
  const messageParagraph = document.getElementById('js-username-error-message');

  // Can only contain letters, numbers and the two special characters above
  if (!username.value.trim()) {
    const message = 'Oops! Fill in username';
    setError(username, errMsgContainer, messageParagraph, message);
    return;
  }

  //Regex to check if username only contains letters, numbers and _, - characters
  const usernameRegex = /^[A-Za-z0-9_-]+$/;
  if (!usernameRegex.test(username.value.trim())) {
    const message = 'Woah! no special characters';
    setError(username, errMsgContainer, messageParagraph, message);
    return;
  }

  //Username cannot start with special characters
  if ((username.value.trim()).startsWith('-') || (username.value.trim()).startsWith('_')) {
    const message = 'Username cannot start with _ or -';
    setError(username, errMsgContainer, messageParagraph, message);
    return;
  }

  resetError(username, errMsgContainer);
}

function validateRoomCode() {
  const roomcode = document.getElementById('room-code'); //Reference to the entered roomcode
  const errMsgContainer = document.getElementById('js-roomcode-error-card');
  const messageParagraph = document.getElementById('js-room-code-error-message');

  //Field cannot be empty
  if (!roomcode.value.trim()) {
    const message = 'Oops! Please provide room code';
    setError(roomcode, errMsgContainer, messageParagraph, message);
    return;
  }

  if ((roomcode.value.trim()).length < 10) { //the roomcode is 10 chars
    const message = 'I\'ve got your back! Room code too short';
    setError(roomcode, errMsgContainer, messageParagraph, message);
    return;
  }

  if ((roomcode.value.trim()).length > 10) { //the roomcode is 10 chars
    const message = 'I\'ve got your back! Room code too long';
    setError(roomcode, errMsgContainer, messageParagraph, message);
    return;
  }

  resetError(roomcode, errMsgContainer);
}

const setError = (fieldElement, messageContainer, messageParagraph, message) => {
  const fieldElementError = fieldElement.nextElementSibling;
  fieldElement.style.borderColor = '#FF0000';
  fieldElementError.style.display = 'flex';
  messageContainer.style.display = 'flex';
  messageParagraph.innerText = message;
  formFieldsValid = false;
}

const resetError = (fieldElement, messageContainer) => {
  const fieldElementError = fieldElement.nextElementSibling;
  fieldElementError.style.display = 'none';
  messageContainer.style.display = 'none';
  fieldElement.style.borderColor = '#4CAF50';
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
  addOpponentBoardClasses(gameBoardContainer);

  document.body.appendChild(gameBoardContainer);
  createGuestBoards();
  configureBoard('board', 'tile');
  configureOpponentBoards();
  configureChat();
  addKeyBoard();
}

function configureChat() {
  addChatHeading();
  addChatField();
  addInputField();
}

function addInputField() {
  const chat = document.querySelector('.chat-section');

  const messageInputSection = document.createElement('div');
  messageInputSection.classList.add('message-input-section');
  messageInputSection.id = 'message-input-section';

  const relMessageSection = document.createElement('div');
  relMessageSection.classList.add('rel-message-input-section');
  relMessageSection.id = 'rel-message-input-section';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.id = 'message-input';
  inputField.placeholder = 'Send message';
  inputField.classList.add('chat-message-input');
  relMessageSection.appendChild(inputField);
  messageInputSection.appendChild(relMessageSection);

  const sendButton = document.createElement('button');
  sendButton.id = 'send-message-btn';
  sendButton.classList.add('send-message-btn');

  const sendMsgIcon = document.createElement('img');
  sendMsgIcon.src = '/cdn/images/send-msg.png'
  sendMsgIcon.classList.add('send-msg-icon');
  sendButton.appendChild(sendMsgIcon);
  relMessageSection.appendChild(sendButton);
  messageInputSection.appendChild(relMessageSection);

  chat.appendChild(messageInputSection);
  addSendMessageButtonEventListener();
  addMessageFieldEventListener();
}

function addMessageFieldEventListener() {
  document.getElementById('message-input').addEventListener('input', () => {
    isTyping = true;
    stopInteraction();
  });

  document.getElementById('message-input').addEventListener('click', () => {
    isTyping = true;
    stopInteraction();
  });
}

function addSendMessageButtonEventListener() {
  document.getElementById('send-message-btn').addEventListener('click', () => {
    let messageInputField = document.getElementById('message-input');
    const message = messageInputField.value;

    if (!message) return; //If there is no message enetered, return (No need to send message)

    const bubbleClass = 'left-bubble';
    addMessageToChatUI(bubbleClass, message, username);
    messageInputField.value = ''; //Clear the message field
    broadcastMessageToRoom(message);
  });
}

function broadcastMessageToRoom(message) {
  socket.emit('data', JSON.stringify({
    type: 'chat_message',
    username: username,
    chatMessage: message,
    roomcode: roomId
  }));
}

function addMessageToChatUI(bubbleClass, message, userName) {
  const messageContainer = document.getElementById('message-container');

  const messageBubble = `<li class = "${bubbleClass}">
                          <p class = "message-paragraph">
                            ${message}
                            <span class = "message-info">@${userName}</span>
                          </p>
                        </li>`;

  messageContainer.innerHTML += messageBubble;
  scrollToBottom();
}

function scrollToBottom() {
  let msgField = document.getElementById('message-container');
  msgField.scrollTo(0, msgField.scrollHeight);
}

function addChatField() {
  const chat = document.querySelector('.chat-section');

  const messageField = document.createElement('div');
  messageField.classList.add('message-field');

  //Unordered list to hold chats
  const messageContainer = document.createElement('ul');
  messageContainer.classList.add('message-container');
  messageContainer.id = 'message-container';

  messageField.appendChild(messageContainer);
  chat.appendChild(messageField);
}

function addChatHeading() {
  const chat = document.querySelector('.chat-section');

  const heading = document.createElement('div');
  heading.classList.add('heading');

  const turtleImage = document.createElement('img');
  turtleImage.src = '/cdn/images/tortoise.png';
  turtleImage.classList.add('chat-turtle');
  heading.appendChild(turtleImage);

  const title = document.createElement('p');
  title.classList.add('chat-title');
  title.innerText = 'Chat';
  heading.appendChild(title);

  chat.appendChild(heading);
}

function addOpponentBoardClasses(gameBoardContainer) {
  let board;
  for (let i = 1; i <= maxOpponents; i++) { //Add one to include chats field
    board = document.createElement('div');
    board.classList.add(`board${i}`);
    gameBoardContainer.appendChild(board);
  }

  let chatSection = document.createElement('div');
  chatSection.classList.add('chat-section');
  gameBoardContainer.appendChild(chatSection);
}

function configureOpponentBoards() {
  for (let i = 1; i <= maxOpponents; i++)
    configureBoard(`board-${i}`, `tile${i}`);
}

function createGuestBoards() {
  createBoard('main-board', 'board'); //Create board for the main guest board

  //Create mini-boards for the other guest opponents
  for (let i = 1; i <= maxOpponents; i++) {
    createBoard(`board${i}`, `board-${i}`);
  }

  document.querySelector('.main-board').addEventListener('click', () => {
    if (gameStarted) {
      startInteraction();
      isTyping = false;
    }
  })
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

function addKeyBoard() {
  let keyBoardContainer = document.createElement('div');
  keyBoardContainer.id = 'keyboard-container';
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

  let guestPositionInRoom;
  let userName;
  let verifiedPlacements;

  switch (data.type) {
    case 'join':
      userName = data.username;
      if (userName === username) {
        clientRoomPosition = Number(data.position);
      }
      break;

    case 'start_game':
      //Sync guest boards at the start of game
      gameStarted = true;
      startInteraction();
      break;

    case 'placement_verification':
      verifiedPlacements = data.placement;
      isWin = data.isWin;
      updateStatesAndFlipTiles(verifiedPlacements);
      broadcastBoardState(verifiedPlacements);

      if(isWin) {
        displayVictoryCard();
      }

      if (!isWin || !isGameOver)
        currentRow += 1;

      guessedword = '';
      break;

    case 'board_broadcast':
      guestPositionInRoom = getGuestPositionInRoom(data.position);
      updateGuestBoardStates(guestPositionInRoom, data.placements, data.row);
      break;

    case 'chat_message':
      addMessageToChatUI('right-bubble', data.chat, data.username); //Should be right bubble (yellow)
      break;
  }
});

function getGuestPositionInRoom(guestPositionInRoom) {
  if (guestPositionInRoom > clientRoomPosition) {
    guestPositionInRoom -= 2;
  } else {
    guestPositionInRoom -= 1;
  }
  return guestPositionInRoom;
}

function updateGuestBoardStates(position, states, row) {
  switch (position) {
    case 1:
      updateOpponentBoard('tile1', states, row);
      break;

    case 2:
      updateOpponentBoard('tile2', states, row);
      break;

    case 3:
      updateOpponentBoard('tile3', states, row);
      break;

    default:
      break;
  }
}

function broadcastBoardState(verifiedPlacements) {
  socket.emit('data', JSON.stringify({
    type: 'broadcast_board_state_to_room',
    username: username,
    placements: verifiedPlacements,
    position: clientRoomPosition,
    row: currentRow
  }));
}

function updateOpponentBoard(tileClass, states, row) {
  const minTileIndex = getMinTileIndex(row);
  const maxTileIndex = getMaxTileIndex(row);
  const activeTiles = getActiveTiles(minTileIndex - 1, maxTileIndex, tileClass); //Get active tiles

  activeTiles.forEach(tile => {
    const tileIndex = Number(tile.dataset.index);
    const tileColumn = getTileColumn(row, tileIndex);
    tile.setAttribute('data-state', states[tileColumn - 1])
  })
}

function updateStatesAndFlipTiles(states) {
  const minTileIndex = getMinTileIndex(currentRow);
  const maxTileIndex = getMaxTileIndex(currentRow);
  const activeTiles = getActiveTiles(minTileIndex - 1, maxTileIndex, 'tile'); //Get active tiles
  const keyboard = document.getElementById('keyboard-container');

  activeTiles.forEach(tile => {
    const tileIndex = Number(tile.dataset.index);
    const tileColumn = getTileColumn(currentRow, tileIndex);
    const letter = tile.textContent.toLowerCase();
    let key = keyboard.querySelector(`[data-key="${letter}"i]`);

    setTimeout(() => {
      tile.classList.add('flip');
    }, (tileColumn * FLIP_ANIMATION_DURATION) / 2);

    tile.addEventListener('transitionend', () => {
      tile.classList.remove('flip');
      tile.setAttribute('data-state', states[tileColumn - 1]); //Set tile states
      key.setAttribute('data-state', states[tileColumn - 1]); //Set keboard states

      if (tileIndex === maxTileIndex) {
        tile.addEventListener('transitionend', () => {
          startInteraction();
        }, { once: true })
      }
    }, { once: true });
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

function startInteraction() {
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('click', keyClickEventHandler);
}

function stopInteraction() {
  document.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('click', keyClickEventHandler);
}

function handleKeyPress(e) {
  if (isGameOver || isWin || !gameStarted) return;

  switch (e.key) {
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

function updateGuessedWord(letter) {
  //Iterate through each square block of the game board and assign letter to corresponding board square
  if (isTyping) return;
  guessedword = '';
  let squares = document.querySelectorAll('.tile');
  for (let i = 0; i < squares.length; i++) {
    const currentNumberOfTries = computeRow(squares[i].dataset.index);

    if (squares[i].textContent.trim() === '' && currentNumberOfTries === currentRow) //Only update word for the current row
    {
      squares[i].textContent = letter;
      guessedword += letter;
      currentSquareIndex = i + 1;
      currentRow = computeRow(currentSquareIndex);
      return;
    }

    if (currentNumberOfTries === currentRow && squares[i].textContent !== '') //Update word only for the current row
      guessedword += squares[i].textContent.trim();
  }
}

//Deduce the row
function computeRow(index) {
  let row = index / maxWordLength; //Calculate the current row undex/number of tries
  return Number.isInteger(row) ? row : Math.ceil(row); //Return row number/number of tries as an integer (whole number)
}

function handleDeleteButtonPress() {
  document.querySelectorAll('.tile')
    .forEach((square) => {
      const numberOfTries = computeRow(Number(square.dataset.index)) //Reverse engineer the number of tries

      if (square.dataset.index === currentSquareIndex.toString() && numberOfTries === currentRow) //Restrict deletion to current row
      {
        square.textContent = '';
        --currentSquareIndex;
      }
    })
}

async function submitGuess() {
  if (isWin || isGameOver) return;

  guessedword.trim();
  if (guessedword.length < maxWordLength) {
    //showAlert('Not enough letters');
    const tiles = document.querySelectorAll('.tile');
    shakeTiles(tiles);
    return;
  }

  //Add condition that checks whether word is valid
  let response = await fetch('../../../api/v1/word/verify', {
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
    const tiles = document.querySelectorAll('.tile');
    shakeTiles(tiles);
    return;
  }

  //Send word to websocket server
  socket.emit('data', JSON.stringify({
    type: 'submit_guess',
    guess: guessedword,
    username: username
  }));
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    let row = computeRow(tile.dataset.index);
    if (tile.textContent != '' && row === currentRow) {
      tile.classList.add('shake'); //Add shake animation
      tile.addEventListener('animationend', () => {
        tile.classList.remove('shake'); //Remove class once animation is done
      }, { once: true }); //run shake animation only once
    }
  })
}

/*function showAlert(message, duration = 1000) {

}*/

function keyClickEventHandler() {
  const keys = document.querySelectorAll('.keyboard-row button');
  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const key = target.getAttribute('data-key');
      switch (key) {
        case 'enter':
          submitGuess();
          break;
        case 'del':
          handleDeleteButtonPress();
          break;
        default:
          updateGuessedWord(key);
          break;
      }
    }
  }
}

//Function to create falling letters when user wins
function createLetter() {
}

function displayVictoryCard() {
  const victoryCard = document.createElement('div');
  victoryCard.classList.add('victory-card');

  const turtleContainer = document.createElement('div');
  turtleContainer.classList.add('victory-turtle-container');
  victoryCard.appendChild(turtleContainer);

  document.body.appendChild(victoryCard);
}
