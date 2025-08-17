//This client file will be served by Express server (app.js)
const socket = io();
//Host wants to create a room
//Pass in the username. To prevent the room information from being exposed in the front end, room creation will be handled by the server
function createRoom(userName) {
  socket.emit('create_room', userName);
}

//User is joining a room
//User needs to to pass in the room id they ought to join and their username
function joinRoom(roomID, userName) {
  socket.emit('join_room', roomID, userName);
}

document.getElementById('createRoom').onclick = () => {
  const userName = document.getElementById('username').value;
  createRoom(userName);
};

//Event listeners
socket.on('roomCreated', (roomId) => {
  console.log(`Room id: ${roomId} created. Share`)
});