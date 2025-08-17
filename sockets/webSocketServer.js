let rooms = {}; //Reference to all the rooms
let maxRoomCapacity = 5; //maximum allowable people in room

export default function handleSocketEvent (io, socket) {
  console.log(`New socket connected: ${socket.id}`);

  //Username and roomcode
  let username = '';
  let roomcode = '';

  //Client sends data with payload/message
  socket.on('data', (payload) => {
    //Parse the data inito JSON object
    let data = null;

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
        break;
  }
  });
}

function roomCodeValidAndRoomInvalid(roomcode) {
  return roomcode && !(roomcode in rooms)
}

function isRoomFull(roomcode) {
  return rooms[roomcode].length >= maxRoomCapacity;
}