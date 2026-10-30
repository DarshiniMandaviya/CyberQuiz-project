
const questions = [
    {
        level: "Beginner",
        category: "XSS",
        question: "What is Cross-Site Scripting (XSS)?",
        options: [
            "A hardware attack",
            "Injecting malicious scripts into web pages",
            "A password manager",
            "A backup method"
        ],
        answer: 1,
        explanation: "XSS involves injecting malicious scripts into web pages."
    },
    {
        level: "Beginner",
        category: "DDoS",
        question: "What is the main purpose of a DDoS attack?",
        options: [
            "Improve security",
            "Create backups",
            "Make a service unavailable",
            "Protect a network"
        ],
        answer: 2,
        explanation: "A DDoS attack overwhelms a service with traffic from multiple sources."
    },
    {
        level: "Beginner",
        category: "Password",
        question: "Is reusing the same password for every account safe?",
        options: ["True", "False"],
        answer: 1,
        explanation: "Password reuse puts multiple accounts at risk."
    },
    {
        level: "Beginner",
        category: "Spoofing",
        question: "What is email spoofing?",
        options: [
            "Deleting emails",
            "Faking the sender's email address",
            "Creating passwords",
            "Installing antivirus"
        ],
        answer: 1,
        explanation: "Email spoofing makes a message appear to come from another sender."
    },
    {
        level: "Beginner",
        category: "Malware",
        question: "Which of these is malware?",
        options: ["Firewall", "Trojan horse", "Password manager", "Security update"],
        answer: 1,
        explanation: "A Trojan horse disguises itself as legitimate software."
    },
    {
        level: "Intermediate",
        category: "XSS",
        question: "Which practice helps prevent XSS?",
        options: [
            "Sharing passwords",
            "Output encoding and safe input handling",
            "Disabling updates",
            "Using short passwords"
        ],
        answer: 1,
        explanation: "Output encoding helps prevent injected scripts from executing."
    },
    {
        level: "Intermediate",
        category: "DDoS",
        question: "What is a botnet?",
        options: [
            "A network of compromised devices",
            "A secure website",
            "A password database",
            "A firewall"
        ],
        answer: 0,
        explanation: "A botnet is a group of compromised devices controlled remotely."
    },
    {
        level: "Intermediate",
        category: "Password",
        question: "What is a brute-force attack?",
        options: [
            "Sending emails",
            "Trying many password combinations",
            "Blocking a website",
            "Updating software"
        ],
        answer: 1,
        explanation: "A brute-force attack tries many possible passwords."
    },
    {
        level: "Intermediate",
        category: "Spoofing",
        question: "Can a caller ID number be spoofed?",
        options: ["Yes", "No"],
        answer: 0,
        explanation: "Caller ID can be falsified, so verify unexpected calls independently."
    },
    {
        level: "Intermediate",
        category: "Malware",
        question: "What does ransomware typically do?",
        options: [
            "Improves internet speed",
            "Encrypts or locks data and demands payment",
            "Creates backups",
            "Protects computers"
        ],
        answer: 1,
        explanation: "Ransomware typically locks or encrypts data and demands payment."
    },
    {
        level: "Advanced",
        category: "XSS",
        question: "What is DOM-based XSS?",
        options: [
            "Hardware failure",
            "Unsafe client-side handling of untrusted data",
            "Password recovery",
            "Network backup"
        ],
        answer: 1,
        explanation: "DOM-based XSS occurs when client-side code handles untrusted data unsafely."
    },
    {
        level: "Advanced",
        category: "DDoS",
        question: "What does a traffic-scrubbing service do?",
        options: [
            "Deletes content",
            "Resets passwords",
            "Filters malicious traffic",
            "Disables the internet"
        ],
        answer: 2,
        explanation: "Traffic scrubbing filters malicious traffic while allowing legitimate traffic."
    },
    {
        level: "Advanced",
        category: "Password",
        question: "Why are unique salts used in password hashing?",
        options: [
            "To shorten passwords",
            "To make precomputed hash attacks harder",
            "To store plain-text passwords",
            "To remove hashing"
        ],
        answer: 1,
        explanation: "Unique salts make precomputed attacks harder."
    },
    {
        level: "Advanced",
        category: "Spoofing",
        question: "What do SPF, DKIM and DMARC help defend against?",
        options: [
            "Hardware damage",
            "Slow internet",
            "Email domain spoofing",
            "Power failure"
        ],
        answer: 2,
        explanation: "These mechanisms help authenticate email sending domains."
    },
    {
        level: "Advanced",
        category: "Malware",
        question: "What is a zero-day vulnerability?",
        options: [
            "A scheduled update",
            "A vulnerability exploited before an effective fix is available",
            "An antivirus scan",
            "A backup"
        ],
        answer: 1,
        explanation: "A zero-day vulnerability may be exploited before an effective patch is available."
    }
];

