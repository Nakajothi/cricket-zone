/* ===== app.js - Main Application Controller ===== */

function navigateTo(page) {
  document.querySelectorAll(".page").forEach(section => section.classList.remove("active"));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add("active");

  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add("active");

  if (page === "tournaments") renderTournaments();
  if (page === "rankings") renderRankings("batting");
  if (page === "rooms") renderRoomsList();
  if (page === "polls") {
    renderPollLeaderboard();
    if (!PollEngine.currentPoll) PollEngine.loadPoll();
  }
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => navigateTo(link.dataset.page));
});

function renderFeaturedMatch(match) {
  const wrap = document.getElementById("featured-match");
  if (!wrap) return;

  if (!match) {
    wrap.innerHTML = `<div class="empty-state"><div class="icon">CR</div><p>No live matches right now</p></div>`;
    return;
  }

  const balls = (match.lastBalls || []).map(ball => {
    let cls = "ball-dot";
    if (ball === "4") cls = "ball-four";
    else if (ball === "6") cls = "ball-six";
    else if (ball === "W") cls = "ball-wicket";
    else if (ball === "Wd" || ball === "NB") cls = "ball-wide";
    else if (![".", "·", "Â·"].includes(ball)) cls = "ball-run";
    return `<div class="ball ${cls}">${ball}</div>`;
  }).join("");

  const commentary = (match.commentary || []).slice(0, 5).map((line, i) => {
    const parts = line.split("|");
    const ball = parts[0]?.trim() || "";
    const text = parts[1]?.trim() || line;
    return `<div class="comm-row"><span class="comm-ball">${ball}</span><span class="comm-text ${i === 0 ? "hot" : ""}">${text}</span></div>`;
  }).join("");

  const isLive = match.status === "live";
  const badge = isLive
    ? `<div class="fm-badge"><span class="dot"></span>LIVE</div>`
    : `<div style="background:rgba(76,201,240,0.15);color:var(--blue);border:1px solid rgba(76,201,240,0.3);font-family:var(--font-h);font-size:12px;letter-spacing:1.5px;padding:3px 10px;border-radius:4px;">UPCOMING</div>`;

  wrap.innerHTML = `
    <div class="fm-header">
      ${badge}
      <span class="fm-tournament">${match.type}</span>
      <span class="fm-venue">${match.venue}</span>
    </div>
    <div class="fm-scoreboard">
      <div class="fm-team">
        <div class="fm-team-emoji">${match.team1.flag}</div>
        <div class="fm-team-info">
          <div class="fm-team-name">${match.team1.name}</div>
          <div class="fm-team-score">${match.score1 || "--"}</div>
          <div class="fm-team-overs">${match.overs1 ? `(${match.overs1} ov)` : ""}</div>
        </div>
      </div>
      <div class="fm-vs">VS</div>
      <div class="fm-team right" style="justify-content:flex-end;">
        <div class="fm-team-info right">
          <div class="fm-team-name">${match.team2.name}</div>
          <div class="fm-team-score">${match.score2 || "--"}</div>
          <div class="fm-team-overs">${match.overs2 ? `(${match.overs2} ov)` : ""}</div>
        </div>
        <div class="fm-team-emoji">${match.team2.flag}</div>
      </div>
    </div>
    ${match.summary ? `
      <div class="fm-footer">
        <span class="fm-status">${match.summary}</span>
        <div class="fm-stats">
          ${match.crr && match.crr !== "--" ? `<span class="fm-stat">CRR <strong>${match.crr}</strong></span>` : ""}
          ${match.rrr && match.rrr !== "--" ? `<span class="fm-stat">RRR <strong>${match.rrr}</strong></span>` : ""}
          ${match.currentBowler ? `<span class="fm-stat">Bowling: <strong>${match.currentBowler.name}</strong> ${match.currentBowler.overs} ov ${match.currentBowler.runs}/${match.currentBowler.wickets}</span>` : ""}
        </div>
      </div>` : ""}
    ${match.currentBatters?.length ? `
      <div class="batters-strip">
        ${match.currentBatters.map(batter => `
          <div class="batter-card">
            <div class="batter-name">${batter.name}</div>
            <div class="batter-score">${batter.runs}<span style="font-size:14px;color:var(--muted);">(${batter.balls})</span></div>
            <div class="batter-balls">4s: ${batter.fours} | 6s: ${batter.sixes} | SR: ${batter.sr}</div>
          </div>`).join("")}
        ${match.currentBowler ? `
          <div class="batter-card batter-bowling">
            <div class="batter-name">${match.currentBowler.name}</div>
            <div class="batter-score">${match.currentBowler.wickets}/${match.currentBowler.runs}</div>
            <div class="batter-balls">${match.currentBowler.overs} ov | Eco: ${match.currentBowler.economy}</div>
          </div>` : ""}
      </div>` : ""}
    ${balls ? `<div class="over-balls" style="padding:10px 24px;">${balls}</div>` : ""}
    ${commentary ? `<div class="commentary-strip">${commentary}</div>` : ""}
  `;
}

