const joinRoomBtn = document.getElementById('js-guest-join-room-btn');
const createRoomBtn = document.getElementById('js-guest-create-room-btn');

joinRoomBtn.addEventListener('click', () => {
  window.location.href = '/multiplayer/guest/board';
})