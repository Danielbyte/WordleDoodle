//Singleplayer button event handler
document.getElementById('js-singleplayer-btn').addEventListener('click', () => {
  //Query the server to authorize and serve the singleplayer board
  window.location.href = '/singleplayer/board';
});