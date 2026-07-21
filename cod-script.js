/* =========================================================
   DATA SOURCES
   -----------------------------------------------------------
   Two independent datasets, each with a live Google Sheets CSV
   URL (once published) and a local fallback file.
   ========================================================= */
const GF_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6mq8h3fwk72fRff7hvf38CRMuomDDTx9qVea46vrJ2cdZ73bW21Fv28AbVRSozZaE7o4o6t7WxVsx/pub?gid=1796462109&single=true&output=csv";
const GF_FALLBACK_URL = "cod-gunfight-data.csv";
const TM_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTu7BylmlsZC1ORxG7-Ylo0oRK7Ott174qY66JDEfvEtUf_cp-zWT_MktpKr3yAMgKEi-YOgHDYljBw/pub?gid=1778587563&single=true&output=csv";
const TM_FALLBACK_URL = "cod-team-matches-data.csv";

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

async function fetchWithFallback(primary, fallback) {
  try {
    const res = await fetch(primary);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return await res.text();
  } catch (err) {
    console.warn("Could not reach the live data source, using local fallback data instead:", err);
    const fallbackRes = await fetch(fallback);
    return await fallbackRes.text();
  }
}

/* ---------- GENERIC TOWER BUILDER (variable column count) ---------- */
function buildTowerHTML(title, headerLabels, rows) {
  const colCount = headerLabels.length - 2;
  const gridStyle = `grid-template-columns: 56px 1fr repeat(${colCount}, 82px);`;

  const headSpans = headerLabels.map((label, i) =>
    i === 0 ? `<span class="col-pos">${label}</span>` :
    i === 1 ? `<span class="col-driver">${label}</span>` :
    `<span class="col-num">${label}</span>`
  ).join("");

  const bodyRows = rows.map((r, i) => {
    const cells = [
      `<span class="col-pos ${i === 0 ? "pos-1" : ""}">${i + 1}</span>`,
      `<span class="col-driver">${r.primary}</span>`,
      ...r.values.map(v => `<span class="col-num">${v}</span>`)
    ].join("");
    return `<div class="tower__row" style="${gridStyle}">${cells}</div>`;
  }).join("");

  return `
    <div class="tower-group">
      ${title ? `<h3 class="tower-group__title">${title}</h3>` : ""}
      <div class="tower">
        <div class="tower__row tower__row--head" style="${gridStyle}">${headSpans}</div>
        <div class="tower__body">${bodyRows}</div>
      </div>
    </div>
  `;
}

/* =========================================================
   GUNFIGHT (1v1)
   ========================================================= */
let GF_ROWS = [];
let GF_SEASONS = [];
let gfSeason = null;

async function loadGunfightData() {
  const text = await fetchWithFallback(GF_DATA_URL, GF_FALLBACK_URL);
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  const idx = name => header.indexOf(name);

  const iSeason = idx("Season"), iDate = idx("Date"), iEvent = idx("EventID"),
        iStage = idx("Stage"), iMap = idx("Map"), iMapPick = idx("MapPick"),
        iPlayer = idx("Player"), iOpponent = idx("Opponent"), iResult = idx("Result"),
        iRoundsWon = idx("RoundsWon"), iRoundsLost = idx("RoundsLost"),
        iDamage = idx("Damage"), iKills = idx("Kills"), iDeaths = idx("Deaths");

  GF_ROWS = rows.slice(1).map(r => ({
    season: r[iSeason], date: r[iDate], eventId: r[iEvent], stage: r[iStage],
    map: r[iMap], mapPick: r[iMapPick], player: r[iPlayer], opponent: r[iOpponent],
    result: r[iResult], roundsWon: num(r[iRoundsWon]), roundsLost: num(r[iRoundsLost]),
    damage: num(r[iDamage]), kills: num(r[iKills]), deaths: num(r[iDeaths])
  })).filter(r => r.player && r.player.trim() !== "");

  GF_SEASONS = [...new Set(GF_ROWS.map(r => r.season).filter(Boolean))];
}

