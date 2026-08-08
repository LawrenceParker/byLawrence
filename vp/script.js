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
  const cards = rows
    .filter(r => r.Player && r.Tournament && r.roleRTG !== undefined && r.roleRTG !== '')
    .map(rowToCard);
  return collapseFlexPlayers(cards);
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
const ROLE_ORDER = ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex'];

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

function tableRowHtml(c){
  const attTier = tierFromRtg(c.att);
  const defTier = tierFromRtg(c.def);
  const roleColor = ROLE_COLORS[c.role] || ROLE_COLORS.Flex;
  const roleLabel = c.role === 'Flex' && c.flexRoles ? `Flex (${c.flexRoles.join('/')})` : c.role;
  return `
    <tr>
      <td class="col-player">${c.player}</td>
      <td class="col-team">${c.team}</td>
      <td class="col-event">${c.tournament}</td>
      <td>${pill(roleLabel, roleColor.bg, roleColor.fg)}</td>
      <td>${pill(c.att, TIERS[attTier].bg, TIERS[attTier].fg)}</td>
      <td>${pill(c.def, TIERS[defTier].bg, TIERS[defTier].fg)}</td>
      <td>${pill(c.rtg, TIERS[c.tier].bg, TIERS[c.tier].fg)}</td>
    </tr>`;
}

function sortArrow(col){
  if(sortState.col !== col) return '';
  return sortState.dir === 'asc' ? ' ▲' : ' ▼';
}

function render(){
  // preserve search box focus/cursor across the full re-render triggered by typing
  const prevSearchEl = document.getElementById('searchInput');
  const searchHadFocus = document.activeElement === prevSearchEl;
  const searchSelStart = searchHadFocus ? prevSearchEl.selectionStart : null;
  const searchSelEnd = searchHadFocus ? prevSearchEl.selectionEnd : null;

  // preserve first-seen order from the CSV for a stable, sensible tournament order
  const tournamentOrder = [...new Set(CARDS.map(c=>c.tournament))];
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
  const rowsHtml = sorted.map(tableRowHtml).join('');

  const cols = [
    ['player', 'Player'], ['team', 'Team'], ['tournament', 'Event'], ['role', 'Role'],
    ['att', 'ATT'], ['def', 'DEF'], ['rtg', 'OVR']
  ];
  const headHtml = cols.map(([key,label])=>
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
    render();
  });
  if(searchHadFocus){
    searchEl.focus();
    searchEl.setSelectionRange(searchSelStart, searchSelEnd);
  }

  document.getElementById('tourFilter').addEventListener('change', (e)=>{
    filters.tournament = e.target.value;
    render();
  });
  document.getElementById('teamFilter').addEventListener('change', (e)=>{
    filters.team = e.target.value;
    render();
  });
  document.getElementById('roleFilter').addEventListener('change', (e)=>{
    filters.role = e.target.value;
    render();
  });
  document.querySelectorAll('.stats-table th').forEach(th=>{
    th.addEventListener('click', ()=>{
      const col = th.dataset.col;
      if(sortState.col === col){
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = col;
        sortState.dir = TEXT_COLS.has(col) ? 'asc' : 'desc';
      }
      render();
    });
  });
}

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
  render();
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
