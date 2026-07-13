/* =========================================================
   FH6 TIME ATTACK DATA
   ========================================================= */

const DATA_URL = "FH6_Time Attack Laps - RAW DATA.csv"; // local file
let LAPS = [];
let SEASONS = [];

/* ---------- CSV PARSER ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  text = text.replace(/\r\n/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ""; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

/* ---------- LOAD DATA ---------- */
async function loadData() {
  const res = await fetch(DATA_URL);
  const text = await res.text();
  const rows = parseCSV(text);

  const header = rows[0].map(h => h.trim());
  const idx = name => header.indexOf(name);

  const iDate = idx("Date-Time"),
        iCar = idx("Car"),
        iClass = idx("Class"),
        iLapS = idx("Lap_Time_S"),
        iLap = idx("Lap_Time"),
        iTrack = idx("Track"),
        iEvent = idx("event"),
        iSeason = idx("Season");

  LAPS = rows.slice(1).map(r => ({
    date: r[iDate],
    car: r[iCar],
    class: r[iClass],
    lapS: parseFloat(r[iLapS]),
    lap: r[iLap],
    track: r[iTrack],
    event: r[iEvent],
    season: r[iSeason]
  })).filter(r => r.car);

  SEASONS = [...new Set(LAPS.map(l => l.season))].sort();
}

/* ---------- HERO ---------- */
function renderHero() {
  document.getElementById("statCars").textContent =
    new Set(LAPS.map(l => l.car)).size;

  document.getElementById("statLaps").textContent = LAPS.length;

  document.getElementById("statTracks").textContent =
    new Set(LAPS.map(l => l.track)).size;

  const dated = LAPS.filter(l => l.date).map(l => l.date);
  document.getElementById("statUpdated").textContent =
    dated.length ? dated[dated.length - 1] : "–";

  document.getElementById("footerCount").textContent = LAPS.length;
}

/* ---------- SEASON CHIPS ---------- */
let currentSeason = "ALL";

function renderSeasonChips() {
  const wrap = document.getElementById("seasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === currentSeason ? " is-active" : "");
    chip.textContent = s;
    chip.addEventListener("click", () => {
      currentSeason = s;
      renderSeasonChips();
      renderLeaderboard();
    });
    wrap.appendChild(chip);
  });
}

/* ---------- LEADERBOARD ---------- */
function computeLeaderboard(season) {
  const rows = season === "ALL"
    ? LAPS
    : LAPS.filter(l => l.season === season);

  const bestByCar = {};

  rows.forEach(l => {
    if (!bestByCar[l.car] || l.lapS < bestByCar[l.car].lapS) {
      bestByCar[l.car] = l;
    }
  });

  return Object.values(bestByCar).sort((a, b) => a.lapS - b.lapS);
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboardContainer");
  const rows = computeLeaderboard(currentSeason);

  const html = rows.map((l, i) => `
    <div class="tower__row">
      <span class="col-pos">${i + 1}</span>
      <span class="col-driver">${l.car}</span>
      <span class="col-num">${l.class}</span>
      <span class="col-num">${l.track}</span>
      <span class="col-num">${l.lap}</span>
      <span class="col-num">${l.event}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="tower-group">
      <h3 class="tower-group__title">Fastest Laps (${currentSeason})</h3>
      <div class="tower">
        <div class="tower__row tower__row--head">
          <span class="col-pos">POS</span>
          <span class="col-driver">CAR</span>
          <span class="col-num">CLASS</span>
          <span class="col-num">TRACK</span>
          <span class="col-num">LAP</span>
          <span class="col-num">EVENT</span>
        </div>
        <div class="tower__body">${html}</div>
      </div>
    </div>
  `;
}

/* ---------- CAR GRID ---------- */
function renderCarGrid() {
  const grid = document.getElementById("carGrid");
  grid.innerHTML = "";

  const cars = computeLeaderboard("ALL");

  cars.forEach(c => {
    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <h3 class="driver-card__name">${c.car}</h3>
      <div class="driver-card__points">${c.lap}<span class="driver-card__points-label">Best Lap</span></div>
      <div class="driver-card__grid">
        <div class="driver-card__metric"><span>Class</span><span>${c.class}</span></div>
        <div class="driver-card__metric"><span>Track</span><span>${c.track}</span></div>
        <div class="driver-card__metric"><span>Event</span><span>${c.event}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- LAP LOG ---------- */
let currentLapSeason = "ALL";

function renderLapSeasonChips() {
  const wrap = document.getElementById("lapSeasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === currentLapSeason ? " is-active" : "");
    chip.textContent = s;
    chip.addEventListener("click", () => {
      currentLapSeason = s;
      renderLapSeasonChips();
      renderLapTable();
    });
    wrap.appendChild(chip);
  });
}

function groupLaps(rows) {
  return rows.map((l, i) => ({
    id: i,
    ...l
  }));
}

function renderLapTable() {
  const rows = currentLapSeason === "ALL"
    ? LAPS
    : LAPS.filter(l => l.season === currentLapSeason);

  const groups = groupLaps(rows);
  const wrap = document.getElementById("lapAccordion");
  wrap.innerHTML = "";

  groups.forEach((g, gi) => {
    const row = document.createElement("button");
    row.className = "race-row";
    row.setAttribute("aria-expanded", "false");

    row.innerHTML = `
      <span class="chevron">▸</span>
      <span>${g.season}</span>
      <span>${g.car}</span>
      <span>${g.class}</span>
      <span>${g.track}</span>
      <span>${g.lap}</span>
      <span>${g.event}</span>
    `;

    const detail = document.createElement("div");
    detail.className = "race-detail";

    detail.innerHTML = `
      <div class="race-detail-inner">
        <table class="race-table">
          <thead>
            <tr><th>Date</th><th>Lap (s)</th><th>Lap</th><th>Event</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${g.date}</td>
              <td>${g.lapS}</td>
              <td>${g.lap}</td>
              <td>${g.event}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    row.addEventListener("click", () => {
      const isOpen = row.classList.toggle("is-open");
      detail.classList.toggle("is-open", isOpen);
      row.setAttribute("aria-expanded", String(isOpen));
    });

    wrap.appendChild(row);
    wrap.appendChild(detail);
  });
}

/* ---------- TABS ---------- */
function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("is-active"));
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("is-active");
    });
  });
}

/* ---------- INIT ---------- */
async function init() {
  await loadData();
  renderHero();
  renderSeasonChips();
  renderLeaderboard();
  renderCarGrid();
  renderLapSeasonChips();
  renderLapTable();
  setupTabs();
}

init();
