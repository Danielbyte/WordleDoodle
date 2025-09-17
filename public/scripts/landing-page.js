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

document.getElementById('js-register-button').addEventListener('click', () => {
  window.location.href = '/register';
});

document.getElementById('js-login-button').addEventListener('click', async () => {
  formFieldsValid = true;
  const email = document.getElementById('js-email').value.trim();
  const password = document.getElementById('js-password').value.trim();

  validateEmail();
  validatePassword();

  if (!formFieldsValid) return;

  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  // Handle and display responses from the server
  if (!response.ok) {
    if (response.status === 404) {
      const email = document.getElementById('js-email');
      const errMesgContainer = document.getElementById('js-email-error-card');
      const messageParagraph = document.getElementById('js-email-error-message');
      const message = 'Oops! Email is not registered';
      setError(email, errMesgContainer, messageParagraph, message);
    }

    if (response.status === 401) {
      //Report error on incorrect password
      const password = document.getElementById('js-password');
      const errMesgContainer = document.getElementById('js-password-error-card');
      const messageParagraph = document.getElementById('js-password-error-message');
      const message = 'Sorry! Password is incorrect';
      setError(password, errMesgContainer, messageParagraph, message);
    }
    return;
  }

  let data = await response.json();
  try {
    //User login, request the server foe permission to serve the menu form
    const token = data.data.token;
    fetch('/api/v1/auth/menu', {
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

const validateEmail = () => {
  //Error message variables
  const email = document.getElementById('js-email');
  const errorMessageCard = document.getElementById('js-email-error-card');
  const messageParagraph = document.getElementById('js-email-error-message');

  if (!email.value.trim()) {
    const message = 'Hmm! Email is required';
    setError(email, errorMessageCard, messageParagraph, message);
    return;
  }

  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) {
    let message = 'That doesn\'t look like an email';
    setError(email, errorMessageCard, messageParagraph, message);
    return;
  }

  resetError(email, errorMessageCard);
}

function validatePassword() {
  const password = document.getElementById('js-password');
  const errMesgContainer = document.getElementById('js-password-error-card');
  const messageParagraph = document.getElementById('js-password-error-message');

  if (!password.value.trim()) {
    const message = 'Oops! Fill in password';
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