/* =========================================================
   DATA
   ========================================================= */
let CARDS = [];
let dataReady = false;

// Tier is derived from roleRTG, not stored in the CSV.
function tierFromRtg(r){
  if(r>=95) return 'radiant';
  if(r>=90) return 'immortal';
  if(r>=85) return 'ascendant';
  if(r>=80) return 'diamond';
  if(r>=70) return 'platinum';
  return 'gold';
}

// Row id is built from its own fields (not row position) so it stays
// stable across CSV re-orders/edits.
function rowToCard(r){
  const player = String(r.Player || '').trim();
  const team = String(r.Team || '').trim();
  const tournament = String(r.Tournament || '').trim();
  const role = String(r.Role || '').trim();
  const rtg = Number(r.roleRTG);
  return {
    id: `${tournament}|${team}|${player}|${role}`.toLowerCase().replace(/\s+/g,'_'),
    player, team, tournament, role,
    att: Number(r.attRTG),
    def: Number(r.defRTG),
    rtg,
    tier: tierFromRtg(rtg)
  };
}

function rowsToCards(rows){
  return rows
    .filter(r => r.Player && r.Tournament && r.roleRTG !== undefined && r.roleRTG !== '')
    .map(rowToCard);
  // Flex-player collapsing is disabled for now (needs refinement) - see
  // collapseFlexPlayers() below, kept around to pick back up later.
}

// A player who logged 3+ different roles in the same tournament is a flex
// player - their role-specific ratings are individually diluted, so instead
// of showing several thin/low-rated rows for one person, collapse them into
// a single "Flex" row. roleRTG is already weighted by rounds played per
// role, so a simple average across their roles is the fair aggregate (same
// logic applied to ATT/DEF).
function collapseFlexPlayers(cards){
  const groups = new Map();
  cards.forEach(c=>{
    const key = `${c.tournament}|${c.team}|${c.player}`;
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  });

  const result = [];
  groups.forEach(group=>{
    const distinctRoles = [...new Set(group.map(c=>c.role))];
    if(distinctRoles.length >= 3){
      const avg = arr => Math.round(arr.reduce((a,b)=>a+b, 0) / arr.length);
      const rtg = avg(group.map(c=>c.rtg));
      const first = group[0];
      result.push({
        id: `${first.tournament}|${first.team}|${first.player}|flex`.toLowerCase().replace(/\s+/g,'_'),
        player: first.player, team: first.team, tournament: first.tournament,
        role: 'Flex',
        flexRoles: distinctRoles,
        att: avg(group.map(c=>c.att)),
        def: avg(group.map(c=>c.def)),
        rtg,
        tier: tierFromRtg(rtg)
      });
    } else {
      result.push(...group);
    }
  });
  return result;
}

// Rarity pill colors - used as pill backgrounds for ATT/DEF/OVR, each
// computed independently per value (a player can have a Diamond ATT and a
// Platinum DEF even if their overall OVR tier is something else).
const TIERS = {
  gold:      { label:"Gold",      bg:"#e8c046", fg:"#241d05" },
  platinum:  { label:"Platinum",  bg:"#36a0b3", fg:"#ffffff" },
  diamond:   { label:"Diamond",   bg:"#a771ed", fg:"#ffffff" },
  ascendant: { label:"Ascendant", bg:"#1ca85f", fg:"#ffffff" },
  immortal:  { label:"Immortal",  bg:"#8a3d78", fg:"#ffffff" },
  radiant:   { label:"Radiant",   bg:"#f5f1d6", fg:"#241d05" }
};
const TIER_ORDER = ["gold","platinum","diamond","ascendant","immortal","radiant"];

// Role pill colors - a separate palette from rarity, so the Role column
// never gets confused with the rating columns at a glance.
const ROLE_COLORS = {
  Duelist:    { bg:"#ff5c5c", fg:"#2a0808" },
  Initiator:  { bg:"#ffb454", fg:"#2a1a04" },
  Controller: { bg:"#5cc8ff", fg:"#04202a" },
  Sentinel:   { bg:"#2ecc71", fg:"#04240f" },
  Flex:       { bg:"#b8b8bd", fg:"#1a1a1c" }
};
const ROLE_ORDER = ['Duelist', 'Initiator', 'Controller', 'Sentinel'];

