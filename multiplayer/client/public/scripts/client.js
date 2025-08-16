//import { io } from 'socket.io-client'

const PORT = process.env.PORT || 5500;

const SERVER_URL = PORT; //!== '.env.development.local' ? 'https://wordleDoodle.com' : PORT; //if not development, default to production => app link

/*
//Instantiate client side socket
const socket = io(SERVER_URL, {
  withCredentials: true
});*/
const socket = io();
//Host wants to create a room
//Pass in the username. To prevent the room information from being exposed in the front end, room creation will be handled by the server
function createRoom(userName) {
  socket.emit('createRoom', userName);
}

//User is joining a room
//User needs to to pass in the room id they ought to join and their username
function joinRoom(roomID, userName) {
  socket.emit('joinRoom', roomID, userName);
}