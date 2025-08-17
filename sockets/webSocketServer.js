export default function handleSocketEvent (io, socket) {
  console.log(`New socket connected: ${socket.id}`);

  //Event listeners
  socket.on('join_room', (room) => {
    socket.join(room);

    //Send notification to all sockets in this room that this particular socket has joined
    io.to(room).emit('message', `${socket.id} has joined ${room}`);
  });

  socket.on('create_room', (username) => {
    //Generate room ID
    const room = 123456789; //Hard coded for now (will be auto generated and encrypted (for security))
    //The host should join this room
    socket.join(room);
    console.log(`Host: ${username} created and joined room: ${room}`)
  })
}