function renderMatchGrid(filter) {
  const grid = document.getElementById("match-grid");
  if (!grid) return;

  const activeFilter = filter ?? (document.querySelector("#match-filters .filter-btn.active")?.dataset.filter ?? "all");
  const matches = activeFilter === "all" ? CricData.matches : CricData.matches.filter(match => match.status === activeFilter);

  if (!matches.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="icon">CR</div><p>No matches found</p></div>`;
    return;
  }

  grid.innerHTML = matches.map(match => {
    const badgeCls = match.status === "live" ? "badge-live" : match.status === "upcoming" ? "badge-upcoming" : "badge-completed";
    const badgeTxt = match.status === "live" ? "LIVE" : match.status === "upcoming" ? "UPCOMING" : "DONE";
    const isWinner = match.status === "completed";
    const team2Won = isWinner && match.summary?.toLowerCase().includes(match.team2.short.toLowerCase());
    const balls = (match.lastBalls || []).map(ball => {
      let cls = "ball-dot";
      if (ball === "4") cls = "ball-four";
      else if (ball === "6") cls = "ball-six";
      else if (ball === "W") cls = "ball-wicket";
      else if (ball === "Wd" || ball === "NB") cls = "ball-wide";
      else if (![".", "·", "Â·"].includes(ball)) cls = "ball-run";
      return `<div class="ball ${cls}" style="width:26px;height:26px;font-size:10px;">${ball}</div>`;
    }).join("");

    return `
      <div class="match-card" onclick="showMatchDetail('${match.id}')">
        <div class="match-card-header">
          <span class="match-card-type">${match.type}</span>
          <span class="match-status-badge ${badgeCls}">${badgeTxt}</span>
        </div>
        <div class="match-teams">
          <div class="match-team-row">
            <span class="match-team-name ${!team2Won && isWinner ? "winning-team" : ""}">${match.team1.flag} ${match.team1.name}</span>
            <span class="match-team-score">${match.score1 || "--"}</span>
          </div>
          <div style="height:1px;background:var(--border);margin:6px 0;"></div>
          <div class="match-team-row">
            <span class="match-team-name ${team2Won ? "winning-team" : ""}">${match.team2.flag} ${match.team2.name}</span>
            <span class="match-team-score">${match.score2 || "--"}</span>
          </div>
        </div>
        <div class="match-footer">
          ${match.venue}
          ${match.status === "live" ? `<span style="float:right;color:var(--gold);font-family:var(--font-m);font-size:11px;">CRR ${match.crr}</span>` : ""}
          ${match.summary && match.status !== "live" ? `<div style="margin-top:4px;color:var(--teal);font-size:12px;">${match.summary}</div>` : ""}
        </div>
        ${match.status === "live" && balls ? `<div class="over-balls" style="padding:8px 0 0;">${balls}</div>` : ""}
      </div>`;
  }).join("");
}

document.getElementById("match-filters")?.addEventListener("click", event => {
  if (!event.target.classList.contains("filter-btn")) return;
  document.querySelectorAll("#match-filters .filter-btn").forEach(button => button.classList.remove("active"));
  event.target.classList.add("active");
  renderMatchGrid(event.target.dataset.filter);
});

async function showMatchDetail(matchId) {
  const match = CricData.matches.find(item => item.id === matchId);
  if (!match) return;

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay open";
  overlay.style.zIndex = "250";
  overlay.onclick = event => {
    if (event.target === overlay) overlay.remove();
  };

  let batting = match.batting || [];
  let bowling = match.bowling || [];
  let extraMsg = "";

  if (match.status === "live" && window.USE_REAL_API) {
    overlay.innerHTML = `<div class="modal"><div class="loading-wrap"><div class="spinner"></div><span>Fetching live scorecard...</span></div></div>`;
    document.body.appendChild(overlay);
    const scorecard = await fetchScorecard(matchId);
    if (scorecard) {
      batting = mapAPIBatting(scorecard, 0) || batting;
      bowling = mapAPIBowling(scorecard, 0) || bowling;
      extraMsg = `<div style="font-size:11px;color:var(--teal);margin-bottom:12px;">Live scorecard loaded through the local proxy</div>`;
    }
  }

  const battingRows = batting.length ? batting.map(player => `
    <tr>
      <td><div class="batting-name">${player.name}</div><div style="font-size:11px;color:var(--muted);">${player.status === "batting" ? "Batting" : player.status || ""}</div></td>
      <td class="runs-cell">${player.runs}</td>
      <td>${player.balls}</td><td>${player.fours}</td><td>${player.sixes}</td>
      <td style="color:var(--gold);font-family:var(--font-m);font-size:12px;">${player.sr}</td>
    </tr>`).join("") : `<tr><td colspan="6" style="color:var(--muted);padding:14px;text-align:center;">No batting data yet</td></tr>`;

  const bowlingRows = bowling.length ? bowling.map(player => `
    <tr>
      <td class="batting-name">${player.name}</td>
      <td>${player.overs}</td><td>${player.runs}</td>
      <td class="wkt-cell">${player.wickets}</td>
      <td style="color:var(--blue);font-family:var(--font-m);font-size:12px;">${player.economy}</td>
    </tr>`).join("") : `<tr><td colspan="5" style="color:var(--muted);padding:14px;text-align:center;">No bowling data yet</td></tr>`;

  const commentary = (match.commentary || []).slice(0, 8).map(line => {
    const parts = line.split("|");
    const cls = line.includes("FOUR") ? "event-four" : line.includes("SIX") ? "event-six" : line.includes("WICKET") ? "event-wkt" : "";
    return `<div class="comm-item ${cls}"><span class="ball-tag">${parts[0]?.trim() || "--"}</span><span class="comm-item-text">${parts[1]?.trim() || line}</span></div>`;
  }).join("");

  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">X</button>
      <h2>${match.team1.name} vs ${match.team2.name}</h2>
      <div class="modal-subtitle">${match.venue} | ${match.type}</div>
      ${extraMsg}
      <div style="display:flex;gap:24px;font-family:var(--font-h);font-size:28px;font-weight:700;margin-bottom:8px;">
        <span style="color:var(--gold);">${match.score1 || "--"}</span>
        <span style="color:var(--muted);">VS</span>
        <span>${match.score2 || "--"}</span>
      </div>
      ${match.summary ? `<div style="color:var(--teal);font-size:14px;font-weight:600;margin-bottom:16px;">${match.summary}</div>` : ""}

      <div class="table-section-label">Batting - ${match.team1.name}</div>
      <div class="scorecard-table-wrap">
        <table class="scorecard-table">
          <thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr></thead>
          <tbody>${battingRows}</tbody>
        </table>
      </div>

      <div class="table-section-label">Bowling</div>
      <div class="scorecard-table-wrap">
        <table class="scorecard-table">
          <thead><tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>Eco</th></tr></thead>
          <tbody>${bowlingRows}</tbody>
        </table>
      </div>

      ${commentary ? `<div class="table-section-label">Commentary</div><div class="comm-list">${commentary}</div>` : ""}
    </div>`;

  if (!document.body.contains(overlay)) document.body.appendChild(overlay);
}

function renderTournaments() {
  const hero = document.getElementById("tournament-hero");
  const schedule = document.getElementById("tournament-schedule");
  if (!hero) return;

  hero.innerHTML = CricData.tournaments.map(tournament => `
    <div class="tournament-card ${tournament.className}">
      <div class="tc-flag">${tournament.flag}</div>
      <div class="tc-name">${tournament.name}</div>
      <div class="tc-format">${tournament.format}</div>
      <div class="tc-stats">
        <div class="tc-stat-item"><span class="tc-stat-label">Matches</span><span class="tc-stat-value">${tournament.matches}</span></div>
        <div class="tc-stat-item"><span class="tc-stat-label">Teams</span><span class="tc-stat-value">${tournament.teams}</span></div>
        <div class="tc-stat-item"><span class="tc-stat-label">Prize</span><span class="tc-stat-value" style="font-size:16px;">${tournament.prizePool}</span></div>
      </div>
      <span class="tc-status ${tournament.status === "ongoing" ? "tc-ongoing" : "tc-upcoming"}">
        ${tournament.status === "ongoing" ? "ONGOING" : "UPCOMING"}
      </span>
    </div>`).join("");

  if (!schedule) return;
  schedule.innerHTML = `
    <h2>IPL 2026 Schedule</h2>
    <div class="schedule-list">
      ${CricData.schedule.map(item => `
        <div class="schedule-item">
          <span class="si-date">${item.date}</span>
          <span class="si-match">${item.match}</span>
          <span class="si-venue">${item.venue}</span>
          <span class="si-type">${item.type}</span>
          <span class="si-status ${item.status === "live" ? "si-live" : "si-upcoming"}">
            ${item.status === "live" ? "LIVE" : "UPCOMING"}
          </span>
        </div>`).join("")}
    </div>`;
}

function renderRankings(type) {
  const purpleEl = document.getElementById("purple-cap-name");
  const orangeEl = document.getElementById("orange-cap-name");
  const purpleStat = document.getElementById("purple-cap-stat");
  const orangeStat = document.getElementById("orange-cap-stat");
  if (purpleEl) purpleEl.textContent = CricData.purpleCap.name;
  if (orangeEl) orangeEl.textContent = CricData.orangeCap.name;
  if (purpleStat) purpleStat.textContent = `${CricData.purpleCap.wickets} Wickets`;
  if (orangeStat) orangeStat.textContent = `${CricData.orangeCap.runs} Runs`;

  const data = CricData.rankings[type] || CricData.rankings.batting;
  const tbody = document.getElementById("rankings-body");
  const thead = document.querySelector(".rankings-table thead tr");
  if (!tbody) return;

  if (type === "bowling") {
    if (thead) thead.innerHTML = "<th>#</th><th colspan='2'>Player</th><th>Team</th><th>Mat</th><th>Wkts</th><th>Avg</th><th>Eco</th><th>SR</th>";
    tbody.innerHTML = data.map((player, i) => `
      <tr class="${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : ""}">
        <td class="rank-num">${player.rank}</td>
        <td style="font-size:18px;">${player.flag}</td>
        <td><div class="player-name">${player.name}</div></td>
        <td style="color:var(--muted);font-size:12px;">${player.team}</td>
        <td>${player.mat}</td>
        <td><strong style="font-family:var(--font-h);font-size:18px;">${player.wickets}</strong></td>
        <td>${player.avg}</td><td>${player.econ}</td><td>${player.sr}</td>
      </tr>`).join("");
  } else if (type === "allrounder") {
    if (thead) thead.innerHTML = "<th>#</th><th colspan='2'>Player</th><th>Team</th><th>Mat</th><th>Runs</th><th>Wkts</th><th>Avg</th>";
    tbody.innerHTML = data.map((player, i) => `
      <tr class="${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : ""}">
        <td class="rank-num">${player.rank}</td>
        <td style="font-size:18px;">${player.flag}</td>
        <td><div class="player-name">${player.name}</div></td>
        <td style="color:var(--muted);font-size:12px;">${player.team}</td>
        <td>${player.mat}</td>
        <td>${player.runs}</td>
        <td style="color:var(--red);font-family:var(--font-m);font-size:12px;">${player.wickets}</td>
        <td>${player.avg}</td>
      </tr>`).join("");
  } else {
    if (thead) thead.innerHTML = "<th>#</th><th colspan='2'>Player</th><th>Team</th><th>Mat</th><th>Runs</th><th>Avg</th><th>SR</th><th>100s</th>";
    tbody.innerHTML = data.map((player, i) => `
      <tr class="${i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : ""}">
        <td class="rank-num">${player.rank}</td>
        <td style="font-size:18px;">${player.flag}</td>
        <td><div class="player-name">${player.name}</div></td>
        <td style="color:var(--muted);font-size:12px;">${player.team}</td>
        <td>${player.mat}</td>
        <td><strong style="font-family:var(--font-h);font-size:18px;">${player.runs}</strong></td>
        <td>${player.avg}</td><td>${player.sr}</td><td>${player.hundreds}</td>
      </tr>`).join("");
  }
}

document.getElementById("rank-filters")?.addEventListener("click", event => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;
  document.querySelectorAll("#rank-filters .filter-btn").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  renderRankings(button.dataset.rank);
});

function handleAPIConnect() {
  connectAPI();
}

function restoreSavedAPIKey() {
  connectAPI();
}

function init() {
  renderFeaturedMatch(CricData.matches.find(match => match.status === "live"));
  renderMatchGrid("all");
  updateTicker();
  startLiveEngine();
  renderRoomsList();
  renderPollLeaderboard();
  renderRankings("batting");
  renderTournaments();
  restoreSavedAPIKey();

  setInterval(() => {
    simulateOtherAnswers();
    renderPollLeaderboard();
  }, 9000);

  setTimeout(() => {
    if (!PollEngine.currentPoll) PollEngine.loadPoll();
  }, 1200);
}

window.navigateTo = navigateTo;
window.showMatchDetail = showMatchDetail;
window.renderMatchGrid = renderMatchGrid;
window.renderFeaturedMatch = renderFeaturedMatch;
window.renderTournaments = renderTournaments;
window.renderRankings = renderRankings;
window.handleAPIConnect = handleAPIConnect;

document.addEventListener("DOMContentLoaded", init);
