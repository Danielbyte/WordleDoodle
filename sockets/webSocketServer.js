let rooms = {}; //Reference to all the rooms
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
      data = JSON.parse(payload); //Actually doesn't need parsing (but better safe than sorry..)
    } catch(e) {
      console.error(`Failed to parse payload: ${e}`);
      return;
    }

    console.log('Parsed payload:', data);
  });
}