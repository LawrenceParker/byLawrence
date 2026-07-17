/* =========================================================
   DATA SOURCE
   -----------------------------------------------------------
   Primary source: your live Google Sheet, published as CSV.
   FALLBACK_DATA_URL is a local backup used if the live sheet
   can't be reached.
   ========================================================= */
const DATA_URL = "f1-data.csv";
const FALLBACK_DATA_URL = "f1-data.csv";

const COLORS = ["#2f7fe0", "#c8393b", "#f2b705", "#2fbf9e", "#ef4da0", "#8a6cd1", "#6b8f4e"];

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

function isValidPoints(v) {
  if (v === undefined || v === null) return false;
  const s = String(v).trim().toUpperCase();
  if (s === "" || s === "#N/A" || s === "NA" || s === "N/A") return false;
  return !isNaN(parseFloat(s));
}

/* ---------- LOAD + TRANSFORM ---------- */
let ROWS = [];
let RACES = [];   // every race, including ones not yet completed
let NAMES = [];

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

  const iRace = idx("Race"), iName = idx("Name"), iDriver = idx("Driver"),
        iPos = idx("Pos (Race)"), iPoints = idx("Points");

  ROWS = rows.slice(1).map(r => ({
    race: r[iRace], name: r[iName], driver: r[iDriver], pos: r[iPos],
    pointsRaw: r[iPoints],
    points: isValidPoints(r[iPoints]) ? parseFloat(r[iPoints]) : null
  })).filter(r => r.name && r.name.trim() !== "");

  RACES = [];
  ROWS.forEach(r => { if (!RACES.includes(r.race)) RACES.push(r.race); });

  NAMES = [];
  ROWS.forEach(r => { if (!NAMES.includes(r.name)) NAMES.push(r.name); });
}

function isRaceCompleted(race) {
  const rowsForRace = ROWS.filter(r => r.race === race);
  return rowsForRace.length > 0 && rowsForRace.every(r => r.points !== null);
}

/* ---------- AGGREGATION ---------- */
function computeStandings() {
  return NAMES.map(name => {
    const rows = ROWS.filter(r => r.name === name && r.points !== null);
    const total = rows.reduce((sum, r) => sum + r.points, 0);
    return { name, total, racesScored: rows.length };
  }).sort((a, b) => b.total - a.total);
}

function computeRunningTotals() {
  const completedRaces = RACES.filter(isRaceCompleted);
  const series = {};
  NAMES.forEach(name => {
    let running = 0;
    series[name] = completedRaces.map(race => {
      const row = ROWS.find(r => r.race === race && r.name === name);
      running += row && row.points !== null ? row.points : 0;
      return running;
    });
  });
  return { completedRaces, series };
}

/* ---------- RENDER: HERO ---------- */
function renderHero() {
  const completedCount = RACES.filter(isRaceCompleted).length;
  const standings = computeStandings();
  document.getElementById("statRaces").textContent = completedCount;
  document.getElementById("statRacers").textContent = NAMES.length;
  document.getElementById("statLeader").textContent = standings.length ? standings[0].name : "–";
  document.getElementById("footerCount").textContent = ROWS.length;
}

/* ---------- RENDER: LEADERBOARD ---------- */
const POSITION_LABELS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

function renderLeaderboard() {
  const standings = computeStandings();
  const grid = document.getElementById("leaderboardGrid");
  grid.innerHTML = "";
  standings.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "lb-card" + (i === 0 ? " lb-card--p1" : "");
    card.innerHTML = `
      <div class="lb-card__pos">${POSITION_LABELS[i] || `${i + 1}th`}</div>
      <h3 class="lb-card__name">${s.name}</h3>
      <div class="lb-card__points">${s.total}<span class="lb-card__points-label">Total Points</span></div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- RENDER: RACE PICKS MATRIX ---------- */
function renderPicksMatrix() {
  const headerRow = document.getElementById("picksHeaderRow");
  headerRow.innerHTML = `<th>Name</th>` + RACES.map(r => `<th>${r}</th>`).join("");

  const standings = computeStandings();
  const body = document.getElementById("picksBody");
  body.innerHTML = "";

  standings.forEach(s => {
    const tr = document.createElement("tr");
    let cells = `<td class="picks-name">${s.name}</td>`;
    RACES.forEach(race => {
      const row = ROWS.find(r => r.race === race && r.name === s.name);
      if (!row || !row.driver || row.points === null) {
        cells += `<td class="picks-cell--empty">TBD</td>`;
      } else {
        cells += `
          <td>
            <div class="picks-cell__driver">${row.driver}</div>
            <div class="picks-cell__meta">P${row.pos}</div>
            <div class="picks-cell__pts">${row.points} pts</div>
          </td>
        `;
      }
    });
    tr.innerHTML = cells;
    body.appendChild(tr);
  });
}

/* ---------- RENDER: RUNNING TOTAL CHART ---------- */
function renderChart() {
  const { completedRaces, series } = computeRunningTotals();

  const legend = document.getElementById("chartLegend");
  legend.innerHTML = NAMES.map((name, i) => `
    <div class="chart-legend__item">
      <span class="chart-legend__swatch" style="background:${COLORS[i % COLORS.length]}"></span>
      ${name}
    </div>
  `).join("");

  if (completedRaces.length === 0) {
    document.getElementById("chartWrap").innerHTML = `<p style="color:var(--muted); font-family:var(--font-mono); font-size:13px;">No completed races yet.</p>`;
    return;
  }

  const width = Math.max(700, completedRaces.length * 90);
  const height = 380;
  const padL = 46, padR = 20, padT = 20, padB = 60;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const allValues = Object.values(series).flat();
  const rawMax = Math.max(10, ...allValues);
  const maxY = Math.ceil(rawMax / 25) * 25 || 25;

  const xStep = completedRaces.length > 1 ? plotW / (completedRaces.length - 1) : 0;
  const xFor = i => padL + i * xStep;
  const yFor = v => padT + plotH - (v / maxY) * plotH;

  const gridSteps = 4;
  let gridLines = "";
  let yLabels = "";
  for (let g = 0; g <= gridSteps; g++) {
    const val = Math.round((maxY / gridSteps) * g);
    const y = yFor(val);
    gridLines += `<line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="#2d323b" stroke-width="1" />`;
    yLabels += `<text x="${padL - 10}" y="${y + 4}" font-size="11" fill="#8b9099" font-family="monospace" text-anchor="end">${val}</text>`;
  }

  let lines = "";
  NAMES.forEach((name, ni) => {
    const points = series[name].map((v, i) => `${xFor(i)},${yFor(v)}`).join(" ");
    lines += `<polyline points="${points}" fill="none" stroke="${COLORS[ni % COLORS.length]}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />`;
    series[name].forEach((v, i) => {
      lines += `<circle cx="${xFor(i)}" cy="${yFor(v)}" r="3" fill="${COLORS[ni % COLORS.length]}" />`;
    });
  });

  let xLabels = "";
  completedRaces.forEach((race, i) => {
    xLabels += `
      <text x="${xFor(i)}" y="${height - padB + 20}" font-size="10" fill="#8b9099" font-family="monospace"
            text-anchor="middle" transform="rotate(20, ${xFor(i)}, ${height - padB + 20})">${race}</text>
    `;
  });

  document.getElementById("chartWrap").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${gridLines}
      ${yLabels}
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#2d323b" stroke-width="1" />
      <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#2d323b" stroke-width="1" />
      ${lines}
      ${xLabels}
    </svg>
  `;
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
  renderLeaderboard();
  renderPicksMatrix();
  renderChart();
  setupTabs();
}

init();
