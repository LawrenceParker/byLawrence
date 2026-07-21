/* =========================================================
   DATA SOURCE
   -----------------------------------------------------------
   Primary source: your live Google Sheet, published as CSV
   (File > Share > Publish to web > CSV). Currently set to the
   local fallback file until you publish a live sheet.

   FALLBACK_DATA_URL is a local CSV file used automatically if
   the live sheet can't be reached. Keep fh6-data.csv alongside
   this file as a safety net.
   ========================================================= */
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQqk8E37Qtrp6HYx9pIImuqx4CFbFkilB1xYd9i6BhCHC8WgGcAfyp1bqvuvyZC2EMWBu6qkDMwaB6R/pub?gid=1766989121&single=true&output=csv";
const FALLBACK_DATA_URL = "fh6-data.csv";

/* ---------- CSV PARSING ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  text = text.replace(/\r\n/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
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

function num(v) {
  const n = parseFloat((v || "").replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

function formatLapTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return "–";
  const m = Math.floor(seconds / 60);
  const rem = seconds - m * 60;
  const remStr = rem.toFixed(3).padStart(6, "0");
  return `${m}:${remStr}`;
}

const CLASS_ORDER = ["D", "C", "B", "A", "S1", "S2", "X", "R"];
function classSortIndex(c) {
  const i = CLASS_ORDER.indexOf(c);
  return i === -1 ? 999 : i;
}

/* ---------- LOAD + TRANSFORM ---------- */
let LAPS = [];   // every individual lap row
let TRACKS = []; // unique track list

async function loadData() {
  let text;
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    text = await res.text();
  } catch (err) {
    console.warn("Could not reach the live data source, using local fallback data instead:", err);
    const fallbackRes = await fetch(FALLBACK_DATA_URL);
    text = await fallbackRes.text();
  }
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  const idx = name => header.indexOf(name);

  const iDate = idx("Date-Time"), iCar = idx("Car"), iClass = idx("Class"),
        iPI = idx("PI"), iDrive = idx("Drive"), iLapSeconds = idx("Lap_Time_S"),
        iTrack = idx("Track"), iSeason = idx("Season"),
        iStock = idx("Stock"), iTuned = idx("Tuned"), iShareCode = idx("Share Code");

  LAPS = rows.slice(1).map(r => ({
    date: r[iDate],
    car: r[iCar],
    class: r[iClass],
    pi: r[iPI],
    drive: r[iDrive],
    seconds: num(r[iLapSeconds]),
    track: r[iTrack],
    season: r[iSeason],
    stock: (r[iStock] || "").trim().toLowerCase() === "true",
    tuned: (r[iTuned] || "").trim().toLowerCase() === "true",
    shareCode: (r[iShareCode] || "").trim()
  })).filter(r => r.car && r.car.trim() !== "");

  TRACKS = [...new Set(LAPS.map(r => r.track).filter(Boolean))];
}

/* ---------- AGGREGATION ---------- */
function computeCarStats(rows) {
  const byCar = {};
  rows.forEach(r => {
    if (!byCar[r.car]) {
      byCar[r.car] = { car: r.car, class: r.class, pi: r.pi, stock: r.stock, tuned: r.tuned, shareCode: r.shareCode, laps: [] };
    }
    byCar[r.car].laps.push(r);
    // Keep class/PI/build info from whichever lap is currently fastest, in case they ever change
    if (r.seconds <= Math.min(...byCar[r.car].laps.map(l => l.seconds))) {
      byCar[r.car].class = r.class;
      byCar[r.car].pi = r.pi;
      byCar[r.car].stock = r.stock;
      byCar[r.car].tuned = r.tuned;
      byCar[r.car].shareCode = r.shareCode;
    }
  });

  return Object.values(byCar).map(c => {
    const times = c.laps.map(l => l.seconds).sort((a, b) => a - b);
    const best = times[0];
    const trimmed = times.length > 2 ? times.slice(1, -1) : [];
    const avg = trimmed.length ? trimmed.reduce((a, b) => a + b, 0) / trimmed.length : null;
    return {
      ...c,
      bestLap: best,
      avgLap: avg,
      lapCount: c.laps.length
    };
  }).sort((a, b) => a.bestLap - b.bestLap);
}

/* ---------- RENDER: HERO ---------- */
function renderHero() {
  document.getElementById("statTracks").textContent = TRACKS.length;
  document.getElementById("statCars").textContent = new Set(LAPS.map(r => r.car)).size;
  document.getElementById("statLaps").textContent = LAPS.length;
  const dated = LAPS.filter(r => r.date).map(r => r.date).sort();
  document.getElementById("statLatest").textContent = dated.length ? dated[dated.length - 1].split(" ")[0] : "–";
 }

/* ---------- TRACK CHIPS (shared by both tabs) ---------- */
let currentTrack = null;
let currentClass = "ALL";

function renderTrackChips(containerId, onSelect) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = "";
  TRACKS.forEach(t => {
    const chip = document.createElement("button");
    chip.className = "chip" + (t === currentTrack ? " is-active" : "");
    chip.textContent = t;
    chip.addEventListener("click", () => { currentTrack = t; onSelect(); });
    wrap.appendChild(chip);
  });
}

function buildLabel(c) {
  if (c.tuned) return "Tuned";
  if (c.stock) return "Stock";
  return "–";
}

/* ---------- LEADERBOARD TAB ---------- */

