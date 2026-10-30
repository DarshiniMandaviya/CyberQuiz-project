
const playerName = document.getElementById("playerName");
const scoreElement = document.getElementById("score");
const percentageElement = document.getElementById("percentage");
const correctElement = document.getElementById("correctAnswers");
const incorrectElement = document.getElementById("incorrectAnswers");
const levelElement = document.getElementById("quizLevel");
const progressFill = document.getElementById("progressFill");
const performanceMessage = document.getElementById("performanceMessage");

const reviewBtn = document.getElementById("reviewBtn");
const reviewSection = document.getElementById("reviewSection");
const answerReview = document.getElementById("answerReview");

// Read results saved by the quiz page.
let result = null;

try {
    result = JSON.parse(
        sessionStorage.getItem("cyberQuizLatestResult") || "null"
    );
} catch (error) {
    console.error("Unable to read quiz results:", error);
}

// If no result exists, show a helpful message.
if (!result) {
    playerName.textContent = "Participant";
    performanceMessage.textContent =
        "No quiz result was found. Please complete a quiz first.";

    document.getElementById("leaderboardBtn").disabled = true;
    document.getElementById("retryBtn").textContent = "Return to Quiz";
    document.getElementById("retryBtn").addEventListener("click", () => {
        window.location.href = "index.html";
    });
} else {
    displayResult(result);
}

// Display participant's result.
function displayResult(data) {
    const total = Number(data.totalQuestions) ||
        (Number(data.correct) + Number(data.incorrect));

    const correct = Number(data.correct) || 0;
    const incorrect = Number(data.incorrect) || 0;
    const score = Number(data.score) || 0;

    const percentage = total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    playerName.textContent = data.name || "Participant";
    scoreElement.textContent = score;
    percentageElement.textContent = percentage;
    correctElement.textContent = correct;
    incorrectElement.textContent = incorrect;
    levelElement.textContent = data.difficulty || "Beginner";

    // Animate the score bar.
    requestAnimationFrame(() => {
        progressFill.style.width = percentage + "%";
    });

    if (percentage >= 80) {
        performanceMessage.textContent =
            "Excellent! You have strong cybersecurity knowledge.";
    } else if (percentage >= 50) {
        performanceMessage.textContent =
            "Good job! Keep learning to strengthen your cyber awareness.";
    } else {
        performanceMessage.textContent =
            "Keep practicing! Review the answers and try again.";
    }

    // Display answer review if supplied by the quiz page.
    if (Array.isArray(data.questions)) {
        answerReview.innerHTML = data.questions.map((q, index) => {
            const correctAnswer = q.options?.[q.answer] ?? "Not available";

            return `
                <div class="review-item">
                    <strong>
                        ${index + 1}. ${escapeHTML(q.question)}
                    </strong>
                    <p>
                        Correct answer:
                        ${escapeHTML(correctAnswer)}
                    </p>
                    <p>${escapeHTML(q.explanation || "")}</p>
                </div>
            `;
        }).join("");
    } else {
        reviewBtn.disabled = true;
        reviewBtn.title = "Answer review is unavailable for this result.";
    }
}

// Safely display text in HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Show or hide answer review.
reviewBtn.addEventListener("click", () => {
    reviewSection.classList.toggle("hidden");

    reviewBtn.textContent = reviewSection.classList.contains("hidden")
        ? "Review Answers"
        : "Hide Answers";
});

// Open leaderboard page.
document.getElementById("leaderboardBtn").addEventListener("click", () => {
    window.location.href = "leaderboard.html";
});

// Return to quiz page.
document.getElementById("retryBtn").addEventListener("click", () => {
    sessionStorage.removeItem("cyberQuizLatestResult");
    window.location.href = "index.html";
});
