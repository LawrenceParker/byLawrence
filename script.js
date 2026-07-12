/* =========================================================
   DATA SOURCE
   -----------------------------------------------------------
   Right now this points at the local data.csv file bundled
   with the site, so you can preview everything immediately.

   When you're ready to go live, publish your Google Sheet as
   a CSV (File > Share > Publish to web > CSV) and paste that
   URL in below. The site will then always show your latest
   results automatically — no re-uploading needed.
   ========================================================= */
const DATA_URL = "data/data.csv";

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
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

/* ---------- LOAD + TRANSFORM ---------- */
let RACES = []; // array of race result objects
let SEASONS = [];

async function loadData() {
  const res = await fetch(DATA_URL);
  const text = await res.text();
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  const idx = name => header.indexOf(name);

  const iDate = idx("Date"), iSeason = idx("Season"), iRound = idx("Round"),
        iRace = idx("Race"), iRaceName = idx("Race Name"), iTrack = idx("Track"),
        iDriver = idx("Driver"), iStart = idx("Start Pos"), iFinish = idx("Finish Pos"),
        iFL = idx("FL"), iTotal = idx("Total Points"), iPosDelta = idx("Pos +/-");

  RACES = rows.slice(1).map(r => ({
    date: r[iDate],
    season: r[iSeason],
    round: r[iRound],
    race: r[iRace],
    raceName: r[iRaceName],
    track: r[iTrack],
    driver: r[iDriver],
    start: r[iStart],
    finish: r[iFinish],
    fl: r[iFL] === "FL",
    points: num(r[iTotal]),
    posDelta: r[iPosDelta]
  })).filter(r => r.driver && r.driver.trim() !== "");

  SEASONS = [...new Set(RACES.map(r => r.season))].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, "")) || 0;
    const nb = parseInt(b.replace(/\D/g, "")) || 0;
    return na - nb;
  });
}

/* ---------- AGGREGATION ---------- */
function isFinisher(r) {
  return r.finish && r.finish !== "DNS" && r.finish !== "DNF" && !isNaN(parseInt(r.finish));
}

function computeStandings(seasonFilter) {
  const rows = seasonFilter === "ALL" ? RACES : RACES.filter(r => r.season === seasonFilter);
  const byDriver = {};
  rows.forEach(r => {
    if (!byDriver[r.driver]) {
      byDriver[r.driver] = { driver: r.driver, points: 0, wins: 0, podiums: 0, poles: 0, fl: 0, starts: 0, finishes: 0, finishSum: 0 };
    }
    const d = byDriver[r.driver];
    d.points += r.points;
    d.starts += 1;
    if (r.fl) d.fl += 1;
    if (r.start === "1") d.poles += 1;
    if (isFinisher(r)) {
      const pos = parseInt(r.finish);
      d.finishes += 1;
      d.finishSum += pos;
      if (pos === 1) d.wins += 1;
      if (pos <= 3) d.podiums += 1;
    }
  });
  return Object.values(byDriver).sort((a, b) => b.points - a.points);
}

/* ---------- RENDER: HERO ---------- */
function renderHero() {
  const drivers = new Set(RACES.map(r => r.driver));
  const dated = RACES.filter(r => r.date).map(r => r.date);
  document.getElementById("statSeasons").textContent = SEASONS.length;
  document.getElementById("statRaces").textContent = new Set(RACES.map(r => r.season + "-" + r.round + "-" + r.race)).size;
  document.getElementById("statDrivers").textContent = drivers.size;
  document.getElementById("statUpdated").textContent = dated.length ? dated[dated.length - 1] : "–";
  document.getElementById("footerCount").textContent = RACES.length;
}

/* ---------- RENDER: STANDINGS TAB ---------- */
let currentSeason = "ALL";

function renderSeasonChips() {
  const wrap = document.getElementById("seasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === currentSeason ? " is-active" : "");
    chip.textContent = s === "ALL" ? "All-Time" : s.replace("Season ", "S");
    chip.addEventListener("click", () => { currentSeason = s; renderSeasonChips(); renderTower(); });
    wrap.appendChild(chip);
  });
}

function renderTower() {
  const standings = computeStandings(currentSeason);
  const body = document.getElementById("towerBody");
  body.innerHTML = "";
  standings.forEach((d, i) => {
    const row = document.createElement("div");
    row.className = "tower__row";
    row.innerHTML = `
      <span class="col-pos ${i === 0 ? "pos-1" : ""}">${i + 1}</span>
      <span class="col-driver">${d.driver}</span>
      <span class="col-num">${d.points}</span>
      <span class="col-num">${d.wins}</span>
      <span class="col-num">${d.podiums}</span>
      <span class="col-num">${d.poles}</span>
      <span class="col-num">${d.fl}</span>
    `;
    body.appendChild(row);
  });
}

