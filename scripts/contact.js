document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
  e.preventDefault(); 

  const form = e.target;
  const feedbackMessage = document.getElementById('feedbackMessage');

  const data = {
    email: form.email.value,
    phone: form.phone.value,
    message: form.message.value
  };
  console.log(data);
  try {

    const response = await fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      feedbackMessage.textContent = 'Спасибо! Ваше сообщение отправлено.';
      form.reset();
    } else {
      feedbackMessage.textContent = 'Ошибка отправки. Попробуйте позже.';
    }
  } catch (error) {
    feedbackMessage.textContent = 'Ошибка сети. Попробуйте позже.';
  }
});
