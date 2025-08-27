const socket = io();
let username = '';

displayGuestMainMenu();

function displayGuestMainMenu() {
  addRoomCodeTextField();
}

function addRoomCodeTextField() {
  let menuContainer = document.getElementById('guest-main-menu-container');
  let roomCodeTextField = document.createElement('input');
  roomCodeTextField.type = 'text';
  roomCodeTextField.name = 'room-code';
  roomCodeTextField.placeholder = 'Enter Room Code';
  roomCodeTextField.appendChild(document.createElement('br'));
  roomCodeTextField.appendChild(document.createElement('br'));
  menuContainer.appendChild(addRoomCodeTextField);
}

function addUserNameTextField() {

}