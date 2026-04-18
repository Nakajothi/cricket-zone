/* ===== live.js - Live Score Engine (CricZone 2026) ===== */
/*
  This frontend no longer stores the CricAPI key.
  Requests go through the local backend proxy:
  - GET /api/currentMatches
  - GET /api/match_scorecard?id=MATCH_ID
*/

let USE_REAL_API = true;
window.USE_REAL_API = USE_REAL_API;

let liveIntervalId = null;
let realAPIIntervalId = null;

function setAPIStatus(message, tone = "info") {
  const text = document.getElementById("api-status-text");
  const panel = document.getElementById("api-status-panel");
  if (!text || !panel) return;
  text.textContent = message;
  panel.dataset.state = tone;
}

async function connectAPI() {
  USE_REAL_API = true;
  window.USE_REAL_API = USE_REAL_API;
  updateAPIBadge("connecting");
  setAPIStatus("Connecting to the secure local CricAPI proxy...", "loading");

  const ok = await fetchLiveScores();
  if (ok) {
    updateAPIBadge("connected");
    setAPIStatus("Live CricAPI mode is active through the local backend proxy. Scores refresh every 30 seconds.", "success");
    showToast("toast-four", "Live API connected", "Real match data is now enabled.");
    if (realAPIIntervalId) clearInterval(realAPIIntervalId);
    realAPIIntervalId = setInterval(fetchLiveScores, 30000);
    return true;
  }

  USE_REAL_API = false;
  window.USE_REAL_API = USE_REAL_API;
  updateAPIBadge("simulated");
  setAPIStatus("Could not reach the local CricAPI proxy. Start server.js and try again.", "error");
  showToast("toast-wicket", "Proxy error", "Start the local server so live scores can load safely.");
  return false;
}

function updateAPIBadge(state) {
  const badge = document.querySelector(".live-dot-badge");
  if (!badge) return;
  const texts = {
    connecting: "LIVE SCORES",
    connected: "LIVE SCORES",
    simulated: "MATCH CENTER"
  };
  badge.lastElementChild.textContent = texts[state] || "SIMULATION";
}

async function fetchLiveScores() {
  if (!USE_REAL_API) return false;
  try {
    const res = await fetch("/api/currentMatches?offset=0");
    const data = await res.json();
    if (data.status !== "success") throw new Error(data.reason || "API failure");

    const apiMatches = (data.data || []).filter(match => match.matchStarted);
    if (!apiMatches.length) {
      setAPIStatus("Proxy connected successfully. No started live matches were returned right now, so existing cards stay visible.", "success");
      return true;
    }

    const apiIds = new Set(apiMatches.map(match => match.id));
    const kept = CricData.matches.filter(match => !apiIds.has(match.id));
    const fresh = apiMatches.map(mapAPIMatch);
    CricData.matches = [...fresh, ...kept];

    renderMatchGrid();
    renderFeaturedMatch(CricData.matches.find(match => match.status === "live"));
    updateTicker();
    return true;
  } catch (error) {
    console.warn("CricAPI proxy fetch failed:", error.message);
    return false;
  }
}

function mapAPIMatch(match) {
  return {
    id: match.id,
    status: match.matchEnded ? "completed" : "live",
    type: match.series_id || match.name || "Live Match",
    team1: {
      name: match.teams?.[0] || "Team 1",
      short: match.teamInfo?.[0]?.shortname || (match.teams?.[0] || "T1").slice(0, 3).toUpperCase(),
      flag: match.teamInfo?.[0]?.shortname || "T1"
    },
    team2: {
      name: match.teams?.[1] || "Team 2",
      short: match.teamInfo?.[1]?.shortname || (match.teams?.[1] || "T2").slice(0, 3).toUpperCase(),
      flag: match.teamInfo?.[1]?.shortname || "T2"
    },
    score1: match.score?.[0] ? `${match.score[0].r}/${match.score[0].w}` : "--",
    overs1: match.score?.[0]?.o?.toString() || "",
    score2: match.score?.[1] ? `${match.score[1].r}/${match.score[1].w}` : "--",
    overs2: match.score?.[1]?.o?.toString() || "",
    venue: match.venue || "TBD",
    summary: match.status || "",
    crr: "--",
    rrr: "--",
    battingTeam: 0,
    commentary: [],
    lastBalls: [],
    batting: [],
    bowling: []
  };
}

async function fetchScorecard(matchId) {
  if (!USE_REAL_API) return null;
  try {
    const res = await fetch(`/api/match_scorecard?id=${encodeURIComponent(matchId)}`);
    const data = await res.json();
    if (data.status !== "success") return null;
    return data.data;
  } catch {
    return null;
  }
}

function mapAPIBatting(scorecard, inningsIdx = 0) {
  try {
    return (scorecard.scorecard?.[inningsIdx]?.batting || []).map(player => ({
      name: player.batsman?.name || player.name || "--",
      runs: player.r ?? 0,
      balls: player.b ?? 0,
      fours: player["4s"] ?? 0,
      sixes: player["6s"] ?? 0,
      sr: player.sr ?? "0",
      status: player.dismissal || "batting"
    }));
  } catch {
    return [];
  }
}

function mapAPIBowling(scorecard, inningsIdx = 0) {
  try {
    return (scorecard.scorecard?.[inningsIdx]?.bowling || []).map(player => ({
      name: player.bowler?.name || player.name || "--",
      overs: player.o ?? "0",
      runs: player.r ?? 0,
      wickets: player.w ?? 0,
      economy: player.eco ?? "0"
    }));
  } catch {
    return [];
  }
}