// EDIT THIS LIST to change the order events appear in throughout the site
// (Leaderboards sections, and the Event dropdown on All Players). Any
// event in the CSV that isn't listed here still shows - it just gets
// tacked on at the end, in whatever order it first appears in the CSV.
const EVENT_ORDER = [
  'Stage 1',
  'Masters London',
];

function orderedTournaments(){
  const present = [...new Set(CARDS.map(c=>c.tournament))];
  const known = EVENT_ORDER.filter(t=>present.includes(t));
  const rest = present.filter(t=>!EVENT_ORDER.includes(t));
  return [...known, ...rest];
}

/* =========================================================
   TABLE - filterable, sortable
   ========================================================= */
let filters = { tournament: 'all', team: 'all', role: 'all', search: '' };
let sortState = { col: 'rtg', dir: 'desc' };

const TEXT_COLS = new Set(['player', 'team', 'tournament', 'role']);

function sortRows(list){
  const { col, dir } = sortState;
  return [...list].sort((a,b)=>{
    let av = a[col], bv = b[col];
    if(typeof av === 'string'){ av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if(av < bv) return dir==='asc' ? -1 : 1;
    if(av > bv) return dir==='asc' ? 1 : -1;
    return 0;
  });
}

function pill(text, bg, fg){
  return `<span class="pill" style="background:${bg};color:${fg}">${text}</span>`;
}

function tableRowHtml(c, rank){
  const attTier = tierFromRtg(c.att);
  const defTier = tierFromRtg(c.def);
  const roleColor = ROLE_COLORS[c.role] || ROLE_COLORS.Flex;
  return `
    <tr>
      <td class="col-rank">${rank}</td>
      <td class="col-player">${c.player}</td>
      <td class="col-team">${c.team}</td>
      <td class="col-event">${c.tournament}</td>
      <td>${pill(c.role, roleColor.bg, roleColor.fg)}</td>
      <td>${pill(c.att, TIERS[attTier].bg, TIERS[attTier].fg)}</td>
      <td>${pill(c.def, TIERS[defTier].bg, TIERS[defTier].fg)}</td>
      <td>${pill(c.rtg, TIERS[c.tier].bg, TIERS[c.tier].fg)}</td>
    </tr>`;
}

function sortArrow(col){
  if(sortState.col !== col) return '';
  return sortState.dir === 'asc' ? ' ▲' : ' ▼';
}

function renderAllPlayers(){
  // preserve search box focus/cursor across the full re-render triggered by typing
  const prevSearchEl = document.getElementById('searchInput');
  const searchHadFocus = document.activeElement === prevSearchEl;
  const searchSelStart = searchHadFocus ? prevSearchEl.selectionStart : null;
  const searchSelEnd = searchHadFocus ? prevSearchEl.selectionEnd : null;

  // uses EVENT_ORDER (edit that list to reorder events site-wide)
  const tournamentOrder = orderedTournaments();
  const tourOptions = ['all', ...tournamentOrder].map(t=>
    `<option value="${t}" ${filters.tournament===t?'selected':''}>${t==='all'?'All Events':t}</option>`
  ).join('');

  const teamOrder = [...new Set(CARDS.map(c=>c.team))].sort();
  const teamOptions = ['all', ...teamOrder].map(team=>
    `<option value="${team}" ${filters.team===team?'selected':''}>${team==='all'?'All Teams':team}</option>`
  ).join('');

  const rolesPresent = [...new Set(CARDS.map(c=>c.role))];
  const roleOrder = [...ROLE_ORDER.filter(r=>rolesPresent.includes(r)), ...rolesPresent.filter(r=>!ROLE_ORDER.includes(r)).sort()];
  const roleOptions = ['all', ...roleOrder].map(role=>
    `<option value="${role}" ${filters.role===role?'selected':''}>${role==='all'?'All Roles':role}</option>`
  ).join('');

  const searchTerm = filters.search.trim().toLowerCase();
  const list = CARDS.filter(c =>
    (filters.tournament==='all' || c.tournament===filters.tournament) &&
    (filters.team==='all' || c.team===filters.team) &&
    (filters.role==='all' || c.role===filters.role) &&
    (searchTerm==='' || c.player.toLowerCase().includes(searchTerm) || c.team.toLowerCase().includes(searchTerm))
  );

  // rarity breakdown of the current filtered set (by OVR tier)
  const rarityVizHtml = TIER_ORDER.map(tier=>{
    const count = list.filter(c=>c.tier===tier).length;
    return `<div class="rarity-pill"><span class="rarity-dot" style="background:${TIERS[tier].bg}"></span>${TIERS[tier].label} <b>${count}</b></div>`;
  }).join('');

  const totalPlayers = CARDS.length;
  const totalTeams = new Set(CARDS.map(c=>c.team)).size;
  const totalTournaments = tournamentOrder.length;

  const sorted = sortRows(list);
  const rowsHtml = sorted.map((c,i)=>tableRowHtml(c, i+1)).join('');

  const cols = [
    ['player', 'Player'], ['team', 'Team'], ['tournament', 'Event'], ['role', 'Role'],
    ['att', 'ATT'], ['def', 'DEF'], ['rtg', 'OVR']
  ];
  const headHtml = `<th class="col-rank">#</th>` + cols.map(([key,label])=>
    `<th data-col="${key}" class="${sortState.col===key?'sorted':''}">${label}${sortArrow(key)}</th>`
  ).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Player Ratings</div>
      <div class="page-title">THE VAULT</div>
      <div class="page-sub">Every player rating across each tournament. Click a column header to sort.</div>
      <div class="stats-strip">${totalPlayers} Players · ${totalTeams} Teams · ${totalTournaments} Tournament${totalTournaments>1?'s':''}</div>
    </div>
    <div class="search-row">
      <input type="text" class="search-input" id="searchInput" placeholder="Search by player or team…" value="${filters.search.replace(/"/g,'&quot;')}">
    </div>
    <div class="controlbar">
      <div class="filter-group">
        <select class="select-filter" id="tourFilter">${tourOptions}</select>
        <select class="select-filter" id="teamFilter">${teamOptions}</select>
        <select class="select-filter" id="roleFilter">${roleOptions}</select>
      </div>
    </div>
    <div class="rarity-viz">${rarityVizHtml}</div>
    ${list.length===0
      ? `<div class="empty-state"><div class="big">No players match this filter</div>Try a different search, event, team, or role.</div>`
      : `<div class="table-wrap"><table class="stats-table"><thead><tr>${headHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`
    }
  `;

  const searchEl = document.getElementById('searchInput');
  searchEl.addEventListener('input', (e)=>{
    filters.search = e.target.value;
    renderAllPlayers();
  });
  if(searchHadFocus){
    searchEl.focus();
    searchEl.setSelectionRange(searchSelStart, searchSelEnd);
  }

  document.getElementById('tourFilter').addEventListener('change', (e)=>{
    filters.tournament = e.target.value;
    renderAllPlayers();
  });
  document.getElementById('teamFilter').addEventListener('change', (e)=>{
    filters.team = e.target.value;
    renderAllPlayers();
  });
  document.getElementById('roleFilter').addEventListener('change', (e)=>{
    filters.role = e.target.value;
    renderAllPlayers();
  });
  document.querySelectorAll('.stats-table th[data-col]').forEach(th=>{
    th.addEventListener('click', ()=>{
      const col = th.dataset.col;
      if(sortState.col === col){
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = col;
        sortState.dir = TEXT_COLS.has(col) ? 'asc' : 'desc';
      }
      renderAllPlayers();
    });
  });
}

/* =========================================================
   LEADERBOARDS - per event: top 5 players for each role, plus a
   computed "Team of the Event" built from that event's own typical
   role structure (not a fixed 5-role template - it's derived from
   the actual role counts logged for that event).
   ========================================================= */

// Works out how many players of each role a "typical" roster in this
// event actually ran, using the largest-remainder method so the counts
// are proportional to real observed role frequency and always sum to
// exactly 5 (a full roster). E.g. if Duelist rows outnumber Sentinel
// rows 2:1 across the event, the composite team leans the same way.
function typicalRoleStructure(eventCards){
  const teams = new Set(eventCards.map(c=>c.team));
  const numTeams = teams.size || 1;

  const roleCounts = {};
  eventCards.forEach(c=>{ roleCounts[c.role] = (roleCounts[c.role] || 0) + 1; });
  const roles = Object.keys(roleCounts);
  if(roles.length === 0) return {};

  const avgPerTeam = {};
  roles.forEach(r=> avgPerTeam[r] = roleCounts[r] / numTeams);

  const rounded = {};
  roles.forEach(r=> rounded[r] = Math.floor(avgPerTeam[r]));
  let total = roles.reduce((s,r)=> s + rounded[r], 0);

  // distribute remaining slots (to reach 5) to whichever roles have the
  // largest leftover fractional share - standard apportionment method
  while(total < 5){
    let best = roles[0];
    roles.forEach(r=>{
      if((avgPerTeam[r]-rounded[r]) > (avgPerTeam[best]-rounded[best])) best = r;
    });
    rounded[best]++;
    total++;
  }
  // if rounding overshot (rare, only possible with very few roles present), trim back down
  while(total > 5){
    const candidates = roles.filter(r=>rounded[r] > 0);
    if(candidates.length === 0) break;
    let worst = candidates[0];
    candidates.forEach(r=>{
      if((avgPerTeam[r]-rounded[r]) < (avgPerTeam[worst]-rounded[worst])) worst = r;
    });
    rounded[worst]--;
    total--;
  }
  return rounded;
}

// EDIT THIS LIST to change the order the role tables appear in on the
// Leaderboards page (top to bottom / left to right), and the order roles
// are added to the Team of the Event roster below. Just reorder the
// strings - nothing else needs to change. Any role not listed here just
// won't be shown (it doesn't need to include every role that exists).
const LEADERBOARD_ROLE_ORDER = [
  'Duelist',
  'Initiator',
  'Controller',
  'Sentinel',
];

function teamOfEvent(eventCards){
  const structure = typicalRoleStructure(eventCards);
  const roster = [];
  LEADERBOARD_ROLE_ORDER.filter(r=>structure[r]>0).forEach(role=>{
    const top = eventCards.filter(c=>c.role===role).sort((a,b)=>b.rtg-a.rtg).slice(0, structure[role]);
    roster.push(...top);
  });
  return { structure, roster };
}

function miniTableHtml(title, rows){
  const body = rows.map((c,i)=>{
    const attTier = tierFromRtg(c.att), defTier = tierFromRtg(c.def);
    return `
      <tr>
        <td class="col-rank">${i+1}</td>
        <td class="col-player">${c.player}</td>
        <td class="col-team">${c.team}</td>
        <td>${pill(c.att, TIERS[attTier].bg, TIERS[attTier].fg)}</td>
        <td>${pill(c.def, TIERS[defTier].bg, TIERS[defTier].fg)}</td>
        <td>${pill(c.rtg, TIERS[c.tier].bg, TIERS[c.tier].fg)}</td>
      </tr>`;
  }).join('');
  return `
    <div class="mini-table-block">
      <div class="mini-table-title">${title}</div>
      <table class="stats-table mini-table">
        <thead><tr><th class="col-rank">#</th><th>Player</th><th>Team</th><th>ATT</th><th>DEF</th><th>OVR</th></tr></thead>
        <tbody>${body || `<tr><td colspan="6" class="table-empty">No players</td></tr>`}</tbody>
      </table>
    </div>`;
}

function renderLeaderboards(){
  const tournamentOrder = orderedTournaments();

  const sectionsHtml = tournamentOrder.map(tournament=>{
    const eventCards = CARDS.filter(c=>c.tournament===tournament);
    const rolesPresent = LEADERBOARD_ROLE_ORDER.filter(r=>eventCards.some(c=>c.role===r));

    const roleTablesHtml = rolesPresent.map(role=>{
      const top5 = eventCards.filter(c=>c.role===role).sort((a,b)=>b.rtg-a.rtg).slice(0,5);
      return miniTableHtml(role, top5);
    }).join('');

    const { structure, roster } = teamOfEvent(eventCards);
    const structureLabel = Object.entries(structure)
      .filter(([,n])=>n>0)
      .map(([role,n])=>`${n} ${role}${n>1?'s':''}`)
      .join(' · ');

    const teamRows = roster.map(c=>{
      const attTier = tierFromRtg(c.att), defTier = tierFromRtg(c.def);
      const roleColor = ROLE_COLORS[c.role] || ROLE_COLORS.Flex;
      return `
        <tr>
          <td>${pill(c.role, roleColor.bg, roleColor.fg)}</td>
          <td class="col-player">${c.player}</td>
          <td class="col-team">${c.team}</td>
          <td>${pill(c.att, TIERS[attTier].bg, TIERS[attTier].fg)}</td>
          <td>${pill(c.def, TIERS[defTier].bg, TIERS[defTier].fg)}</td>
          <td>${pill(c.rtg, TIERS[c.tier].bg, TIERS[c.tier].fg)}</td>
        </tr>`;
    }).join('');

    return `
      <div class="event-section">
        <div class="event-header">
          <div class="event-title">${tournament}</div>
          <div class="event-sub">${eventCards.length} rated performances</div>
        </div>

        <div class="mini-table-grid">${roleTablesHtml}</div>

        <div class="toe-block">
          <div class="toe-title">Team of the Event</div>
          <div class="toe-sub">Composition based on this event's own role mix: ${structureLabel}</div>
          <table class="stats-table toe-table">
            <thead><tr><th>Role</th><th>Player</th><th>Team</th><th>ATT</th><th>DEF</th><th>OVR</th></tr></thead>
            <tbody>${teamRows}</tbody>
          </table>
        </div>
      </div>`;
  }).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Leaderboards</div>
      <div class="page-title">TOP PERFORMERS</div>
      <div class="page-sub">Top 5 players per role for each event, plus a computed Team of the Event built from that event's own typical role mix.</div>
    </div>
    ${sectionsHtml || `<div class="empty-state"><div class="big">No data yet</div></div>`}
  `;
}