/* ---------- RENDER: DRIVERS TAB ---------- */
function renderDriverGrid() {
  const standings = computeStandings("ALL");
  const grid = document.getElementById("driverGrid");
  grid.innerHTML = "";
  standings.forEach(d => {
    const avgFinish = d.finishes ? (d.finishSum / d.finishes).toFixed(1) : "–";
    const winRate = d.starts ? Math.round((d.wins / d.starts) * 100) : 0;
    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <h3 class="driver-card__name">${d.driver}</h3>
      <div class="driver-card__points">${d.points}<span class="driver-card__points-label">Career Points</span></div>
      <div class="driver-card__grid">
        <div class="driver-card__metric"><span>Starts</span><span>${d.starts}</span></div>
        <div class="driver-card__metric"><span>Wins</span><span>${d.wins}</span></div>
        <div class="driver-card__metric"><span>Podiums</span><span>${d.podiums}</span></div>
        <div class="driver-card__metric"><span>Poles</span><span>${d.poles}</span></div>
        <div class="driver-card__metric"><span>Fastest Laps</span><span>${d.fl}</span></div>
        <div class="driver-card__metric"><span>Win Rate</span><span>${winRate}%</span></div>
        <div class="driver-card__metric"><span>Avg Finish</span><span>${avgFinish}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- RENDER: RACE LOG TAB ---------- */
let currentRaceSeason = "ALL";

function renderRaceSeasonChips() {
  const wrap = document.getElementById("raceSeasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === currentRaceSeason ? " is-active" : "");
    chip.textContent = s === "ALL" ? "All-Time" : s.replace("Season ", "S");
    chip.addEventListener("click", () => { currentRaceSeason = s; renderRaceSeasonChips(); renderRaceTable(); });
    wrap.appendChild(chip);
  });
}

function groupRaces(rows) {
  const groups = {};
  rows.forEach(r => {
    const key = `${r.season}__${r.round}__${r.race}`;
    if (!groups[key]) {
      groups[key] = { season: r.season, round: r.round, race: r.race, raceName: r.raceName, track: r.track, date: r.date, results: [] };
    }
    groups[key].results.push(r);
  });
  return Object.values(groups).map(g => {
    g.results.sort((a, b) => {
      const fa = isFinisher(a) ? parseInt(a.finish) : 999;
      const fb = isFinisher(b) ? parseInt(b.finish) : 999;
      return fa - fb;
    });
    g.winner = g.results.find(r => r.finish === "1");
    return g;
  }).sort((a, b) => {
    if (a.season !== b.season) return a.season.localeCompare(b.season);
    if (a.round !== b.round) return a.round.localeCompare(b.round);
    return a.race.localeCompare(b.race);
  });
}

function renderRaceTable() {
  const rows = currentRaceSeason === "ALL" ? RACES : RACES.filter(r => r.season === currentRaceSeason);
  const groups = groupRaces(rows);
  const wrap = document.getElementById("raceAccordion");
  wrap.innerHTML = "";

  groups.forEach((g, gi) => {
    const rowId = `race-detail-${gi}`;

    const row = document.createElement("button");
    row.className = "race-row";
    row.setAttribute("aria-expanded", "false");
    row.innerHTML = `
      <span class="chevron">▸</span>
      <span class="r-round">${g.round.replace("Round ", "R")}</span>
      <span>${g.raceName || g.race}</span>
      <span>${g.track || "–"}</span>
      <span class="r-winner">${g.winner ? g.winner.driver : "–"}</span>
    `;

    const detail = document.createElement("div");
    detail.className = "race-detail";
    detail.id = rowId;

    const tableRows = g.results.map(r => `
      <tr>
        <td>${r.driver}</td>
        <td>${r.start || "–"}</td>
        <td class="${r.finish === "1" ? "win-flag" : ""}">${r.finish || "–"}</td>
        <td>${r.posDelta || "–"}</td>
        <td>${r.points}</td>
        <td class="${r.fl ? "fl-flag" : ""}">${r.fl ? "FL" : "–"}</td>
      </tr>
    `).join("");

    detail.innerHTML = `
      <div class="race-detail-inner">
        <table class="race-table">
          <thead>
            <tr><th>Driver</th><th>Start</th><th>Finish</th><th>+/-</th><th>Pts</th><th>FL</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
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
  renderTower();
  renderDriverGrid();
  renderRaceSeasonChips();
  renderRaceTable();
  setupTabs();
}

init();
