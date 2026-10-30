
const feedbackForm = document.getElementById("feedbackForm");
const feedbackMessage = document.getElementById("feedbackMessage");

feedbackForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!feedbackForm.checkValidity()) {
    feedbackForm.reportValidity();
    return;
  }

  feedbackMessage.textContent =
    "Thank you! Your feedback has been submitted successfully.";

  feedbackForm.reset();
});