function computeGunfightStandings(rows) {
  const byPlayer = {};
  rows.forEach(r => {
    if (!byPlayer[r.player]) {
      byPlayer[r.player] = { player: r.player, matches: 0, wins: 0, losses: 0, kills: 0, deaths: 0, damage: 0 };
    }
    const p = byPlayer[r.player];
    p.matches += 1;
    if (r.result === "W") p.wins += 1;
    if (r.result === "L") p.losses += 1;
    p.kills += r.kills;
    p.deaths += r.deaths;
    p.damage += r.damage;
  });
  return Object.values(byPlayer).map(p => ({
    ...p,
    winPct: p.matches ? Math.round((p.wins / p.matches) * 100) : 0,
    kd: p.deaths ? (p.kills / p.deaths).toFixed(2) : p.kills.toFixed(2),
    avgDamage: p.matches ? Math.round(p.damage / p.matches) : 0
  })).sort((a, b) => b.wins - a.wins || b.winPct - a.winPct);
}

function renderGfSeasonChips(containerId) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = "";
  const options = ["ALL", ...GF_SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === gfSeason ? " is-active" : "");
    chip.textContent = s === "ALL" ? "All Seasons" : s;
    chip.addEventListener("click", () => { gfSeason = s; onGfSeasonChange(); });
    wrap.appendChild(chip);
  });
}

function renderGunfightStandings() {
  const rows = gfSeason === "ALL" ? GF_ROWS : GF_ROWS.filter(r => r.season === gfSeason);
  const standings = computeGunfightStandings(rows);
  const tableRows = standings.map(p => ({
    primary: p.player,
    values: [p.matches, p.wins, p.losses, `${p.winPct}%`, p.kd, p.avgDamage]
  }));
  document.getElementById("gfStandingsContainer").innerHTML = buildTowerHTML(
    gfSeason === "ALL" ? "All-Time" : gfSeason,
    ["POS", "PLAYER", "MATCHES", "WINS", "LOSSES", "WIN%", "K/D", "AVG DMG"],
    tableRows
  );
}

