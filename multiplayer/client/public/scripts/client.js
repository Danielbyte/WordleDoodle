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

//Event listeners
socket.on('message', (msg) => {
  console.log(`${msg}`);
});