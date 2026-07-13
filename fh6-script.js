/* =========================================================
   FH6 TIME ATTACK DATA
   ========================================================= */

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqk8E37Qtrp6HYx9pIImuqx4CFbFkilB1xYd9i6BhCHC8WgGcAfyp1bqvuvyZC2EMWBu6qkDMwaB6R/pub?gid=1766989121&single=true&output=csv"; // live file
const FALLBACK_DATA_URL = "FH6_Time Attack Laps - RAW DATA.csv" // local file
let LAPS = [];
let SEASONS = [];
CLASSES = [...new Set(LAPS.map(l => l.class))].sort();

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
  let text;
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    text = await res.text();
  } catch (err) {
    console.warn("Using fallback CSV:", err);
    const fallbackRes = await fetch(FALLBACK_DATA_URL);
    text = await fallbackRes.text();
  }
   
  const rows = parseCSV(text);

  const header = rows[0].map(h => h.trim());
const idx = name =>
  header.findIndex(h => h.toLowerCase().trim() === name.toLowerCase().trim());

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
  pi: r[idx("PI")],
  drive: r[idx("Drive")],
  lapS: parseFloat(r[iLapS]),
  lap: r[iLap],
  track: r[iTrack],
  event: r[iEvent],
  season: r[iSeason],
  stock: r[idx("Stock")],
  tuned: r[idx("Tuned")],
  sharecode: r[idx("Share Code")]
}))

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

/* ---------- CLASS CHIPS ---------- */
let currentClass = "ALL";

function renderClassChips() {
  const wrap = document.getElementById("seasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...CLASSES];
  options.forEach(c => {
    const chip = document.createElement("button");
    chip.className = "chip" + (c === currentClass ? " is-active" : "");
    chip.textContent = c;
    chip.addEventListener("click", () => {
      currentClass = c;
      renderClassChips();
      renderLeaderboard();
    });
    wrap.appendChild(chip);
  });
}

/* ---------- LEADERBOARD ---------- */
function computeLeaderboard(classFilter) {
  const rows = classFilter === "ALL"
    ? LAPS
    : LAPS.filter(l => l.class === classFilter);

  const grouped = {};

  rows.forEach(l => {
    if (!grouped[l.car]) grouped[l.car] = [];
    grouped[l.car].push(l);
  });

  const leaderboard = Object.values(grouped).map(carLaps => {
    const best = carLaps.reduce((a, b) => a.lapS < b.lapS ? a : b);
    return {
      car: best.car,
      class: best.class,
      pi: best.pi,
      track: best.track,
      bestLap: best.lap,
      bestLapS: best.lapS,
      avgLap: computeAverageLap(carLaps),
      stock: best.stock,
      tuned: best.tuned,
      sharecode: best.sharecode
    };
  });

  return leaderboard.sort((a, b) => a.bestLapS - b.bestLapS);
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboardContainer");
  const rows = computeLeaderboard(currentSeason);

  const html = rows.map((l, i) => `
  <div class="tower__row">
    <span class="col-pos">${i + 1}</span>
    <span class="col-driver">${l.car}</span>
    <span class="col-num">${l.class}</span>
    <span class="col-num">${l.pi}</span>
    <span class="col-num">${l.track}</span>
    <span class="col-num">${l.bestLap}</span>
    <span class="col-num">${l.avgLap}</span>
    <span class="col-num">${l.stock === "TRUE" ? "Stock" : "Tuned"}</span>
    <span class="col-num">${l.sharecode || "–"}</span>
  </div>
`).join("");

  container.innerHTML = `
  <div class="tower-group">
    <h3 class="tower-group__title">Fastest Laps (${currentClass})</h3>
    <div class="tower">
      
      <!-- HEADER -->
      <div class="tower__row tower__row--head">
        <span class="col-pos">POS</span>
        <span class="col-driver">CAR</span>
        <span class="col-num">CLASS</span>
        <span class="col-num">PI</span>
        <span class="col-num">TRACK</span>
        <span class="col-num">BEST</span>
        <span class="col-num">AVG</span>
        <span class="col-num">TYPE</span>
        <span class="col-num">SHARE</span>
      </div>

      <!-- BODY -->
      <div class="tower__body">${html}</div>
    </div>
  </div>
`;

/* ------- COMPUTE AVERAGE LAPS ------- */
function computeAverageLap(laps) {
  if (laps.length <= 2) return "–";

  const sorted = laps.map(l => l.lapS).sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1); // remove fastest + slowest
  const avg = trimmed.reduce((a, b) => a + b, 0) / trimmed.length;

  return avg.toFixed(3);
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
  renderClassChips();
  renderLeaderboard();
  renderCarGrid();
  renderLapSeasonChips();
  renderLapTable();
  setupTabs();
}

init();