function simulateLive() {
  const liveMatches = CricData.matches.filter(match => match.status === "live");
  liveMatches.forEach(match => {
    if (!match.score1 || match.score1 === "--") return;
    advanceMatch(match);
  });
  renderFeaturedMatch(CricData.matches.find(match => match.status === "live"));
  renderMatchGrid();
  updateTicker();
}

function advanceMatch(match) {
  const events = ["dot", "1", "2", "4", "6", "W", "Wd", "NB"];
  const weights = [0.24, 0.24, 0.1, 0.18, 0.1, 0.06, 0.05, 0.03];
  let roll = Math.random();
  let cumulative = 0;
  let event = "dot";

  for (let i = 0; i < events.length; i++) {
    cumulative += weights[i];
    if (roll <= cumulative) {
      event = events[i];
      break;
    }
  }

  const parts = (match.score1 || "0/0").split("/");
  let runs = parseInt(parts[0], 10) || 0;
  let wickets = parseInt(parts[1], 10) || 0;
  const overs = parseFloat(match.overs1) || 0;
  const completedBalls = Math.round((overs % 1) * 10);
  const completedOvers = Math.floor(overs);
  let totalBalls = completedOvers * 6 + completedBalls;

  let symbol = ".";
  switch (event) {
    case "1":
      runs += 1;
      symbol = "1";
      totalBalls++;
      break;
    case "2":
      runs += 2;
      symbol = "2";
      totalBalls++;
      break;
    case "4":
      runs += 4;
      symbol = "4";
      totalBalls++;
      showToast("toast-four", "FOUR", `${match.team1.short} found the boundary.`);
      break;
    case "6":
      runs += 6;
      symbol = "6";
      totalBalls++;
      showToast("toast-six", "SIX", `${match.team1.short} cleared the ropes.`);
      break;
    case "W":
      wickets = Math.min(wickets + 1, 10);
      symbol = "W";
      totalBalls++;
      showToast("toast-wicket", "WICKET", `${match.team1.short} lost a wicket.`);
      break;
    case "Wd":
      runs += 1;
      symbol = "Wd";
      break;
    case "NB":
      runs += 1;
      symbol = "NB";
      break;
    default:
      totalBalls++;
      break;
  }

  const newOvers = Math.floor(totalBalls / 6);
  const newBalls = totalBalls % 6;
  match.score1 = `${runs}/${wickets}`;
  match.overs1 = `${newOvers}.${newBalls}`;

  const target = parseInt((match.score2 || "0").split("/")[0], 10) + 1;
  if (target > 1) {
    const ballsLeft = 120 - totalBalls;
    const need = target - runs;
    if (need <= 0) match.summary = `${match.team1.short} won the chase`;
    else if (ballsLeft > 0) match.summary = `${match.team1.short} need ${need} off ${ballsLeft} balls`;
    match.crr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(1) : "0.0";
    match.rrr = ballsLeft > 0 ? ((need / ballsLeft) * 6).toFixed(1) : "--";
  }

  match.lastBalls = match.lastBalls || [];
  match.lastBalls.unshift(symbol);
  if (match.lastBalls.length > 12) match.lastBalls.pop();

  const pool = CricData.liveSim.commentaryPool;
  if (!match._commIdx) match._commIdx = 0;
  const prefix = event === "4" ? "FOUR! " : event === "6" ? "SIX! " : event === "W" ? "WICKET! " : "";
  const text = `${match.overs1} | ${prefix}${pool[match._commIdx++ % pool.length]}`;
  match.commentary = [text, ...(match.commentary || [])].slice(0, 10);
}

function initTicker() {
  updateTicker();
}

function updateTicker() {
  const track = document.getElementById("ticker");
  if (!track) return;
  const live = CricData.matches.filter(match => match.status === "live");
  if (!live.length) {
    track.textContent = "No live matches right now";
    return;
  }
  const items = [...live, ...live].map(match =>
    `<div class="ticker-item"><strong>${match.team1.short}</strong> ${match.score1 || "--"} vs <strong>${match.team2.short}</strong> ${match.score2 || "--"} <span style="opacity:.6">${match.summary || ""}</span></div><span class="ticker-dot">*</span>`
  ).join("");
  track.innerHTML = items;
}

function showToast(type, title, msg) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = {
    "toast-wicket": "W",
    "toast-six": "6",
    "toast-four": "4",
    "toast-milestone": "+"
  };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || "i"}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ""}
    </div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 350);
  }, 3800);
}

function startLiveEngine() {
  initTicker();
  if (liveIntervalId) clearInterval(liveIntervalId);
  liveIntervalId = setInterval(simulateLive, 3800);
}

function stopLiveEngine() {
  clearInterval(liveIntervalId);
  clearInterval(realAPIIntervalId);
}

window.connectAPI = connectAPI;
window.fetchLiveScores = fetchLiveScores;
window.fetchScorecard = fetchScorecard;
window.mapAPIBatting = mapAPIBatting;
window.mapAPIBowling = mapAPIBowling;
window.startLiveEngine = startLiveEngine;
window.stopLiveEngine = stopLiveEngine;
window.showToast = showToast;
window.updateTicker = updateTicker;
window.setAPIStatus = setAPIStatus;
