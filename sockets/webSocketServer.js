export default function handleSocketEvent (io, socket) {
  console.log(`New socket connected: ${socket.id}`);
}