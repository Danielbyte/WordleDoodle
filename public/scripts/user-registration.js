let animationPeriod = 0.03;

wrapTitleWithSpanTag();

//Function wraps each of the title element (wordledoodle) into a span tag so that it can hav the jiggle animation when user hovers above
function wrapTitleWithSpanTag () {
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
  e.preventDefault(); //prevent normal form submission
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

    if (!response.ok) {
      //Need to display a page that something went wrong
      return;
    }

    //Redirect user to otp page
    window.location.href = '/register/otp/verify'
  } catch (err) {
    console.error(err);
  }
});