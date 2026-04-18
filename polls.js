/* ===== polls.js - Poll Engine ===== */

const PollEngine = {
  currentPoll: null,
  userAnswered: false,
  countdown: 180,
  countdownTimer: null,
  userPoints: 0,

  leaderboard: [
    { name: "Arjun K", pts: 340, correct: 22, av: "AJ" },
    { name: "Priya M", pts: 295, correct: 18, av: "PM" },
    { name: "Ravi S", pts: 260, correct: 16, av: "RS" },
    { name: "You", pts: 0, correct: 0, av: "YU" },
    { name: "Sneha R", pts: 220, correct: 13, av: "SR" },
    { name: "Kiran T", pts: 195, correct: 12, av: "KT" },
    { name: "Meena P", pts: 175, correct: 10, av: "MP" },
    { name: "Vikas N", pts: 150, correct: 9, av: "VN" }
  ],

  loadPoll() {
    const button = document.getElementById("btn-new-poll");
    if (button) button.disabled = true;

    const card = document.getElementById("poll-question-wrap");
    if (card) card.innerHTML = `<div class="loading-wrap"><div class="spinner"></div><span>Building a match poll...</span></div>`;

    const featured = CricData.matches.find(match => match.status === "live") || CricData.matches[0];
    const fallbacks = this.buildFallbacks(featured);
    const poll = fallbacks[Math.floor(Math.random() * fallbacks.length)];

    this.currentPoll = poll;
    this.userAnswered = false;
    this.countdown = 180;
    this.renderPoll(featured);
    this.startCountdown();
    if (button) button.disabled = false;
  },

  buildFallbacks(match) {
    const team1 = match?.team1?.name || "Team 1";
    const team2 = match?.team2?.name || "Team 2";
    const short1 = match?.team1?.short || "T1";
    const short2 = match?.team2?.short || "T2";

    return [
      {
        question: `Who wins ${short1} vs ${short2}?`,
        options: [`${short1} comfortably`, `${short1} in a close finish`, `${short2} comeback`, "Super over drama"],
        correctIndex: 1,
        points: 15,
        explanation: `${team1} look slightly ahead, but the game still feels tight.`
      },
      {
        question: "How many runs come next over?",
        options: ["0-6 runs", "7-11 runs", "12-17 runs", "18+ runs"],
        correctIndex: 2,
        points: 20,
        explanation: "The match is in an attacking phase, so a high-scoring over is very possible."
      },
      {
        question: "Will there be a wicket soon?",
        options: ["Yes, caught", "Yes, bowled or lbw", "No wicket", "Only extras"],
        correctIndex: 2,
        points: 10,
        explanation: "Set batters often survive this phase even while taking risks."
      }
    ];
  },

  renderPoll(match) {
    const wrap = document.getElementById("poll-question-wrap");
    if (!wrap || !this.currentPoll) return;

    const poll = this.currentPoll;
    const label = match ? `${match.team1.short} vs ${match.team2.short} - Match Poll` : "Match Poll";
    const rawVotes = poll.options.map((_, i) => i === poll.correctIndex ? 40 + Math.random() * 20 : 15 + Math.random() * 25);
    const total = rawVotes.reduce((a, b) => a + b, 0);
    const pcts = rawVotes.map(v => Math.round((v / total) * 100));

    wrap.innerHTML = `
      <div class="poll-header">
        <span class="poll-match-label">${label}</span>
        <span class="poll-ai-tag">Demo poll mode</span>
      </div>
      <div class="poll-question">${poll.question}</div>
      <div class="poll-options" id="poll-options">
        ${poll.options.map((opt, i) => `
          <div class="poll-option" data-idx="${i}" onclick="PollEngine.vote(${i})">
            <div class="poll-option-fill" style="width:${this.userAnswered ? pcts[i] : 0}%"></div>
            <span class="poll-option-text">${opt}</span>
            ${this.userAnswered ? `<span class="poll-option-pct">${pcts[i]}%</span>` : ""}
          </div>`).join("")}
      </div>
      <div class="poll-timer">
        <span>Poll closes in</span>
        <span class="poll-countdown" id="poll-countdown">${this._fmt(this.countdown)}</span>
      </div>
      <button class="btn-new-poll" id="btn-new-poll" onclick="PollEngine.loadPoll()" ${this.userAnswered ? "" : "disabled"}>
        Generate New Poll
      </button>`;
  },

  vote(idx) {
    if (this.userAnswered || !this.currentPoll) return;
    this.userAnswered = true;
    const poll = this.currentPoll;
    const isCorrect = idx === poll.correctIndex;

    document.querySelectorAll(".poll-option").forEach((el, i) => {
      if (i === idx) el.classList.add("selected");
      if (i === poll.correctIndex) el.classList.add("correct");
      if (i === idx && !isCorrect) el.classList.add("wrong");
    });

    if (isCorrect) {
      const pts = poll.points;
      this.userPoints += pts;
      const youRow = this.leaderboard.find(entry => entry.name === "You");
      if (youRow) {
        youRow.pts += pts;
        youRow.correct++;
      }
      showToast("toast-four", `Correct +${pts} pts`, poll.explanation || "");
    } else {
      showToast("toast-wicket", "Not this time", poll.explanation || "");
    }

    const rawVotes = poll.options.map((_, i) => i === poll.correctIndex ? 40 + Math.random() * 20 : 15 + Math.random() * 25);
    const total = rawVotes.reduce((a, b) => a + b, 0);
    const pcts = rawVotes.map(v => Math.round((v / total) * 100));

    document.querySelectorAll(".poll-option").forEach((el, i) => {
      el.querySelector(".poll-option-fill").style.width = `${pcts[i]}%`;
      if (!el.querySelector(".poll-option-pct")) {
        const span = document.createElement("span");
        span.className = "poll-option-pct";
        span.textContent = `${pcts[i]}%`;
        el.appendChild(span);
      }
    });

    const button = document.getElementById("btn-new-poll");
    if (button) button.disabled = false;
    renderPollLeaderboard();
  },

  startCountdown() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      this.countdown--;
      const el = document.getElementById("poll-countdown");
      if (el) el.textContent = this._fmt(this.countdown);
      if (this.countdown <= 0) {
        clearInterval(this.countdownTimer);
        this.loadPoll();
      }
    }, 1000);
  },

  _fmt(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }
};

