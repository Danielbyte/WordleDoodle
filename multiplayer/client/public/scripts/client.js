//This client file will be served by Express server (app.js)
const socket = io();

document.getElementById('createRoom').onclick = () => {
  const userName = document.getElementById('username').value;
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