function renderGunfightPlayers() {
  const standings = computeGunfightStandings(GF_ROWS);
  const grid = document.getElementById("gfPlayerGrid");
  grid.innerHTML = "";
  standings.sort((a, b) => b.wins - a.wins).forEach(p => {
    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <h3 class="driver-card__name">${p.player}</h3>
      <div class="driver-card__points">${p.wins}<span class="driver-card__points-label">Career Wins</span></div>
      <div class="driver-card__grid">
        <div class="driver-card__metric"><span>Matches</span><span>${p.matches}</span></div>
        <div class="driver-card__metric"><span>Kills</span><span>${p.kills}</span></div>
        <div class="driver-card__metric"><span>Deaths</span><span>${p.deaths}</span></div>
        <div class="driver-card__metric"><span>Losses</span><span>${p.losses}</span></div>
        <div class="driver-card__metric"><span>Win Rate</span><span>${p.winPct}%</span></div>
        <div class="driver-card__metric"><span>K/D</span><span>${p.kd}</span></div>
        <div class="driver-card__metric"><span>Avg Damage per match</span><span>${p.avgDamage}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderGunfightLog() {
  const rows = gfSeason === "ALL" ? GF_ROWS : GF_ROWS.filter(r => r.season === gfSeason);
  const matches = {};
  rows.forEach(r => {
    if (!matches[r.eventId]) matches[r.eventId] = { eventId: r.eventId, date: r.date, stage: r.stage, map: r.map, mapPick: r.mapPick, sides: [] };
    matches[r.eventId].sides.push(r);
  });

  const wrap = document.getElementById("gfLogAccordion");
  wrap.innerHTML = "";

  Object.values(matches).forEach((m, mi) => {
    const winner = m.sides.find(s => s.result === "W");
    const loser = m.sides.find(s => s.result === "L");
    if (!winner || !loser) return;

    const row = document.createElement("button");
    row.className = "race-row";
    row.setAttribute("aria-expanded", "false");
    row.innerHTML = `
      <span class="chevron">▸</span>
      <span class="r-round">${m.date}</span>
      <span class="r-round">${m.stage}</span>
      <span>${m.map}</span>
      <span class="r-winner">${winner.player} def. ${loser.player}</span>
      <span>${winner.roundsWon}-${winner.roundsLost}</span>
    `;

    const detail = document.createElement("div");
    detail.className = "race-detail";
    detail.id = `gf-detail-${mi}`;
    detail.innerHTML = `
      <div class="race-detail-inner">
        <table class="race-table">
          <thead><tr><th>Player</th><th>Result</th><th>Rounds</th><th>Kills</th><th>Deaths</th><th>Damage</th></tr></thead>
          <tbody>
            ${m.sides.map(s => `
              <tr>
                <td>${s.player}</td>
                <td class="${s.result === "W" ? "win-flag" : ""}">${s.result}</td>
                <td>${s.roundsWon}-${s.roundsLost}</td>
                <td>${s.kills}</td>
                <td>${s.deaths}</td>
                <td>${s.damage}</td>
              </tr>
            `).join("")}
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

function onGfSeasonChange() {
  renderGfSeasonChips("gfStandingsSeasonChips");
  renderGfSeasonChips("gfLogSeasonChips");
  renderGunfightStandings();
  renderGunfightLog();
}

function parseTimeToSeconds(t) {
  if (!t) return 0;
  const parts = t.split(":").map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function formatSecondsToTime(s) {
  if (!s) return "0:00";
  const m = Math.floor(s / 60);
  const rem = Math.round(s - m * 60);
  return `${m}:${String(rem).padStart(2, "0")}`;
}

/* =========================================================
   TEAM MATCHES (SnD / Hardpoint)
   ========================================================= */
let TM_ROWS = [];
let TM_SEASONS = [];
let TM_GAMEMODES = [];
let tmSeason = null;
let tmMode = "ALL";

function normalizeGamemode(g) {
  const u = (g || "").trim().toUpperCase();
  if (u === "SND" || u === "SNd" || u === "SND".toUpperCase()) return "SND";
  return (g || "").trim();
}

async function loadTeamData() {
  const text = await fetchWithFallback(TM_DATA_URL, TM_FALLBACK_URL);
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  const idx = name => header.indexOf(name);

  const iSeason = idx("Season"), iStage = idx("Stage"), iWeek = idx("Week"),
        iMatchId = idx("MatchID"), iDate = idx("Date"), iGamemode = idx("Gamemode"),
        iMap = idx("Map"), iPlayer = idx("Player"), iTeam = idx("Team"),
        iOppTeam = idx("OpponentTeam"), iResult = idx("Result"),
        iTeamScore = idx("TeamScore"), iOppScore = idx("OpponentScore"),
        iKills = idx("Kills"), iDeaths = idx("Deaths"), iPlants = idx("Plants"),
        iDefuses = idx("Defuses"), iTime = idx("Time"), iDefends = idx("Defends");

  TM_ROWS = rows.slice(1).map(r => ({
    season: r[iSeason], stage: r[iStage], week: r[iWeek], matchId: r[iMatchId],
    date: r[iDate], gamemode: normalizeGamemode(r[iGamemode]), map: r[iMap],
    player: r[iPlayer], team: r[iTeam], opponentTeam: r[iOppTeam], result: r[iResult],
    teamScore: num(r[iTeamScore]), opponentScore: num(r[iOppScore]),
    kills: num(r[iKills]), deaths: num(r[iDeaths]), plants: num(r[iPlants]),
    defuses: num(r[iDefuses]), time: r[iTime], defends: num(r[iDefends])
  })).filter(r => r.player && r.player.trim() !== "");

  TM_SEASONS = [...new Set(TM_ROWS.map(r => r.season).filter(Boolean))];
  TM_GAMEMODES = [...new Set(TM_ROWS.map(r => r.gamemode).filter(Boolean))];
}

function filteredTeamRows() {
  return TM_ROWS.filter(r =>
    (tmSeason === "ALL" || r.season === tmSeason) &&
    (tmMode === "ALL" || r.gamemode === tmMode)
  );
}

function computeTeamStandings(rows) {
  // De-duplicate to one result per team per match (rows are per-player, 3 per team per match)
  const seen = new Set();
  const byTeam = {};
  rows.forEach(r => {
    const key = `${r.season}__${r.matchId}__${r.team}`;
    if (seen.has(key)) return;
    seen.add(key);
    if (!byTeam[r.team]) byTeam[r.team] = { team: r.team, wins: 0, losses: 0 };
    if (r.result === "W") byTeam[r.team].wins += 1;
    if (r.result === "L") byTeam[r.team].losses += 1;
  });
  return Object.values(byTeam).map(t => ({
    ...t,
    matches: t.wins + t.losses,
    winPct: (t.wins + t.losses) ? Math.round((t.wins / (t.wins + t.losses)) * 100) : 0
  })).sort((a, b) => b.wins - a.wins || b.winPct - a.winPct);
}

function computeTeamPlayerStats(rows) {
  const byPlayer = {};
  rows.forEach(r => {
    if (!byPlayer[r.player]) {
      byPlayer[r.player] = { player: r.player, team: new Set(), matches: 0, kills: 0, deaths: 0, plants: 0, defuses: 0, timeSeconds: 0, defends: 0 };
    }
    const p = byPlayer[r.player];
    p.matches += 1;
    p.kills += r.kills;
    p.deaths += r.deaths;
    p.plants += r.plants;
    p.defuses += r.defuses;
    p.timeSeconds += parseTimeToSeconds(r.time);
    p.defends += r.defends;
    p.team.add(r.team);
  });
  return Object.values(byPlayer).map(p => ({
    ...p,
    kd: p.deaths ? (p.kills / p.deaths).toFixed(2) : p.kills.toFixed(2)
  })).sort((a, b) => b.kills - a.kills);
}

function renderTmFilterChips(seasonContainerId, modeContainerId) {
  const seasonWrap = document.getElementById(seasonContainerId);
  seasonWrap.innerHTML = "";
  ["ALL", ...TM_SEASONS].forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === tmSeason ? " is-active" : "");
    chip.textContent = s === "ALL" ? "All Seasons" : s;
    chip.addEventListener("click", () => { tmSeason = s; onTmFilterChange(); });
    seasonWrap.appendChild(chip);
  });

  const modeWrap = document.getElementById(modeContainerId);
  modeWrap.innerHTML = "";
  ["ALL", ...TM_GAMEMODES].forEach(g => {
    const chip = document.createElement("button");
    chip.className = "chip" + (g === tmMode ? " is-active" : "");
    chip.textContent = g === "ALL" ? "All Modes" : g;
    chip.addEventListener("click", () => { tmMode = g; onTmFilterChange(); });
    modeWrap.appendChild(chip);
  });
}

function renderTeamStandings() {
  const standings = computeTeamStandings(filteredTeamRows());
  const tableRows = standings.map(t => ({
    primary: t.team,
    values: [t.matches, t.wins, t.losses, `${t.winPct}%`]
  }));
  document.getElementById("tmStandingsContainer").innerHTML = buildTowerHTML(
    null, ["POS", "TEAM", "MATCHES", "WINS", "LOSSES", "WIN%"], tableRows
  );
}

function renderTeamPlayers() {
  const stats = computeTeamPlayerStats(filteredTeamRows());
  const grid = document.getElementById("tmPlayersContainer");
  grid.innerHTML = "";

  const showHardpointStats = tmMode === "Hardpoint";

  stats.forEach(p => {
    const extraMetrics = showHardpointStats
      ? `
        <div class="driver-card__metric"><span>Defends</span><span>${p.defends}</span></div>
      `
      : `
        <div class="driver-card__metric"><span>Plants</span><span>${p.plants}</span></div>
        <div class="driver-card__metric"><span>Defuses</span><span>${p.defuses}</span></div>        
      `;

    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <h3 class="driver-card__name">${p.player}</h3>
      <div class="driver-card__points">${p.kills}<span class="driver-card__points-label">Total Kills</span></div>
      <div class="driver-card__grid">
        <div class="driver-card__metric--stack"><span>Teams</span><span>${[...p.team].join(" / ")}</span></div>
        <div class="driver-card__metric"><span>Matches</span><span>${p.matches}</span></div>
        <div class="driver-card__metric"><span>Kills</span><span>${p.kills}</span></div>
        <div class="driver-card__metric"><span>Deaths</span><span>${p.deaths}</span></div>
        <div class="driver-card__metric"><span>K/D</span><span>${p.kd}</span></div>
        <div class="driver-card__metric"><span>Time Held</span><span>${formatSecondsToTime(p.timeSeconds)}</span></div>
        ${extraMetrics}
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderTeamLog() {
  const rows = filteredTeamRows();
  const matches = {};
  rows.forEach(r => {
    const key = `${r.season}__${r.matchId}`;
    if (!matches[key]) {
      matches[key] = { matchId: r.matchId, date: r.date, map: r.map, gamemode: r.gamemode, players: [] };
    }
    matches[key].players.push(r);
  });

  const wrap = document.getElementById("tmLogAccordion");
  wrap.innerHTML = "";

  Object.values(matches).forEach((m, mi) => {
    const teams = [...new Set(m.players.map(p => p.team))];
    const winner = m.players.find(p => p.result === "W");
    const loser = m.players.find(p => p.result === "L");
    if (!winner || !loser) return;

    const row = document.createElement("button");
    row.className = "race-row";
    row.setAttribute("aria-expanded", "false");
    row.innerHTML = `
      <span class="chevron">▸</span>
      <span class="r-round">${m.date || "–"}</span>
      <span class="r-round">${m.gamemode}</span>
      <span>${m.map || "–"}</span>
      <span class="r-winner">${winner.team} def. ${loser.team}</span>
      <span>${winner.teamScore}-${winner.opponentScore}</span>
    `;

    const detail = document.createElement("div");
    detail.className = "race-detail";
    detail.id = `tm-detail-${mi}`;
    detail.innerHTML = `
      <div class="race-detail-inner">
        <table class="race-table">
          <thead><tr><th>Player</th><th>Team</th><th>Result</th><th>Kills</th><th>Deaths</th><th>Plants</th><th>Defuses</th><th>Time</th><th>Defends</th></tr></thead>
          <tbody>
            ${m.players.map(p => `
              <tr>
                <td>${p.player}</td>
                <td>${p.team}</td>
                <td class="${p.result === "W" ? "win-flag" : ""}">${p.result}</td>
                <td>${p.kills}</td>
                <td>${p.deaths}</td>
                <td>${p.plants || "–"}</td>
                <td>${p.defuses || "–"}</td>
                <td>${p.time || "–"}</td>
                <td>${p.defends || "–"}</td>
              </tr>
            `).join("")}
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

function onTmFilterChange() {
  renderTmFilterChips("tmStandingsSeasonChips", "tmStandingsModeChips");
  renderTmFilterChips("tmPlayersSeasonChips", "tmPlayersModeChips");
  renderTmFilterChips("tmLogSeasonChips", "tmLogModeChips");
  renderTeamStandings();
  renderTeamPlayers();
  renderTeamLog();
}

/* =========================================================
   HERO STATS
   ========================================================= */
function renderHero() {
  const gfPlayers = new Set(GF_ROWS.map(r => r.player));
  const tmPlayers = new Set(TM_ROWS.map(r => r.player));
  const allPlayers = new Set([...gfPlayers, ...tmPlayers]);
  const gfMatches = new Set(GF_ROWS.map(r => r.eventId)).size;
  const tmMatches = new Set(TM_ROWS.map(r => `${r.season}__${r.matchId}`)).size;
  const allSeasons = new Set([...GF_SEASONS, ...TM_SEASONS]);

  document.getElementById("statPlayers").textContent = allPlayers.size;
  document.getElementById("statMatches").textContent = gfMatches + tmMatches;
  document.getElementById("statSeasons").textContent = allSeasons.size;
  }

/* =========================================================
   MODE + TAB SWITCHING
   ========================================================= */
function setupModeTabs() {
  document.querySelectorAll(".mode-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".mode-tab").forEach(t => t.classList.remove("is-active"));
      document.querySelectorAll(".mode-panel").forEach(p => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.getElementById("mode-" + tab.dataset.mode).classList.add("is-active");
    });
  });
}

function setupSubTabs() {
  document.querySelectorAll(".tabs").forEach(tabGroup => {
    const modePanel = tabGroup.closest(".mode-panel");
    tabGroup.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        tabGroup.querySelectorAll(".tab").forEach(t => t.classList.remove("is-active"));
        modePanel.querySelectorAll(".panel").forEach(p => p.classList.remove("is-active"));
        tab.classList.add("is-active");
        modePanel.querySelector("#panel-" + tab.dataset.tab).classList.add("is-active");
      });
    });
  });
}

/* =========================================================
   INIT
   ========================================================= */
async function init() {
  await Promise.all([loadGunfightData(), loadTeamData()]);

  gfSeason = "ALL";
  tmSeason = "ALL";
  tmMode = "ALL";

  renderHero();
  onGfSeasonChange();
  renderGunfightPlayers();
  onTmFilterChange();

  setupModeTabs();
  setupSubTabs();
}

init();
