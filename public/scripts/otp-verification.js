addEventListenersForUserInput();

function addEventListenersForUserInput() {
const inputs = document.querySelectorAll('.otp-input');

inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < inputs.length -1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});
}

document.getElementById('js-continue-button').addEventListener('click', async () => {
  let otp ='';
  const otpInputs = document.querySelectorAll('.otp-input');
  otpInputs.forEach((input) => {
    otp += input.value;
  });

  try {
    const response = await fetch('/api/v1/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: otp
      })
    });

    if (!response.ok) {
      //Need to display a page that something went wrong
      return;
    }
    window.location.href = '/';
  } catch (error) {
    console.error(error);
  }
});

document.getElementById('js-resend-otp').addEventListener('click', async (event) => {
  event.preventDefault();

  try {
    const response = await fetch('/api/v1/otp/resend', {
      method: 'POST'
    });

    if (!response.ok) {
      //Need to display a page that something went wrong
      return;
    }
    document.getElementById('js-otp-sent').textContent = 'New OTP sent to email address used to register';
  } catch (error) {
    console.error(error);
  }
})