/* Colour first4 char*/
function colorFirst4(str) {
  if (!str) return "";
  return `<span class="first4">${str.slice(0, 4)}</span>${str.slice(4)}`;
}

function buildLeaderboardGroupHTML(title, cars) {
  const rows = cars.map((c, i) => `
    <div class="tower__row">
      <span class="col-pos ${i === 0 ? "pos-1" : ""}">${i + 1}</span>
      <span class="col-driver">${colorFirst4(c.car)}</span>
      <span class="col-num">${c.class}</span>
      <span class="col-num">${c.pi}</span>
      <span class="col-num">${buildLabel(c)}</span>
      <span class="col-num">${formatLapTime(c.bestLap)}</span>
      <span class="col-num">${c.avgLap !== null ? formatLapTime(c.avgLap) : "–"}</span>
      <span class="col-num">${c.lapCount}</span> 
      <span class="col-num">${c.shareCode || "–"}</span>     
    </div>
  `).join("");

  return `
    <div class="tower-group">
      ${title ? `<h3 class="tower-group__title">${title}</h3>` : ""}
      <div class="tower">
        <div class="tower__row tower__row--head">
          <span class="col-pos">POS</span>
          <span class="col-driver">CAR</span>
          <span class="col-num">CLASS</span>
          <span class="col-num">PI</span>
          <span class="col-num">Build</span>
          <span class="col-num">Best Lap</span>
          <span class="col-num">Avg Lap</span>
          <span class="col-num">Laps</span>
          <span class="col--num">Share Code</span>          
        </div>
        <div class="tower__body">${rows}</div>
      </div>
    </div>
  `;
}

function getClassesForTrack(track) {
  const trackRows = LAPS.filter(r => r.track === track);
  return [...new Set(trackRows.map(r => r.class).filter(Boolean))]
    .sort((a, b) => classSortIndex(a) - classSortIndex(b));
}

function renderClassChips() {
  const wrap = document.getElementById("leaderboardClassChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...getClassesForTrack(currentTrack)];
  options.forEach(c => {
    const chip = document.createElement("button");
    chip.className = "chip" + (c === currentClass ? " is-active" : "");
    chip.textContent = c === "ALL" ? "All Classes" : `Class ${c}`;
    chip.addEventListener("click", () => { currentClass = c; renderClassChips(); renderLeaderboard(); });
    wrap.appendChild(chip);
  });
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboardContainer");
  const trackRows = LAPS.filter(r => r.track === currentTrack);

  if (currentClass === "ALL") {
    const overall = computeCarStats(trackRows);
    container.innerHTML = buildLeaderboardGroupHTML("Overall — All Classes", overall);
  } else {
    const subset = trackRows.filter(r => r.class === currentClass);
    const stats = computeCarStats(subset);
    container.innerHTML = buildLeaderboardGroupHTML(`Class ${currentClass}`, stats);
  }
}

/* ---------- LAP LOG TAB ---------- */
function renderLapLog() {
  const trackRows = LAPS.filter(r => r.track === currentTrack);
  const cars = computeCarStats(trackRows);
  const wrap = document.getElementById("lapLogAccordion");
  wrap.innerHTML = "";

  cars.forEach((c, ci) => {
    const row = document.createElement("button");
    row.className = "race-row";
    row.setAttribute("aria-expanded", "false");
    row.innerHTML = `
      <span class="chevron">▸</span>
      <span>${c.car}</span>
      <span class="r-round">${c.class}</span>
      <span class="r-round">${c.pi}</span>
      <span class="r-winner">${formatLapTime(c.bestLap)}</span>
      <span>${c.lapCount} laps</span>
    `;

    const bestTime = Math.min(...c.laps.map(l => l.seconds));
    const worstTime = Math.max(...c.laps.map(l => l.seconds));

    const detail = document.createElement("div");
    detail.className = "race-detail";
    detail.id = `lap-detail-${ci}`;

    const lapRows = c.laps.map(l => {
      const isBest = l.seconds === bestTime;
      const isWorst = l.seconds === worstTime && c.laps.length > 2;
      const build = l.tuned ? "Tuned" : l.stock ? "Stock" : "–";
      return `
        <tr>
          <td>${l.date ? l.date.split(" ")[0] : "–"}</td>
          <td>${l.season || "–"}</td>
          <td class="${isBest ? "win-flag" : ""}">${formatLapTime(l.seconds)}</td>
          <td>${isBest ? "Best" : isWorst ? "Slowest (excluded)" : "–"}</td>
          <td>${build}</td>
          <td>${l.shareCode || "–"}</td>
        </tr>
      `;
    }).join("");

    detail.innerHTML = `
      <div class="race-detail-inner">
        <table class="race-table">
          <thead>
            <tr><th>Date</th><th>Season</th><th>Lap Time</th><th>Note</th><th>Build</th><th>Share Code</th></tr>
          </thead>
          <tbody>${lapRows}</tbody>
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
function onTrackChange() {
  renderTrackChips("leaderboardTrackChips", onTrackChange);
  renderTrackChips("lapLogTrackChips", onTrackChange);
  currentClass = "ALL";
  renderClassChips();
  renderLeaderboard();
  renderLapLog();
}

async function init() {
  await loadData();
  currentTrack = TRACKS[0] || null;
  renderHero();
  onTrackChange();
  setupTabs();
}

init();
