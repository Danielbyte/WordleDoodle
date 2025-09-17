let formFieldsValid;

document.getElementById('js-btn-create-room').addEventListener('click', () => {
  const username = document.getElementById('user-name').value;
  formFieldsValid = true;

  validateUsername();

  if (!formFieldsValid) return;

  try {
    fetch('/multiplayer/username/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    })
      .then(response => response.json())
      .then(data => {
        if (data.redirectUrl) window.location.href = data.redirectUrl;
      })
  } catch (err) {
    console.error(err);
  }
});

const validateUsername = () => {
  const username = document.getElementById('user-name');
  const errMsgContainer = document.getElementById('js-username-error-card');
  const messageParagraph = document.getElementById('js-username-error-message');

  // Can only contain letters, numbers and the two special characters above
  if (!username.value.trim()) {
    const message = 'Oops! Fill in username';
    setError(username, errMsgContainer, messageParagraph, message);
    return;
  }

  //Regex to check if username only contains letters, numbers and _, - characters
  const usernameRegex = /^[A-Za-z0-9_-]+$/;
  if (!usernameRegex.test(username.value.trim())) {
    const message = 'Woah! no special characters';
    setError(username, errMsgContainer, messageParagraph, message);
    return;
  }

  //Username cannot start with special characters
  if ((username.value.trim()).startsWith('-') || (username.value.trim()).startsWith('_')) {
    const message = 'Username cannot start with _ or -';
    setError(username, errMsgContainer, messageParagraph, message);
    return;
  }

  resetError(username, errMsgContainer);
}

const setError = (fieldElement, messageContainer, messageParagraph, message) => {
  const fieldElementError = fieldElement.nextElementSibling;
  fieldElement.style.borderColor = '#FF0000';
  fieldElementError.style.display = 'flex';
  messageContainer.style.display = 'flex';
  messageParagraph.innerText = message;
  formFieldsValid = false;
}

const resetError = (fieldElement, messageContainer) => {
  const fieldElementError = fieldElement.nextElementSibling;
  fieldElementError.style.display = 'none';
  messageContainer.style.display = 'none';
  fieldElement.style.borderColor = '#4CAF50';
}