let rooms = {}; //Reference to all the rooms
let maxRoomCapacity = 5; //maximum allowable people in room

export default function handleSocketEvent (io, socket) {
  console.log(`New socket connected: ${socket.id}`);

  //Client sends data with payload/message
  socket.on('data', (payload) => {
    //Parse the data inito JSON object
    let data = null;
    let roomcode = '';

    try {
      data = JSON.parse(payload);
    } catch(e) {
      console.error(`Failed to parse payload: ${e}`);
      return;
    }

    console.log('Parsed payload:', data);

    switch(data.type) {
      case 'join':
        //User is joining a room
        if (roomCodeValidAndRoomInvalid(data.roomcode)) {
          socket.emit('response', JSON.stringify({
            code: 404,
            payload: 'Room not found, please try again'
          }));
          return;          
        }
        if (isRoomFull(data.roomcode)) {
          socket.emit('response', JSON.stringify({
            code: 403,
            payload: 'Room is already full'
          }));
          return;
        }
        if (userNameExists(data.username, data.roomcode)) {
          socket.emit('response', JSON.stringify({
            code: 403,
            payload: 'Username is not unique, please use another one.'
          }));
          return;
        }

        //Passed all the sanity checks and hooks, add this user to the room
        rooms[data.roomcode].push({
          username: data.username,
          isHost: data.isHost
        });

        socket.join(data.roomcode); //Socket can join the room
        broadCastEvent(data.roomcode, data.type, `@${data.username} has joined`, io);
        break;
        
        //User is creating a room
        case 'create':
          roomcode = getUniqueRoomCode();
          rooms[roomcode] = [];

          //Host should join room
          socket.join(roomcode);

          //Add created room in rooms and add host to the room
          rooms[roomcode] = [{
            username: data.username
          }]; 
          broadCastEvent(roomcode, data.type, `@${data.username} has created and joined ${roomcode}`, io);
          break;

        //Host starts the game, sync game boards for all users in this room
        case 'start_game':
          roomcode = getRooomCode(data.username);
          //Check for conditions if game can be started
          //Probably need to check if word is 5 letters, valid, etc..
          if (canStartGame(roomcode, data.isHost)) {
            broadCastEvent(roomcode, data.type, 'Game has started', io);
          } else {
            //broadcast to this socket that the game cannot be started (405 - method not allowed)
            socket.emit('response', {
              code: 405,
              payload: 'Not enough participants in room'
            });
          }
          break;
  }
  });
}

//Get the room code
function getRooomCode(username) {
  for (let roomcode in rooms) {
    if (rooms[roomcode].find(user => user.username === username))
      return roomcode;
  }
  return null;
}

function canStartGame(roomcode, isHost) {
  //Game can only start if there are 2 or more users in room and the host is the one starting the game
  return rooms[roomcode].length > 1 && isHost;
}

function roomCodeValidAndRoomInvalid(roomcode) {
  return roomcode && !(roomcode in rooms)
}

function isRoomFull(roomcode) {
  return rooms[roomcode].length >= maxRoomCapacity;
}

//Checks if username already exists in the room
function userNameExists(username, roomcode) {
  return rooms[roomcode].some(user => user.username === username);
}

function broadCastEvent(roomcode, type, payload, io) {
  io.to(roomcode).emit('message', JSON.stringify({
    type: type,
    payload: payload
  }));
}

function generateRoomCode() {
  //An array of characters used to generate random room code
  const chars = 'ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let roomcode = '';
  //room code is 10 characters long
  for (let counter = 0; counter < 10; counter++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    roomcode += chars.charAt(randomIndex);
  }

  return roomcode;
}

function getUniqueRoomCode() {
  let uniqueRoomcode = generateRoomCode();
  while(uniqueRoomcode in rooms) {
    console.log(`Roomcode collision: ${uniqueRoomcode}, new room code generating..`);
    uniqueRoomcode = generateRoomCode();
  }
  
  console.log(`room code: ${uniqueRoomcode}`)
  return uniqueRoomcode;
}