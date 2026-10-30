
const STORAGE_KEY = "cyberQuizScores";

// Demo participants shown when no quiz scores are saved.
const demoPlayers = [
  { name: "Aarav Patel", level: "Advanced", score: 950, quizzes: 12 },
  { name: "Priya Sharma", level: "Intermediate", score: 880, quizzes: 10 },
  { name: "Rahul Shah", level: "Advanced", score: 820, quizzes: 9 },
  { name: "Neha Verma", level: "Beginner", score: 760, quizzes: 8 },
  { name: "Rohan Mehta", level: "Intermediate", score: 720, quizzes: 7 },
  { name: "Ananya Singh", level: "Advanced", score: 680, quizzes: 6 },
  { name: "Karan Joshi", level: "Beginner", score: 620, quizzes: 5 },
  { name: "Isha Desai", level: "Intermediate", score: 570, quizzes: 4 },
  { name: "Dev Kumar", level: "Beginner", score: 490, quizzes: 3 },
  { name: "Meera Gupta", level: "Advanced", score: 430, quizzes: 3 }
];

const podium = document.getElementById("podium");
const leaderboardBody = document.getElementById("leaderboardBody");
const searchInput = document.getElementById("searchInput");
const levelFilter = document.getElementById("levelFilter");
const sortFilter = document.getElementById("sortFilter");
const emptyMessage = document.getElementById("emptyMessage");

// Read participant scores from browser storage.
function getPlayers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed
          .filter(player =>
            player &&
            typeof player.name === "string" &&
            typeof player.score === "number" &&
            Number.isFinite(player.score)
          )
          .map(player => ({
            name: player.name,
            score: Math.max(0, player.score),
            level: ["Beginner", "Intermediate", "Advanced"]
              .includes(player.level)
              ? player.level
              : "Beginner",
            quizzes: Number.isFinite(player.quizzes)
              ? Math.max(0, player.quizzes)
              : 1
          }));
      }
    }
  } catch (error) {
    console.error("Could not read leaderboard data:", error);
  }

  // Use demonstration data if no saved scores exist.
  return demoPlayers.map(player => ({ ...player }));
}

// Escape text before inserting it into HTML.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Sort by score and then alphabetically to break ties.
function getRankedPlayers() {
  return getPlayers().sort((a, b) =>
    b.score - a.score ||
    a.name.localeCompare(b.name)
  );
}

// Render the top three winners.
function renderPodium(players) {
  podium.innerHTML = "";

  const positions = [
    { position: 1, className: "first", medal: "🥇" },
    { position: 2, className: "second", medal: "🥈" },
    { position: 3, className: "third", medal: "🥉" }
  ];

  positions.forEach(item => {
    const player = players[item.position - 1];

    if (!player) return;

    const name = escapeHTML(player.name);
    const initial = escapeHTML(
      player.name.trim().charAt(0).toUpperCase() || "?"
    );
    const level = escapeHTML(player.level);

    const card = document.createElement("article");
    card.className = `winner ${item.className}`;

    card.innerHTML = `
      <div class="winner-badge">${item.medal}</div>
      <div class="avatar">${initial}</div>
      <h3>${name}</h3>
      <p class="level-text">${level} Level</p>
      <div class="score">${player.score.toLocaleString()}</div>
      <p class="score-label">TOTAL POINTS</p>
    `;

    podium.appendChild(card);
  });

  if (players.length === 0) {
    podium.innerHTML =
      '<p class="empty-message">No scores available yet.</p>';
  }
}

// Update the summary statistics.
function renderStats(players) {
  document.getElementById("totalPlayers").textContent =
    players.length.toLocaleString();

  document.getElementById("highestScore").textContent =
    players.length
      ? Math.max(...players.map(player => player.score)).toLocaleString()
      : "0";

  const attempts = players.reduce(
    (total, player) => total + player.quizzes,
    0
  );

  document.getElementById("totalAttempts").textContent =
    attempts.toLocaleString();
}

// Display the complete, filtered leaderboard.
function renderTable(allPlayers) {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedLevel = levelFilter.value;
  const selectedSort = sortFilter.value;

  // Preserve the overall rank when filters are applied.
  const ranked = allPlayers.map((player, index) => ({
    ...player,
    rank: index + 1
  }));

  const filtered = ranked.filter(player => {
    const matchesName = player.name
      .toLowerCase()
      .includes(searchTerm);

    const matchesLevel =
      selectedLevel === "All" ||
      player.level === selectedLevel;

    return matchesName && matchesLevel;
  });

  if (selectedSort === "lowest") {
    filtered.sort((a, b) =>
      a.score - b.score || a.rank - b.rank
    );
  } else if (selectedSort === "name") {
    filtered.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else {
    filtered.sort((a, b) => a.rank - b.rank);
  }

  leaderboardBody.innerHTML = "";

  filtered.forEach(player => {
    const row = document.createElement("tr");

    const rankClass = player.rank <= 3 ? "top-rank" : "";
    const initial = escapeHTML(
      player.name.trim().charAt(0).toUpperCase() || "?"
    );

    row.innerHTML = `
      <td>
        <span class="rank ${rankClass}">#${player.rank}</span>
      </td>
      <td>
        <div class="player-cell">
          <span class="mini-avatar">${initial}</span>
          <span>${escapeHTML(player.name)}</span>
        </div>
      </td>
      <td>
        <span class="level ${player.level.toLowerCase()}">
          ${escapeHTML(player.level)}
        </span>
      </td>
      <td>${player.quizzes}</td>
      <td class="score-cell">${player.score.toLocaleString()} pts</td>
    `;

    leaderboardBody.appendChild(row);
  });

  emptyMessage.hidden = filtered.length !== 0;
}

// Refresh all leaderboard components.
function renderLeaderboard() {
  const players = getRankedPlayers();

  renderStats(players);
  renderPodium(players);
  renderTable(players);
}

// Connect the search and filter controls.
searchInput.addEventListener("input", renderLeaderboard);
levelFilter.addEventListener("change", renderLeaderboard);
sortFilter.addEventListener("change", renderLeaderboard);

// Refresh when the user returns to this browser tab.
window.addEventListener("focus", renderLeaderboard);

window.addEventListener("storage", event => {
  if (event.key === STORAGE_KEY) {
    renderLeaderboard();
  }
});

// Initial page rendering.
renderLeaderboard();
