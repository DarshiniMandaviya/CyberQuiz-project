
document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");

      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "☰";
      });
    });
  }

  // Contact form validation
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");

  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("contactName")
      .value.trim();

    const email = document.getElementById("contactEmail")
      .value.trim();

    const subject = document.getElementById("contactSubject")
      .value;

    const message = document.getElementById("contactMessage")
      .value.trim();

    if (!name || !email || !subject || !message) {
      status.textContent = "Please fill in all fields.";
      status.className = "error";
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent =
      "Thank you, " + name +
      "! Your message passed validation. Please connect a backend " +
      "or email service to deliver your message.";

    status.className = "success";

    // Demo only: the message is not sent or saved.
    console.log("Contact form submission:", {
      name: name,
      email: email,
      subject: subject,
      message: message
    });

    form.reset();
  });
});
