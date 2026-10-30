
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

// Show or hide password
document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
            button.setAttribute("aria-label", "Hide password");
        } else {
            input.type = "password";
            button.textContent = "Show";
            button.setAttribute("aria-label", "Show password");
        }
    });
});

// Display messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

// Registration form submission
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname")
        .value.trim();

    const username = document.getElementById("username")
        .value.trim();

    const email = document.getElementById("email")
        .value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Validate password length
    if (password.length < 8) {
        showMessage(
            "Password must contain at least 8 characters.",
            "error"
        );
        return;
    }

    // Check password match
    if (password !== confirmPassword) {
        showMessage(
            "Passwords do not match. Please try again.",
            "error"
        );
        return;
    }

    // Read previously registered profiles
    let users = [];

    try {
        users = JSON.parse(
            localStorage.getItem("cyberQuizUsers") || "[]"
        );

        if (!Array.isArray(users)) {
            users = [];
        }
    } catch (error) {
        showMessage(
            "Unable to read registration data in this browser.",
            "error"
        );
        return;
    }

    // Check for duplicate username or email
    const existingUser = users.some(user =>
        user.username.toLowerCase() === username.toLowerCase() ||
        user.email.toLowerCase() === email
    );

    if (existingUser) {
        showMessage(
            "Username or email is already registered.",
            "error"
        );
        return;
    }

    // Save basic profile information only.
    // Never save passwords in browser Local Storage.
    const newUser = {
        fullname: fullname,
        username: username,
        email: email,
        registeredAt: new Date().toISOString()
    };

    try {
        users.push(newUser);

        localStorage.setItem(
            "cyberQuizUsers",
            JSON.stringify(users)
        );

        showMessage(
            "Registration successful! Welcome to CyberQuiz.",
            "success"
        );

        registerForm.reset();

        document.querySelectorAll(".toggle-password")
            .forEach(button => {
                button.textContent = "Show";
                button.setAttribute("aria-label", "Show password");
            });

    } catch (error) {
        showMessage(
            "Could not save your registration. Please try again.",
            "error"
        );
    }
});