const $ = id => document.getElementById(id);

const quizContent = $("quizContent");
const resultContent = $("resultContent");
const playerInput = $("playerName");
const difficultySelect = $("difficulty");
const categorySelect = $("category");
const timerElement = $("timer");
const progressBar = $("progressBar");
const questionCount = $("questionCount");
const progressPercent = $("progressPercent");
const leaderboardBody = $("leaderboardBody");

let quizQuestions = [];
let current = 0;
let score = 0;
let correct = 0;
let incorrect = 0;
let seconds = 20;
let timer = null;
let answered = false;
let active = false;

$("startBtn").addEventListener("click", startQuiz);

function startQuiz() {
    if (!playerInput.value.trim()) {
        alert("Please enter your name!");
        playerInput.focus();
        return;
    }

    clearInterval(timer);

    quizQuestions = questions.filter(q =>
        q.level === difficultySelect.value &&
        (categorySelect.value === "All" ||
         q.category === categorySelect.value)
    );

    if (!quizQuestions.length) {
        alert("No questions available.");
        return;
    }

    quizQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);

    current = 0;
    score = 0;
    correct = 0;
    incorrect = 0;
    active = true;

    resultContent.classList.add("hidden");
    quizContent.classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    clearInterval(timer);

    answered = false;
    seconds = 20;

    const q = quizQuestions[current];
    const percent = Math.round(current / quizQuestions.length * 100);

    questionCount.textContent =
        `Question ${current + 1} of ${quizQuestions.length}`;

    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;

    timerElement.textContent = `⏱ ${seconds}s`;
    timerElement.classList.remove("warning");

    quizContent.innerHTML = `
        <div class="question-area">
            <div class="question-meta">
                <span class="tag">${escapeHTML(q.level)}</span>
                <span class="tag">${escapeHTML(q.category)}</span>
            </div>

            <h3 class="question-text">${escapeHTML(q.question)}</h3>

            <div class="options">
                ${q.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">
                        ${String.fromCharCode(65 + index)}.
                        ${escapeHTML(option)}
                    </button>
                `).join("")}
            </div>

            <div id="feedback" class="feedback hidden"
                 aria-live="polite"></div>

            <div class="quiz-actions">
                <button class="primary-btn hidden" id="nextBtn">
                    ${current === quizQuestions.length - 1
                        ? "View Results →"
                        : "Next Question →"}
                </button>
            </div>
        </div>
    `;

    quizContent.querySelectorAll(".option-btn").forEach(button => {
        button.addEventListener("click", () =>
            selectAnswer(Number(button.dataset.index))
        );
    });

    timer = setInterval(() => {
        if (answered || !active) return;

        seconds--;
        timerElement.textContent = `⏱ ${seconds}s`;

        if (seconds <= 5) {
            timerElement.classList.add("warning");
        }

        if (seconds <= 0) {
            selectAnswer(-1);
        }
    }, 1000);
}

function selectAnswer(index) {
    if (answered || !active) return;

    answered = true;
    clearInterval(timer);

    const q = quizQuestions[current];
    const isCorrect = index === q.answer;

    quizContent.querySelectorAll(".option-btn").forEach((button, i) => {
        button.disabled = true;

        if (i === q.answer) button.classList.add("correct");
        if (i === index && !isCorrect) button.classList.add("incorrect");
    });

    if (isCorrect) {
        correct++;
        score += 10 + Math.floor(seconds / 5);
    } else {
        incorrect++;
    }

    $("feedback").innerHTML = `
        <strong>${isCorrect ? "✓ Correct!" :
            index === -1 ? "⌛ Time is up!" : "✗ Incorrect!"}</strong>
        <span>${escapeHTML(q.explanation)}</span>
    `;

    $("feedback").classList.remove("hidden");
    $("nextBtn").classList.remove("hidden");
}

document.addEventListener("click", event => {
    if (event.target.id !== "nextBtn" || !answered || !active) return;

    current++;

    if (current < quizQuestions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
});

function finishQuiz() {
    active = false;
    clearInterval(timer);

    const percentage = Math.round(correct / quizQuestions.length * 100);

    const result = {
        name: playerInput.value.trim(),
        difficulty: difficultySelect.value,
        score,
        correct,
        incorrect,
        percentage
    };

    saveResult(result);

    progressBar.style.width = "100%";
    progressPercent.textContent = "100%";
    questionCount.textContent = "Quiz completed";
    timerElement.textContent = "✓ Completed";

    quizContent.classList.add("hidden");
    resultContent.classList.remove("hidden");

    resultContent.innerHTML = `
        <div style="text-align:center">
            <div class="welcome-icon">🏆</div>
            <p class="eyebrow">QUIZ COMPLETED</p>
            <h2>Well done, ${escapeHTML(result.name)}!</h2>
            <div class="result-score">${percentage}%</div>
            <p>${percentage >= 80
                ? "Excellent work!"
                : percentage >= 50
                    ? "Good effort! Keep learning."
                    : "Keep practicing!"}</p>

            <div class="result-grid">
                <div class="result-stat">
                    <strong>${score}</strong><span>Total Points</span>
                </div>
                <div class="result-stat">
                    <strong>${correct}</strong><span>Correct</span>
                </div>
                <div class="result-stat">
                    <strong>${incorrect}</strong><span>Incorrect / Timed Out</span>
                </div>
            </div>

            <button class="primary-btn" id="retryBtn">Try Again ↻</button>
            <button class="primary-btn" id="reviewBtn">View Answers</button>
            <div id="reviewContent" class="hidden"
                 style="text-align:left;margin-top:20px"></div>
        </div>
    `;

    $("retryBtn").addEventListener("click", () => {
        resultContent.classList.add("hidden");
        quizContent.classList.remove("hidden");
        startQuiz();
    });

    $("reviewBtn").addEventListener("click", () => {
        const review = $("reviewContent");

        if (!review.classList.contains("hidden")) {
            review.classList.add("hidden");
            return;
        }

        review.innerHTML = quizQuestions.map((q, i) => `
            <div class="feedback">
                <strong>${i + 1}. ${escapeHTML(q.question)}</strong>
                <p>Correct answer: ${escapeHTML(q.options[q.answer])}</p>
                <p>${escapeHTML(q.explanation)}</p>
            </div>
        `).join("");

        review.classList.remove("hidden");
    });

    renderLeaderboard();
}

function saveResult(result) {
    try {
        const results = JSON.parse(
            localStorage.getItem("cyberQuizResults") || "[]"
        );

        results.push(result);
        results.sort((a, b) => b.score - a.score);

        localStorage.setItem(
            "cyberQuizResults",
            JSON.stringify(results.slice(0, 100))
        );
    } catch (error) {
        console.error("Unable to save results:", error);
    }
}

function renderLeaderboard() {
    try {
        const results = JSON.parse(
            localStorage.getItem("cyberQuizResults") || "[]"
        );

        const players = new Map();

        results.forEach(result => {
            const key = result.name.trim().toLowerCase();
            const old = players.get(key);

            if (!old || result.score > old.score) {
                players.set(key, result);
            }
        });

        const top = [...players.values()]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        leaderboardBody.innerHTML = top.length
            ? top.map((p, i) => `
                <tr>
                    <td>${["🥇", "🥈", "🥉"][i] || i + 1}</td>
                    <td>${escapeHTML(p.name)}</td>
                    <td>${escapeHTML(p.difficulty)}</td>
                    <td><strong>${p.score}</strong></td>
                </tr>
            `).join("")
            : `<tr><td colspan="4">No scores yet. Be the first!</td></tr>`;

    } catch (error) {
        leaderboardBody.innerHTML =
            `<tr><td colspan="4">Leaderboard unavailable.</td></tr>`;
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

renderLeaderboard();
