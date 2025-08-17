let userNames = [];
export default function handleSocketEvent (io, socket) {
  console.log(`New socket connected: ${socket.id}`);

  //Event listeners
  socket.on('join_room', (room, username) => {
  });

  socket.on('create_room', (username) => {
  });
}