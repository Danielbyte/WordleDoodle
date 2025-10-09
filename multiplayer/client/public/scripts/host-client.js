//This client file will be served by Express server (app.js)
const socket = io();
let username = '';
let origin = '';
let roomcode = '';
const maxWordLength = 5; //Max word is 5 (Player guesses a five letter word)
const errorContainer = document.getElementById('error-message');
const errorMsg = document.getElementById('error-msg');
const wordOfTheDayInput = document.getElementById('word-of-the-day');
const doodleTurtleUsername = 'DoodleTurtle';

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
  let invitationMessage = '';
  switch (data.type) {
    case 'join':
      //guestPositionInRoom = Number(data.position) - 1;//Subtract 1 to exclude the host
      break;

    case 'board_broadcast':
      guestPositionInRoom = data.position - 1;
      updateGuestBoardStates(guestPositionInRoom, data.placements, data.row);
      break;

    case 'roomcode':
      roomcode = data.roomId;
      break;

    case 'chat_message':
      addMessageToChatUI('right-bubble', data.chat, data.username); //Should be right bubble (yellow)
      break;

    case 'room_created':
      invitationMessage = `To invite friends to your room, Share this link:
      ${origin}/multiplayer/guest/board`;
      addMessageToChatUI('right-bubble', invitationMessage, doodleTurtleUsername);
      invitationMessage =`Share this room code so that they can be able to join: ${roomcode}`;
      addMessageToChatUI('right-bubble', invitationMessage, doodleTurtleUsername);
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
  let hostBoard = document.querySelector('.main-board');
  hostBoard.style.gridRow = '1'; //The host board should have one row (for the host to set word and start game)
  //loadGameBoardContainer();

  try {
    fetch('/multiplayer/username', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          username = data.username;
          origin = data.origin;
          createRoom(username);
          //displayHostBoard();
        }
      })
  } catch (err) {
    console.error(err);
  }
}

//function addSendMessageButtonEventListener() {
document.getElementById('send-message-btn').addEventListener('click', () => {
  let messageInputField = document.getElementById('message-input');
  const message = messageInputField.value;

  if (!message) return; //If there is no message enetered, return (No need to send message)

  const bubbleClass = 'left-bubble';
  addMessageToChatUI(bubbleClass, message, username);
  messageInputField.value = ''; //Clear the message field
  broadcastMessageToRoom(message);
});
//}

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

function broadcastMessageToRoom(message) {
  console.log(`This is the roomcode: ${roomcode}`)
  socket.emit('data', JSON.stringify({
    type: 'chat_message',
    username: username,
    chatMessage: message,
    roomcode: roomcode
  }));
}

// Function that allows the host to create a room
function createRoom(username) {
  socket.emit('data', JSON.stringify({
    type: 'create',
    username: username,
    isHost: true
  }));
}

document.getElementById('btn-start-game').addEventListener('click', () => {
  const _word = document.getElementById('word-of-the-day').value.trim();
  //Client side error handling
  if (_word === '') {
    setError('Oops! Set word');
    return;
  }

  if (_word.length > maxWordLength || _word.length < maxWordLength) {
    setError('Woah! Word should be 5 letters');
    return;
  }

  socket.emit('data', JSON.stringify({
    type: 'start_game',
    username: username,
    isHost: true,
    word: _word,
    roomcode: roomcode
  }), (response) => {
    if(!response.success) {
      const message = response.message;
      setError(message);
      return;
    }
  });
  resetError();
});

const setError = (message) => {
  errorContainer.style.display = 'flex';
  errorMsg.innerText = message;
  wordOfTheDayInput.style.borderColor = '#FF0000';
}

const resetError = () => {
  errorContainer.style.display = 'none';
  errorMsg.innerText = '';
  wordOfTheDayInput.style.borderColor = '#4f4e4e';
}