/* =========================================================
   PAGE ROUTER
   ========================================================= */
let currentPage = 'players';

function renderPage(){
  if(currentPage === 'players') renderAllPlayers();
  else if(currentPage === 'leaderboards') renderLeaderboards();
}
function setPage(page){
  currentPage = page;
  document.querySelectorAll('.nav-tab').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  renderPage();
}
document.querySelectorAll('.nav-tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(!dataReady) return;
    setPage(btn.dataset.page);
  });
});

/* =========================================================
   INIT — load player data from CSV, then start the app
   ========================================================= */
const CSV_FILENAME = "VCT_PlayerRatings.csv";

async function initApp(){
  try{
    const res = await fetch(CSV_FILENAME, { cache: "no-store" });
    if(!res.ok) throw new Error(`fetch returned ${res.status}`);
    const text = await res.text();
    const parsed = Papa.parse(text, { header:true, skipEmptyLines:true });
    const parsedCards = rowsToCards(parsed.data);
    if(parsedCards.length === 0) throw new Error("CSV parsed but contained no valid rows");
    CARDS = parsedCards;
    startApp();
  }catch(e){
    showCsvError(e.message);
  }
}

function showCsvError(detail){
  document.getElementById('pageContent').innerHTML = `
    <div class="csv-gate">
      <div class="eyebrow">Load Player Data</div>
      <div class="page-title">COULDN'T LOAD CSV</div>
      <div class="page-sub">
        Couldn't automatically load <b>${CSV_FILENAME}</b> from this folder${detail ? ` (${detail})` : ''}.
        Make sure the file is named exactly <b>${CSV_FILENAME}</b>, sits in the same folder as this page,
        and has been pushed to your host. This only works when the page is served over http(s)
        (e.g. GitHub Pages) — opened directly from disk via file://, browsers block the request.
      </div>
      <button class="btn" style="margin-top:18px;" id="retryBtn">RETRY</button>
    </div>
  `;
  document.getElementById('retryBtn').addEventListener('click', initApp);
}

function startApp(){
  dataReady = true;
  setPage('players');
}

// Safety net: if something unexpected throws before the app finishes booting,
// don't leave the person staring at "FETCHING PLAYER DATA…" forever - surface
// a message so it's obvious something needs attention (check the browser
// console for the actual error).
window.addEventListener('error', (e)=>{
  if(!dataReady){
    showCsvError(e.message || 'see browser console for details');
  }
});

try{
  initApp();
}catch(e){
  showCsvError(e.message || 'see browser console for details');
}
