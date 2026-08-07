/* =========================================================
   DATA + RARITY SYSTEM
   ========================================================= */

let PLAYERS = [];
let dataReady = false;

function tierFromRtg(r){
  if(r>=95) return 'radiant';
  if(r>=90) return 'immortal';
  if(r>=85) return 'ascendant';
  if(r>=80) return 'diamond';
  if(r>=70) return 'platinum';
  return 'gold';
}

const ROLE_COLORS = {
  Duelist: 'var(--duelist)',
  Initiator: 'var(--initiator)',
  Controller: 'var(--controller)',
  Sentinel: 'var(--sentinel)'
};

function rowsToPlayers(rows){
  return rows
    .filter(r => r.Player && r.Tournament && r.roleRTG)
    .map(r => ({
      player: r.Player.trim(),
      team: r.Team.trim(),
      tournament: r.Tournament.trim(),
      role: r.Role.trim(),
      att: Number(r.attRTG),
      def: Number(r.defRTG),
      ovr: Number(r.roleRTG),
      tier: tierFromRtg(Number(r.roleRTG))
    }));
}

/* =========================================================
   TABLE RENDERING
   ========================================================= */

let filters = { tournament: 'all' };

function rarityPill(value){
  const tier = tierFromRtg(value);
  return `<span class="rarity-pill" style="background:var(--${tier})">${value}</span>`;
}

function rolePill(role){
  const col = ROLE_COLORS[role] || '#555';
  return `<span class="role-pill" style="background:${col}">${role}</span>`;
}

function render(){
  const tournaments = [...new Set(PLAYERS.map(p=>p.tournament))];
  const tourOptions = ['all', ...tournaments].map(t =>
    `<option value="${t}" ${filters.tournament===t?'selected':''}>${t==='all'?'All Events':t}</option>`
  ).join('');

  const list = PLAYERS.filter(p => filters.tournament==='all' || p.tournament===filters.tournament);

  const rows = list.map(p => `
    <tr>
      <td>${p.player}</td>
      <td>${p.team}</td>
      <td>${p.tournament}</td>
      <td>${rolePill(p.role)}</td>
      <td>${rarityPill(p.att)}</td>
      <td>${rarityPill(p.def)}</td>
      <td>${rarityPill(p.ovr)}</td>
    </tr>
  `).join('');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Player Ratings</div>
      <div class="page-title">THE VAULT</div>
      <div class="page-sub">Filterable table of all player ratings across every event.</div>
    </div>

    <div class="filterbar">
      <select class="select-filter" id="tourFilter">${tourOptions}</select>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
            <th>Event</th>
            <th>Role</th>
            <th>ATT</th>
            <th>DEF</th>
            <th>OVR</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;

  document.getElementById('tourFilter').addEventListener('change', e=>{
    filters.tournament = e.target.value;
    render();
  });
}

/* =========================================================
   INIT
   ========================================================= */

const CSV_FILENAME = "VCT_PlayerRatings.csv";

async function initApp(){
  try{
    const res = await fetch(CSV_FILENAME, { cache:"no-store" });
    if(!res.ok) throw new Error(`fetch returned ${res.status}`);
    const text = await res.text();
    const parsed = Papa.parse(text, { header:true, skipEmptyLines:true });

    PLAYERS = rowsToPlayers(parsed.data);
    if(PLAYERS.length === 0) throw new Error("CSV parsed but contained no valid rows");

    dataReady = true;
    render();
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
        Couldn't load <b>${CSV_FILENAME}</b> (${detail}).  
        Ensure the file is in the same folder and served over http(s).
      </div>
      <button class="btn" id="retryBtn">RETRY</button>
    </div>
  `;
  document.getElementById('retryBtn').addEventListener('click', initApp);
}

window.addEventListener('error', e=>{
  if(!dataReady){
    showCsvError(e.message || 'see browser console');
  }
});

initApp();
