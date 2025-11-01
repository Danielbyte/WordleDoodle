let rooms = {}; //Reference to all the rooms
let maxRoomCapacity = 5; //maximum allowable people in room
let wordLength = 5;
const doodleTurtleUsername = 'DoodleTurtle';

export default function handleSocketEvent(io, socket) {
  console.log(`New socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    deleteUser(socket);
  });

  //Client sends data with payload/message
  socket.on('data', (payload, callback) => {
    //Parse the data inito JSON object
    let data = null;
    let roomcode = '';
    let placements = [];//Capture user placements
    let guess = '', roomWord = ''; //will hold user guess and set room word
    let boardState = ''; //The color coded board state of user (without the letters)
    let correctPlacements = 0;
    let isWin = false;

    try {
      data = JSON.parse(payload);
    } catch (e) {
      console.error(`Failed to parse payload: ${e}`);
      return;
    }

    let message;
    switch (data.type) {
      case 'join':
        //User is joining a room
        if (roomCodeValidAndRoomInvalid(data.roomcode)) {
          message = 'Room not found! please try again';
          callback({ success: false, message })
          return;
        }
        if (isRoomFull(data.roomcode)) {
          message = 'Sorry! Room is already full';
          callback({ success: false, message });
          return;
        }
        if (userNameExists(data.username, data.roomcode)) {
          message = 'Username already taken';
          callback({ success: false, message });
          return;
        }

        //Passed all the sanity checks and hooks, add this user to the room
        rooms[data.roomcode].push({
          username: data.username,
          isHost: data.isHost,
          position: rooms[data.roomcode].length + 1,
          socketId: socket.id
        });

        socket.join(data.roomcode); //Socket can join the room

        io.to(data.roomcode).emit('message', JSON.stringify({
          type: data.type,
          payload: `@${data.username} has joined the room`,
          position: `${getSocketPosition(data.username)}`,
          username: data.username
        }));

        message = 'Joined in successfully';
        callback({ success: true, message });
        break;

      //User is creating a room
      case 'create':
        roomcode = getUniqueRoomCode();
        rooms[roomcode] = [];

        //Host should join room
        socket.join(roomcode);

        //Add created room in rooms and add host to the room
        rooms[roomcode] = [{
          username: data.username,
          socketId: socket.id,
          isHost: data.isHost
        }];

        //Send this room code to the host socket
        socket.emit('message', JSON.stringify({
          type: 'roomcode',
          code: 202,
          roomId: roomcode,
          username: data.username
        }));

        rooms[roomcode].inProgress = false;
        rooms[roomcode].isTerminated = false;
        broadCastEvent(roomcode, 'room_created', `@${data.username} has created and joined ${roomcode}`, io);
        break;

      //Host starts the game, sync game boards for all users in this room
      case 'start_game':
        if (data.word.trim() === '') { //Server side input validation
          message = 'Oops! Set word';
          callback({ success: false, message });
          return;
        }

        if (data.word.trim().length < wordLength || data.word.trim().length > wordLength) {
          message = 'Woah! Word should be 5 letters';
          callback({ success: false, message });
          return;
        }

        if (rooms[data.roomcode].inProgress === true) {
          message = 'Oops! Game in progress, please wait';
          callback({ success: false, message });
          return;
        }
        if (canStartGame(data.roomcode, data.isHost)) {
          // Set the word for particular room
          let room = rooms[data.roomcode];
          rooms[data.roomcode].word = data.word;
          rooms[data.roomcode].inProgress = true;
          broadCastEvent(data.roomcode, data.type, room, io);
        } else {
          message = 'Oops! Not enough participants in room';
          callback({ success: false, message });
          return;
        }
        break;

      //User submits guess (verifyy this word)
      /* Need to:
       * Do the word checks (assign correct, wrong, ...)
       * Send board state to player's socket
       */
      case 'submit_guess':
        roomcode = data.roomcode;
        guess = data.guess.toUpperCase();
        roomWord = rooms[roomcode].word.toUpperCase();
        for (let index = 0; index < roomWord.length; index++) {
          if (guess[index] === roomWord[index]) {
            placements[index] = 'correct';
            ++correctPlacements;
          }

          else if (roomWord.includes(guess[index]))
            placements[index] = 'wrong-location';

          else
            placements[index] = 'wrong';
        }

        if (correctPlacements === wordLength) isWin = true;

        //Send placements to client so that they may update their board state
        socket.emit('message', JSON.stringify({
          type: 'placement_verification',
          placement: placements,
          isWin: isWin
        }));
        break;

      case 'broadcast_board_state_to_room':
        boardState = data.placements;
        roomcode = getRooomCode(data.username);
        socket.to(roomcode).emit('message', JSON.stringify({
          type: 'board_broadcast',
          username: data.username,
          placements: boardState,
          position: data.position,
          row: data.row
        }))
        break;

      case 'chat_message':
        socket.to(data.roomcode).emit('message', JSON.stringify({
          type: 'chat_message',
          username: data.username,
          chat: data.chatMessage
        }))
        break;

      case 'winning_condition':
        rooms[data.roomcode].inProgress = false;
        socket.to(data.roomcode).emit('message', JSON.stringify({
          type: data.type,
          username: data.username
        }))
        break;

      //unknown case / not implemented
      default:
        socket.emit('response', JSON.stringify({
          code: 501,
          payload: 'Not Implemented'
        }));
        break;
    }
  });
}

//Delete user in room
function deleteUser(socket) {
  let socketIndex = -1;
  let roomId;
  let username;
  for (let roomcode in rooms) {
    rooms[roomcode].forEach((user, index) => {
      if (user.socketId === (socket.id).toString()) {
        socketIndex = index;
        roomId = roomcode;
        username = user.username;
        if (user.isHost) rooms[roomcode].isTerminated = true; //Terminate room once host leaves
      }
    });
  }

  if (socketIndex !== -1) {
    rooms[roomId].splice(socketIndex, 1);
  }

  deleteRoomIfEmpty(roomId);

  //Let everyone in the room know that the user left
  const chatMessage = `${username} left!`
  socket.to(roomId).emit('message', JSON.stringify({
    type: 'chat_message',
    username: doodleTurtleUsername,
    chat: chatMessage
  }));
}

function deleteRoomIfEmpty(roomId) {
  //Delete the room once it's empty (Free up memory)
  const numberOfRoomParticipants = rooms[roomId].length;
  if (numberOfRoomParticipants === 0) {
    delete rooms[roomId];
  }
}

//Get the room code
function getRooomCode(username) {
  for (let roomcode in rooms) {
    if (rooms[roomcode].find(user => user.username === username))
      return roomcode;
  }
  return null;
}

function getSocketPosition(username) {
  for (let roomcode in rooms) {
    if (rooms[roomcode].find(user => user.username === username)) {
      return rooms[roomcode].length;
    }
  }
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
  return rooms[roomcode].some(user => user.username.toLowerCase() === username.toLowerCase());
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
  while (uniqueRoomcode in rooms) {
    console.log(`Roomcode collision: ${uniqueRoomcode}, new room code generating..`);
    uniqueRoomcode = generateRoomCode();
  }
  return uniqueRoomcode;
}