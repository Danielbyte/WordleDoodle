let animationPeriod = 0.03;
let formFieldsValid;

wrapTitleWithSpanTag();

//Function wraps each of the title element (wordledoodle) into a span tag so that it can hav the jiggle animation when user hovers above
function wrapTitleWithSpanTag() {
  //grab title element
  const titleElement = document.getElementById('title');
  const text = titleElement.textContent;

  titleElement.textContent = '';

  //Break down the contents/word of title element into its constituent characters and store in array
  [...text].forEach((character, index) => {
    const spanElement = document.createElement('span');
    spanElement.textContent = character;
    spanElement.style.animationDelay = `${(index * animationPeriod)}s`;
    titleElement.appendChild(spanElement);
  });
}

document.getElementById('registration-form').addEventListener('submit', async (e) => {
  e.preventDefault(); //prevent normal form 
  formFieldsValid = true;

  validateUsername();
  validateEmail();
  validatePassword();

  if (!formFieldsValid) return;

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    });
     
    //Display the error from the server to the user
    if (!response.ok) {
      if (response.status === 409) {
        const message = 'An account with this email already exists';
        const email = document.getElementById('email');
        const errMsgContainer = document.getElementById('js-email-error');
        const messageParagraph = document.getElementById('js-email-message');
        setError(email, errMsgContainer, messageParagraph, message);  
      }
      return;
    }

    const data = await response.json();
    const token = data.data.token;
    fetch('/api/v1/otp/form/serve', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.redirectUrl) window.location.href = data.redirectUrl;
      })
  } catch (err) {
    console.error(err);
  }
});

function validateUsername() {
  const username = document.getElementById('username');
  const errMsgContainer = document.getElementById('js-username-error');
  const messageParagraph = document.getElementById('js-username-message');

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

function validateEmail() {
  const email = document.getElementById('email');
  const errMesgContainer = document.getElementById('js-email-error');
  const messageParagraph = document.getElementById('js-email-message');

  if (!email.value) {
    const message = 'Hmm! Email is required';
    setError(email, errMesgContainer, messageParagraph, message);
    return;
  }

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) {
    let message = 'That doesn\'t look like an email';
    setError(email, errMesgContainer, messageParagraph, message);
    return;
  }

  resetError(email, errMesgContainer);
}

function validatePassword() {
  const password = document.getElementById('password');
  const errMesgContainer = document.getElementById('js-password-error');
  const messageParagraph = document.getElementById('js-password-message');

  if (!password.value.trim()) {
    const message = 'Oops! Create password';
    setError(password, errMesgContainer, messageParagraph, message);
    return;
  }

  if ((password.value.trim()).length < 8) {
    const message = 'Oops, password too short';
    setError(password, errMesgContainer, messageParagraph, message);
    return;
  }

  const hasUpperAndLowerCase = /[a-z]/.test(password.value.trim()) && /[A-Z]/.test(password.value.trim());
  if (!hasUpperAndLowerCase) {
    const message = 'Include upper and lowercase letters in password';
    setError(password, errMesgContainer, messageParagraph, message);
    return;
  }

  const hasDigit = /\d/.test(password.value.trim());
  if (!hasDigit) {
    const message = 'Heads Up! include a digit in your password';
    setError(password, errMesgContainer, messageParagraph, message);
    return;
  }

  resetError(password, errMesgContainer);
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