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