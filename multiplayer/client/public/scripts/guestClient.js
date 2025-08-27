const socket = io();
let username = '';

displayGuestMainMenu();

function displayGuestMainMenu() {
  addRoomCodeTextField();
  addUserNameTextField();
}

function addRoomCodeTextField() {
  let menuContainer = document.querySelector('.guest-main-menu-container');
  let roomCodeTextField = document.createElement('input');
  roomCodeTextField.type = 'text';
  roomCodeTextField.name = 'room-code';
  roomCodeTextField.id = 'room-code';
  roomCodeTextField.placeholder = 'Enter Room Code';
  menuContainer.appendChild(roomCodeTextField);

  menuContainer.appendChild(document.createElement('br'));
  menuContainer.appendChild(document.createElement('br'));
}

function addUserNameTextField() {
  let menuContainer = document.querySelector('.guest-main-menu-container');
  let userNameTextField = document.createElement('input');
  userNameTextField.type = 'text';
  userNameTextField.name = 'username';
  userNameTextField.id = 'username';
  userNameTextField.placeholder = 'Enter your Username';
  userNameTextField.appendChild(document.createElement('br'));
  userNameTextField.appendChild(document.createElement('br'));
  menuContainer.appendChild(userNameTextField);

  menuContainer.appendChild(document.createElement('br'));
  menuContainer.appendChild(document.createElement('br'));
}