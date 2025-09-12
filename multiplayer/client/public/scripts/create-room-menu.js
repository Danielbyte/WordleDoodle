document.getElementById('js-btn-create-room').addEventListener('click', () => {
  const username = document.getElementById('user-name').value;

  try {
    fetch('/multiplayer/username/create', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username: username})
    })
    .then(response => response.json())
    .then(data => {
      if (data.redirectUrl) window.location.href = data.redirectUrl;
    })
  } catch (err) {
    console.error(err);
  }
})