//This client file will be served by Express server (app.js)
const socket = io();

document.getElementById('createRoom').onclick = () => {
  const userName = document.getElementById('username').value;
  socket.emit('data', JSON.stringify({
    type: 'create',
    username: userName,
    isHost: true
  }));
};

document.getElementById('joinRoom').onclick = () => {
  const userName = document.getElementById('username').value;
  const roomID = document.getElementById('roomCode').value;
  socket.emit('data', JSON.stringify({
    type: 'join',
    roomcode: roomID,
    username: userName,
    isHost: false
  }));
};

//Host want to start game
document.getElementById('btn-start-game').onclick = () => {
  const userName = document.getElementById('username').value;
  const _word = document.getElementById('word-of-the-day').value;
  socket.emit('data', JSON.stringify({
    type: 'start_game',
    username: userName,
    isHost: true,
    word: _word
  }));
};

document.getElementById('board-state').onclick = () => {
  const userName = document.getElementById('username').value;
  const testBoardState = '<div class="tile" data-index="23"></div><div class="tile" data-index="24"></div><div class="tile" data-index="25"></div><div class="tile" data-index="26"></div><div class="tile" data-index="27"></div><div class="tile" data-index="28"></div><div class="tile" data-index="29"></div><div class="tile" data-index="30"></div>';

  socket.emit('data', JSON.stringify({
    type: 'update_board_state_to_room',
    username: userName,
    board: testBoardState
  }));
};

//Event listeners, this was will be for errors returned by the websocket server
socket.on('response', (payload) => {
  let data = JSON.parse(payload);
  console.log(data);
});


//This event listener will handle successful responses from the websocket server
socket.on('message', (payload) => {
  let data = JSON.parse(payload);
  console.log(data);
});