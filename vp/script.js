/* =========================================================
   DATA
   ========================================================= */
let CARDS = [];
let dataReady = false;

// Tier is derived from roleRTG, not stored in the CSV.
function tierFromRtg(r){
  if(r>=90) return 'radiant';
  if(r>=80) return 'diamond';
  if(r>=70) return 'gold';
  if(r>=60) return 'silver';
  return 'bronze';
}

// Card id is built from its own fields (not row position) so IDs stay stable
// across CSV re-orders/edits.
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
    tier: tierFromRtg(rtg),
    raw: r // keep the original row so the card-back can show any stat columns
           // added to the CSV later, without needing code changes
  };
}

function rowsToCards(rows){
  return rows
    .filter(r => r.Player && r.Tournament && r.roleRTG !== undefined && r.roleRTG !== '')
    .map(rowToCard);
}

const TIERS = {
  bronze:  { label:"Bronze",  color:"#c9915c", glow:"#c98b52",
             grad:"linear-gradient(120deg, #6e4423, #c98b52, #6e4423, #c98b52)",
             cardA:"#3d2313", cardB:"#a9673a" },
  silver:  { label:"Silver",  color:"#c7d0d8", glow:"#e3e9ef",
             grad:"linear-gradient(120deg, #7c8791, #e3e9ef, #7c8791, #e3e9ef)",
             cardA:"#3c4249", cardB:"#c3ccd3" },
  gold:    { label:"Gold",    color:"#f0b429", glow:"#ffd76a",
             grad:"linear-gradient(120deg, #b9791a, #ffd76a, #b9791a, #ffd76a)",
             cardA:"#4a3405", cardB:"#e8ab1f" },
  diamond: { label:"Diamond", color:"#c58aff", glow:"#eddcff",
             grad:"linear-gradient(120deg, #5b1f8a, #eddcff, #5b1f8a, #eddcff)",
             cardA:"#2c0f47", cardB:"#9b4fe0" },
  radiant: { label:"Radiant", color:"#f2e9c9", glow:"#fff6d9",
             grad:"linear-gradient(120deg, #ffd76a, #ffffff, #f2e9c9, #ffffff, #ffd76a)",
             cardA:"#3a3220", cardB:"#f0dfa0" }
};
const TIER_ORDER = ["bronze","silver","gold","diamond","radiant"];

/* =========================================================
   AVATAR / HEADSHOT HANDLING
   ========================================================= */
const AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></svg>`;

// Headshot PNGs are optional — drop files into a `headshots/` folder next to this
// HTML file, named by slugified player name (e.g. "TenZ" -> headshots/tenz.png).
// If a player-specific file isn't found, this falls back to a single shared
// silhouette image (headshots/silhouette.png), and if even that's missing,
// falls back to the built-in placeholder icon.
const SILHOUETTE_SRC = "headshots/silhouette.png";

function headshotSlug(player){
  return player.toLowerCase().replace(/[^a-z0-9]/g,'');
}
function avatarBlock(player){
  const src = `headshots/${headshotSlug(player)}.png`;
  return `<img src="${src}" alt="${player}" loading="lazy"
      onerror="this.onerror=function(){ this.style.display='none'; this.nextElementSibling.style.display='flex'; }; this.src='${SILHOUETTE_SRC}';">
    <span class="avatar-fallback">${AVATAR_SVG}</span>`;
}

/* =========================================================
   CARD MARKUP - shared by the gallery grid and the enlarge/flip modal
   ========================================================= */
function cardMarkup(c){
  const t = TIERS[c.tier];
  return `
    <div class="pcard" data-card-id="${c.id}" style="background:${t.grad}">
      <div class="pcard-inner">
        <div class="pcard-photo" style="background:linear-gradient(160deg, ${t.cardA}, ${t.cardB})">
          ${avatarBlock(c.player)}
          <div class="pcard-rating">${c.rtg}</div>
          <div class="pcard-tourtag">${c.tournament}</div>
        </div>
        <div class="pcard-plate">
          <div class="pcard-name">${c.player}</div>
          <div class="pcard-team">${c.team}</div>
          <div class="pcard-meta">
            <span class="tier-pill" style="color:${t.color}">● ${t.label}</span>
            <span class="role-pill">${c.role}</span>
          </div>
          <div class="pcard-stats"><span>ATT <b>${c.att}</b></span><span>DEF <b>${c.def}</b></span></div>
        </div>
      </div>
    </div>`;
}

// Turns a raw CSV column name into a readable label. Known columns get a
// friendly name; anything added to the CSV later (down the line, more stats)
// falls back to a generic camelCase-to-Words conversion automatically.
const KNOWN_STAT_LABELS = { attRTG: "Attack Rating", defRTG: "Defense Rating", roleRTG: "Role Rating" };
function labelize(key){
  if(KNOWN_STAT_LABELS[key]) return KNOWN_STAT_LABELS[key];
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, s=>s.toUpperCase());
}

// Back of the card - full stat breakdown, built from whatever columns exist
// in the CSV row beyond the identity fields (Player/Team/Tournament/Role).
// New stat columns added to the CSV later show up here automatically.
const IDENTITY_FIELDS = new Set(['player','team','tournament','role']);
function cardBackMarkup(c){
  const t = TIERS[c.tier];
  const extraStats = Object.entries(c.raw || {})
    .filter(([k, v]) => k.trim() !== '' && !IDENTITY_FIELDS.has(k.toLowerCase()) && v !== '' && v !== undefined);

  const rows = extraStats.map(([k, v]) => `
    <div class="stat-line">
      <span class="stat-line-k">${labelize(k)}</span>
      <span class="stat-line-v">${v}</span>
    </div>`).join('');

  return `
    <div class="pcard" style="background:${t.grad}">
      <div class="pcard-inner pcard-backpanel">
        <div class="pcard-back-header">
          <div class="pcard-name">${c.player}</div>
          <div class="pcard-team">${c.team} · ${c.tournament}</div>
        </div>
        <div class="stat-list">${rows || '<div class="stat-line"><span class="stat-line-k">No additional stats yet</span></div>'}</div>
      </div>
    </div>`;
}

function cardById(id){ return CARDS.find(c=>c.id===id); }

/* =========================================================
   GALLERY - grouped by team (default) or flat sorted by rating
   ========================================================= */
let filters = { tournament: 'all', mode: 'team' };

function render(){
  const tournaments = ['all', ...new Set(CARDS.map(c=>c.tournament))];
  const tourOptions = tournaments.map(t=>
    `<option value="${t}" ${filters.tournament===t?'selected':''}>${t==='all'?'All Events':t}</option>`
  ).join('');

  const list = CARDS.filter(c => filters.tournament==='all' || c.tournament===filters.tournament);

  let contentHtml;
  if(filters.mode === 'rating'){
    const sorted = [...list].sort((a,b)=> b.rtg - a.rtg);
    contentHtml = `<div class="card-grid">${sorted.map(cardMarkup).join('')}</div>`;
  } else {
    const teams = [...new Set(list.map(c=>c.team))].sort();
    contentHtml = teams.map(team=>{
      const teamCards = list.filter(c=>c.team===team).sort((a,b)=> b.rtg - a.rtg);
      return `
        <div class="team-block">
          <div class="team-header">
            <div class="team-name">${team}</div>
            <div class="team-count">${teamCards.length} Player${teamCards.length>1?'s':''}</div>
          </div>
          <div class="card-grid">${teamCards.map(cardMarkup).join('')}</div>
        </div>`;
    }).join('');
  }

  if(list.length === 0){
    contentHtml = `<div class="empty-state"><div class="big">No cards match this filter</div>Try a different event.</div>`;
  }

  document.getElementById('pageContent').innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Player Cards</div>
      <div class="page-title">THE VAULT</div>
      <div class="page-sub">Every player card across each tournament — grouped by team, or ranked by rating.</div>
    </div>
    <div class="controlbar">
      <select class="select-filter" id="tourFilter">${tourOptions}</select>
      <div class="mode-toggle">
        <button class="chip ${filters.mode==='team'?'active':''}" data-mode="team">By Team</button>
        <button class="chip ${filters.mode==='rating'?'active':''}" data-mode="rating">Top Rated</button>
      </div>
    </div>
    ${contentHtml}
  `;

  document.getElementById('tourFilter').addEventListener('change', (e)=>{
    filters.tournament = e.target.value;
    render();
  });
  document.querySelectorAll('[data-mode]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ filters.mode = btn.dataset.mode; render(); });
  });
  document.querySelectorAll('.pcard[data-card-id]').forEach(el=>{
    el.addEventListener('click', ()=> openCardModal(el.dataset.cardId));
  });
}

/* =========================================================
   CARD MODAL - click to enlarge, button to flip and see full stats
   ========================================================= */
let modalCard = null;
let modalFlipped = false;

function openCardModal(cardId){
  const c = cardById(cardId);
  if(!c) return;
  modalCard = c;
  modalFlipped = false;
  renderModal();
  document.getElementById('cardModal').classList.add('show');
}

function renderModal(){
  const stage = document.getElementById('modalStage');
  stage.innerHTML = `
    <div class="modal-flip-outer">
      <div class="modal-flip-inner ${modalFlipped ? 'flipped' : ''}" id="modalFlipInner">
        <div class="modal-face front">${cardMarkup(modalCard)}</div>
        <div class="modal-face back">${cardBackMarkup(modalCard)}</div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn ghost" id="flipBtn">${modalFlipped ? 'SHOW FRONT' : 'FLIP CARD · FULL STATS'}</button>
    </div>
  `;
  document.getElementById('flipBtn').addEventListener('click', ()=>{
    modalFlipped = !modalFlipped;
    renderModal();
  });
}

function closeCardModal(){
  document.getElementById('cardModal').classList.remove('show');
  modalCard = null;
}

document.getElementById('cardModal').addEventListener('click', (e)=>{
  if(e.target.id === 'cardModal') closeCardModal();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && document.getElementById('cardModal').classList.contains('show')){
    closeCardModal();
  }
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
  document.getElementById('modalClose')?.addEventListener('click', closeCardModal);
  initApp();
}catch(e){
  showCsvError(e.message || 'see browser console for details');
}