function renderPollLeaderboard() {
  const el = document.getElementById("poll-lb-list");
  if (!el) return;
  const sorted = [...PollEngine.leaderboard].sort((a, b) => b.pts - a.pts);
  const badges = ["g", "s", "b"];
  el.innerHTML = sorted.map((user, i) => `
    <div class="poll-lb-entry">
      <div class="poll-lb-rank ${badges[i] || ""}">${i + 1}</div>
      <div class="poll-lb-avatar" style="${user.name === "You" ? "border-color:var(--gold);background:rgba(240,180,41,0.1)" : ""}">${user.av}</div>
      <div class="poll-lb-name" style="${user.name === "You" ? "color:var(--gold)" : ""}">${user.name}</div>
      <div>
        <div class="poll-lb-pts ${user.name === "You" ? "points-updated" : ""}">${user.pts} pts</div>
        <div class="poll-lb-correct">${user.correct} correct</div>
      </div>
    </div>`).join("");
}

function simulateOtherAnswers() {
  PollEngine.leaderboard.forEach(user => {
    if (user.name === "You") return;
    if (Math.random() < 0.3) {
      user.pts += Math.floor(Math.random() * 15) + 5;
      user.correct += Math.random() < 0.6 ? 1 : 0;
    }
  });
}

window.PollEngine = PollEngine;
window.renderPollLeaderboard = renderPollLeaderboard;
window.simulateOtherAnswers = simulateOtherAnswers;
