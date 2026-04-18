/* ===== rooms.js - Friend Rooms ===== */

const RoomsEngine = {
  rooms: [],
  activeRoomId: null,

  createRoom(name, userName, matchId) {
    const match = CricData.matches.find(m => m.id === matchId);
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const room = {
      id: code,
      name,
      code,
      matchId,
      matchLabel: match ? `${match.team1.short} vs ${match.team2.short}` : "IPL 2026",
      members: [{ name: userName, av: userName.slice(0, 2).toUpperCase(), pts: 0, correct: 0 }],
      polls: []
    };
    this.rooms.push(room);
    return room;
  },

  joinRoom(code, userName) {
    const room = this.rooms.find(r => r.code === code.toUpperCase());
    if (!room) return null;
    if (!room.members.find(member => member.name === userName)) {
      room.members.push({ name: userName, av: userName.slice(0, 2).toUpperCase(), pts: 0, correct: 0 });
    }
    return room;
  },

  getRoom(id) {
    return this.rooms.find(room => room.id === id);
  },

  addFakeMembers(room) {
    const fakes = [
      { name: "Priya", av: "PR" },
      { name: "Ravi", av: "RV" },
      { name: "Sneha", av: "SN" },
      { name: "Kiran", av: "KR" }
    ];
    fakes.slice(0, 2 + Math.floor(Math.random() * 3)).forEach(fake => {
      if (!room.members.find(member => member.name === fake.name)) {
        room.members.push({ ...fake, pts: Math.floor(Math.random() * 150) + 10, correct: Math.floor(Math.random() * 10) });
      }
    });
  }
};

function renderRoomsList() {
  const list = document.getElementById("rooms-list");
  if (!list) return;
  if (!RoomsEngine.rooms.length) {
    list.innerHTML = `<div class="empty-state"><div class="icon">RM</div><p>No rooms yet. Create one to start.</p></div>`;
    return;
  }
  list.innerHTML = RoomsEngine.rooms.map(room => `
    <div class="room-item ${room.id === RoomsEngine.activeRoomId ? "active" : ""}" onclick="selectRoom('${room.id}')">
      <div class="room-item-name">${room.name}</div>
      <div class="room-item-meta">${room.members.length} members · ${room.matchLabel}</div>
    </div>`).join("");
}

function selectRoom(id) {
  RoomsEngine.activeRoomId = id;
  const room = RoomsEngine.getRoom(id);
  if (!room) return;
  renderRoomsList();

  const panel = document.getElementById("active-room-panel");
  if (!panel) return;

  const sorted = [...room.members].sort((a, b) => b.pts - a.pts);
  const ranks = ["gold", "silver", "bronze"];

  panel.innerHTML = `
    <div class="room-panel-header">
      <span class="room-panel-name">${room.name}</span>
      <span class="room-code-badge">${room.code}</span>
      <button onclick="copyRoomCode('${room.code}')" style="background:none;border:1px solid var(--border2);color:var(--muted);border-radius:5px;padding:3px 10px;font-size:11px;cursor:pointer;margin-left:auto;">Copy Code</button>
    </div>
    <div class="room-content">
      <div class="room-leaderboard">
        <h3>Leaderboard</h3>
        ${sorted.map((member, i) => `
          <div class="lb-entry">
            <div class="lb-rank ${ranks[i] || ""}">${i + 1}</div>
            <div class="lb-name">${member.name}</div>
            <div class="lb-points">${member.pts} pts</div>
          </div>`).join("")}
      </div>
      <div class="room-polls" style="padding:16px 20px;">
        <h3 style="font-family:var(--font-h);font-size:18px;letter-spacing:1px;color:var(--purple);margin-bottom:12px;">Active Match</h3>
        ${renderRoomMatchInfo(room.matchId)}
      </div>
    </div>`;
}

function renderRoomMatchInfo(matchId) {
  const match = CricData.matches.find(item => item.id === matchId);
  if (!match) return `<div style="color:var(--muted);font-size:13px;">Match data unavailable</div>`;
  const badge = match.status === "live"
    ? `<span style="background:var(--red);color:#fff;font-family:var(--font-h);font-size:11px;letter-spacing:1px;padding:2px 8px;border-radius:3px;">LIVE</span>`
    : "";
  return `
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:14px;">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">${match.type} ${badge}</div>
      <div style="font-family:var(--font-h);font-size:20px;">${match.team1.flag} ${match.team1.name}</div>
      <div style="font-family:var(--font-h);font-size:28px;color:var(--gold);">${match.score1 || "--"}</div>
      <div style="font-size:12px;color:var(--muted);margin:4px 0 10px;">${match.overs1 ? `(${match.overs1} ov)` : ""}</div>
      <div style="font-family:var(--font-h);font-size:20px;">${match.team2.flag} ${match.team2.name}</div>
      <div style="font-family:var(--font-h);font-size:28px;color:var(--white);">${match.score2 || "--"}</div>
      <div style="margin-top:10px;font-size:13px;color:var(--teal);font-weight:600;">${match.summary || ""}</div>
    </div>`;
}

function showRoomModal() {
  const select = document.getElementById("room-match-select");
  if (select) {
    select.innerHTML = CricData.matches.map(match =>
      `<option value="${match.id}">${match.team1.name} vs ${match.team2.name} - ${match.type}</option>`
    ).join("");
  }
  const display = document.getElementById("room-code-display");
  if (display) display.style.display = "none";
  const overlay = document.getElementById("room-modal");
  if (overlay) overlay.classList.add("open");
}

function closeRoomModal() {
  const overlay = document.getElementById("room-modal");
  if (overlay) overlay.classList.remove("open");
}

function createRoom() {
  const name = (document.getElementById("room-name-input")?.value || "").trim();
  const user = (document.getElementById("user-name-input")?.value || "").trim();
  const matchId = document.getElementById("room-match-select")?.value;
  if (!name || !user) {
    showToast("toast-wicket", "Fill all fields", "Room name and your name are required.");
    return;
  }
  const room = RoomsEngine.createRoom(name, user, matchId);
  RoomsEngine.addFakeMembers(room);
  const display = document.getElementById("room-code-display");
  const text = document.getElementById("room-code-text");
  if (display && text) {
    text.textContent = room.code;
    display.style.display = "block";
  }
  showToast("toast-four", "Room created", `Share code: ${room.code}`);
  renderRoomsList();
}

function copyRoomCode(code) {
  const value = code || document.getElementById("room-code-text")?.textContent;
  if (!value) return;
  navigator.clipboard.writeText(value).then(() => {
    showToast("toast-milestone", "Copied", "Room code copied to clipboard.");
  });
}

window.RoomsEngine = RoomsEngine;
window.renderRoomsList = renderRoomsList;
window.selectRoom = selectRoom;
window.showRoomModal = showRoomModal;
window.closeRoomModal = closeRoomModal;
window.createRoom = createRoom;
window.copyRoomCode = copyRoomCode;
