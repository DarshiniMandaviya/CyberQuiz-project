
document.addEventListener("DOMContentLoaded", () => {
    // Get registered users
    function readStorage(key, fallback = []) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value ?? fallback;
        } catch {
            return fallback;
        }
    }

    const users = readStorage("cyberQuizUsers");
    const currentUser = readStorage("cyberQuizCurrentUser", null);

    // Support the existing registration code:
    // If no current session exists, use the most recently registered user.
    const user = currentUser && typeof currentUser === "object"
        ? currentUser
        : users.length > 0
            ? users[users.length - 1]
            : null;

    const displayName = user?.fullname || user?.username || "Cyber Learner";
    const username = user?.username || "learner";
    const email = user?.email || "No email available";

    // Display participant details
    document.getElementById("welcomeName").textContent = displayName;
    document.getElementById("headerUsername").textContent = username;
    document.getElementById("profileName").textContent = displayName;
    document.getElementById("profileEmail").textContent = email;
    document.getElementById("profileUsername").textContent = "@" + username;

    const initial = displayName.charAt(0).toUpperCase() || "C";

    document.getElementById("userAvatar").textContent = initial;
    document.getElementById("profileAvatar").textContent = initial;

    // Load quiz attempts.
    // Expected format: an array of objects containing
    // username, category, level, score, and date.
    const allAttempts = readStorage("cyberQuizAttempts");

    const attempts = Array.isArray(allAttempts)
        ? allAttempts.filter(attempt =>
            attempt &&
            typeof attempt === "object" &&
            typeof attempt.score === "number" &&
            Number.isFinite(attempt.score) &&
            attempt.score >= 0 &&
            attempt.score <= 100 &&
            String(attempt.username || "").toLowerCase() ===
                username.toLowerCase()
        )
        : [];

    // Calculate statistics
    const completed = attempts.length;

    const average = completed
        ? Math.round(
            attempts.reduce((total, attempt) => total + attempt.score, 0)
            / completed
        )
        : 0;

    const best = completed
        ? Math.max(...attempts.map(attempt => attempt.score))
        : 0;

    document.getElementById("completedCount").textContent = completed;
    document.getElementById("averageScore").textContent = average + "%";
    document.getElementById("bestScore").textContent = best + "%";

    let level = "Beginner";

    if (average >= 80) {
        level = "Advanced";
    } else if (average >= 50) {
        level = "Intermediate";
    }

    document.getElementById("learningLevel").textContent = level;

    // Display recent activity
    const activityTable = document.getElementById("activityTable");
    activityTable.replaceChildren();

    if (attempts.length === 0) {
        const row = activityTable.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent =
            "No quiz attempts yet. Start your first quiz!";

    } else {
        // Show the latest attempts first
        const recentAttempts = [...attempts]
            .sort((a, b) =>
                String(b.date || "").localeCompare(String(a.date || ""))
            )
            .slice(0, 5);

        recentAttempts.forEach(attempt => {
            const row = activityTable.insertRow();

            const categoryCell = row.insertCell();
            categoryCell.textContent = attempt.category || "General Quiz";

            const levelCell = row.insertCell();
            levelCell.textContent = attempt.level || "Beginner";

            const scoreCell = row.insertCell();
            scoreCell.textContent = attempt.score + "%";

            const dateCell = row.insertCell();
            const date = new Date(attempt.date);

            dateCell.textContent = attempt.date &&
                !Number.isNaN(date.getTime())
                ? date.toLocaleDateString()
                : "Not available";

            const statusCell = row.insertCell();
            const badge = document.createElement("span");

            badge.className = "status-badge";
            badge.textContent = attempt.score >= 50
                ? "Completed"
                : "Keep Practicing";

            statusCell.appendChild(badge);
        });
    }

    // Select a difficulty level
    let selectedLevel = "Beginner";

    const difficultyCards = document.querySelectorAll(".difficulty-card");

    difficultyCards.forEach(card => {
        card.addEventListener("click", () => {
            difficultyCards.forEach(item =>
                item.classList.remove("selected")
            );

            card.classList.add("selected");
            selectedLevel = card.dataset.level;
        });
    });

    // Start the selected category quiz
    document.querySelectorAll(".quiz-btn").forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;

            const params = new URLSearchParams({
                category: category,
                level: selectedLevel
            });

            window.location.href = "quiz.html?" + params.toString();
        });
    });

    // Mobile sidebar
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menuBtn");

    menuBtn.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("open");

        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the sidebar after selecting a navigation link
    document.querySelectorAll(".sidebar .nav-link").forEach(link => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        const confirmed = window.confirm("Are you sure you want to leave?");

        if (confirmed) {
            // Clear the active session, not the registered profiles.
            localStorage.removeItem("cyberQuizCurrentUser");
            window.location.href = "index.html";
        }
    });
});
