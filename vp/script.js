/* ============================================================
   VCT PACKS — data loading, pack logic, collection, persistence
   ============================================================ */

const CSV_PATH = 'players.csv';
const STORAGE_KEY = 'vctPacks.history.v2';

const TIER_LABEL = { gold:'GOLD', platinum:'PLATINUM', diamond:'DIAMOND', immortal:'IMMORTAL', radiant:'RADIANT' };
const TIER_COLOR = { gold:'#c9a24a', platinum:'#21d0c4', diamond:'#b083ff', immortal:'#ff3d5e', radiant:'#ffe38a' };

const ROLE_ICONS = {
  Duelist: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 42L26 22" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M22 18L34 6L42 6L42 14L30 26" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="10" cy="38" r="3" stroke="currentColor" stroke-width="2.5"/>
  </svg>`,
  Initiator: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="6" stroke="currentColor" stroke-width="3"/>
    <circle cx="24" cy="24" r="14" stroke="currentColor" stroke-width="2" opacity="0.6"/>
    <circle cx="24" cy="24" r="21" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
    <circle cx="24" cy="24" r="2.5" fill="currentColor"/>
  </svg>`,
  Controller: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 30C10 20 16 14 24 14C32 14 38 20 42 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M10 36C14 28 18 24 24 24C30 24 34 28 38 36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <circle cx="24" cy="10" r="3" fill="currentColor"/>
  </svg>`,
  Sentinel: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 5L40 11V22C40 32 33 40 24 43C15 40 8 32 8 22V11L24 5Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M24 15V32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M17 22H31" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`
};

const LOCK_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="10" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
  <path d="M7 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" stroke-width="1.8"/>
</svg>`;

function tierFor(ovr){
  if(ovr>=95) return 'radiant';
  if(ovr>=85) return 'immortal';
  if(ovr>=75) return 'diamond';
  if(ovr>=65) return 'platinum';
  return 'gold';
}

/* ---------- CSV parsing (handles quoted fields) ---------- */
function parseCSV(text){
  const rows = [];
  let row = [], field = '', inQuotes = false;
  text = text.replace(/\r\n/g, '\n');
  for(let i=0; i<text.length; i++){
    const c = text[i];
    if(inQuotes){
      if(c === '"'){
        if(text[i+1] === '"'){ field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if(c === '"') inQuotes = true;
      else if(c === ','){ row.push(field); field=''; }
      else if(c === '\n'){ row.push(field); rows.push(row); row=[]; field=''; }
      else field += c;
    }
  }
  if(field.length || row.length){ row.push(field); rows.push(row); }

  const headers = rows.shift().map(h => h.trim());
  return rows
    .filter(r => r.length > 1 || (r[0] && r[0].trim() !== ''))
    .map(r => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = (r[idx] || '').trim(); });
      return obj;
    });
}

function normalizePlayers(rawRows){
  return rawRows.map(r => ({
    name: r.Player,
    team: r.Team || '',
    role: r.Role,
    tournament: r.Tournament || 'Set 1',
    atk: parseInt(r.attRTG, 10) || 0,
    def_: parseInt(r.defRTG, 10) || 0,
    ovr: parseInt(r.ovrRTG, 10) || 0,
  })).filter(p => p.name && p.role);
}

function playerKey(p){
  return `${p.name}||${p.role}||${p.tournament}`;
}

/* ---------- state ---------- */
let PLAYERS = [];
let TOURNAMENTS = [];
let currentTournament = null;
let currentPoolFiltered = [];
let history = loadHistory();

/* ---------- DOM refs ---------- */
const loadState = document.getElementById('loadState');
const errorState = document.getElementById('errorState');
const packHub = document.getElementById('packHub');
const hubGrid = document.getElementById('hubGrid');
const packScreen = document.getElementById('packScreen');
const packScreenTitle = document.getElementById('packScreenTitle');
const packEmblemSub = document.getElementById('packEmblemSub');
const backToHubBtn = document.getElementById('backToHubBtn');
const packWrap = document.getElementById('packWrap');
const pack = document.getElementById('pack');
const openBtn = document.getElementById('openBtn');
const cardOuter = document.getElementById('cardOuter');
const card3d = document.getElementById('card3d');
const card = document.getElementById('card');
const burst = document.getElementById('burst');
const rays = document.getElementById('rays');
const historyGrid = document.getElementById('historyGrid');
const holoSheen = document.getElementById('holoSheen');
const csvFileInput = document.getElementById('csvFileInput');
const clearHistBtn = document.getElementById('clearHistBtn');
const collectionGroups = document.getElementById('collectionGroups');
const collectionSummary = document.getElementById('collectionSummary');

/* ---------- tabs ---------- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById(tab === 'packs' ? 'panelPacks' : 'panelCollection').classList.add('active');
    if(tab === 'collection') renderCollection();
  });
});

/* ---------- persistence ---------- */
function loadHistory(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    console.warn('Could not read saved pulls:', e);
    return [];
  }
}
function saveHistory(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch(e){
    console.warn('Could not save pulls:', e);
  }
}
function ownedKeySet(){
  return new Set(history.map(h => playerKey(h.p)));
}

/* ---------- data loading ---------- */
function init(){
  fetch(CSV_PATH)
    .then(res => {
      if(!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(text => onCSVLoaded(text))
    .catch(err => {
      console.warn('CSV fetch failed:', err);
      showErrorState();
    });
}

function onCSVLoaded(text){
  const rows = parseCSV(text);
  PLAYERS = normalizePlayers(rows);
  if(!PLAYERS.length){
    showErrorState();
    return;
  }
  TOURNAMENTS = [...new Set(PLAYERS.map(p => p.tournament))];

  loadState.style.display = 'none';
  errorState.style.display = 'none';

  renderHub();
  packHub.style.display = 'flex';

  renderStatsFromHistory();
  renderHistory();
}

function showErrorState(){
  loadState.style.display = 'none';
  errorState.style.display = 'flex';
}

csvFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => onCSVLoaded(reader.result);
  reader.onerror = () => alert('Could not read that file.');
  reader.readAsText(file);
});

/* ---------- pack hub ---------- */
function renderHub(){
  hubGrid.innerHTML = TOURNAMENTS.map(t => {
    const count = PLAYERS.filter(p => p.tournament === t).length;
    return `
      <div class="hub-tile" data-tournament="${escapeHtml(t)}">
        <div class="mark"></div>
        <div class="hub-name">${escapeHtml(t)}</div>
        <div class="hub-count">${count} Cards</div>
      </div>
    `;
  }).join('');

  hubGrid.querySelectorAll('.hub-tile').forEach(tile => {
    tile.addEventListener('click', () => openPackScreen(tile.dataset.tournament));
  });
}

function openPackScreen(tournament){
  currentTournament = tournament;
  currentPoolFiltered = PLAYERS.filter(p => p.tournament === tournament);

  packScreenTitle.textContent = tournament;
  packEmblemSub.textContent = tournament;

  packHub.style.display = 'none';
  packScreen.style.display = 'flex';
  packWrap.style.display = 'flex';
  cardOuter.classList.remove('show','reveal');
  card3d.classList.remove('flip');
  openBtn.disabled = false;
}

backToHubBtn.addEventListener('click', () => {
  packScreen.style.display = 'none';
  packHub.style.display = 'flex';
});

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- image fallback helper ---------- */
function imgOrFallback(container, src, fallbackHTML){
  if(src){
    const img = document.createElement('img');
    img.onerror = () => { container.innerHTML = fallbackHTML; };
    img.src = src;
    container.innerHTML = '';
    container.appendChild(img);
  } else {
    container.innerHTML = fallbackHTML;
  }
}

/* ---------- card rendering (main reveal) ---------- */
function pickPlayer(){
  return currentPoolFiltered[Math.floor(Math.random() * currentPoolFiltered.length)];
}

function renderCard(p){
  const tier = tierFor(p.ovr);

  card.setAttribute('data-tier', tier);
  document.getElementById('roleFull').textContent = p.role;
  document.getElementById('atkVal').textContent = p.atk;
  document.getElementById('defVal').textContent = p.def_;
  document.getElementById('setName').textContent = p.tournament;
  document.getElementById('pName').textContent = p.name;
  document.getElementById('pTeamLine').textContent = p.team || '';
  document.getElementById('ovrNum').textContent = p.ovr;

  const iconContainer = document.getElementById('roleIcon');
  imgOrFallback(iconContainer, p.roleIcon, ROLE_ICONS[p.role] || '');

  const barIconContainer = document.getElementById('barIcon');
  barIconContainer.innerHTML = ROLE_ICONS[p.role] || '';

  document.getElementById('pullCaption').textContent = `${p.name} — ${TIER_LABEL[tier]} ${p.role.toUpperCase()}`;

  return tier;
}

/* ---------- history + stats ---------- */
function addToHistory(p, tier){
  history.unshift({ p, tier, ts: Date.now() });
  saveHistory();
  renderHistory();
  renderStatsFromHistory();
}

function renderHistory(){
  if(!history.length){
    historyGrid.innerHTML = '<div class="empty-hist">No pulls yet — open a pack to start your collection.</div>';
    return;
  }
  historyGrid.innerHTML = history.slice(0, 60).map(h => `
    <div class="mini-card" data-tier="${h.tier}">
      <div class="m-ovr">${h.p.ovr}</div>
      <div class="m-name">${escapeHtml(h.p.name)}</div>
      <div class="m-role">${escapeHtml(h.p.role)}</div>
    </div>
  `).join('');
}

function renderStatsFromHistory(){
  document.getElementById('statOpened').textContent = history.length;
  const radiantCount = history.filter(h => h.tier === 'radiant').length;
  document.getElementById('statRad').textContent = radiantCount;
  if(history.length){
    const best = history.reduce((a, b) => (b.p.ovr > a.p.ovr ? b : a));
    document.getElementById('statBest').textContent = `${best.p.name} (${best.p.ovr})`;
  } else {
    document.getElementById('statBest').textContent = '—';
  }
}

clearHistBtn.addEventListener('click', () => {
  if(!history.length) return;
  if(!confirm('Clear your saved pull history and collection? This cannot be undone.')) return;
  history = [];
  saveHistory();
  renderHistory();
  renderStatsFromHistory();
  renderCollection();
});

/* ---------- collection tab ---------- */
function buildMiniCardMarkup(p, tier, index){
  return `
    <div class="collection-scale">
      <div class="card" data-tier="${tier}">
        <div class="card-bg-pattern"></div>
        <div class="holo-sheen"></div>
        <div class="card-top-pin"></div>
        <div class="card-role-name">${escapeHtml(p.role)}</div>
        <div class="card-stat-corner left">
          <div class="stat-num">${p.atk}</div>
          <div class="stat-lbl">ATK</div>
        </div>
        <div class="card-stat-corner right">
          <div class="stat-num">${p.def_}</div>
          <div class="stat-lbl">DEF</div>
        </div>
        <div class="card-emblem-wrap">
          <div class="card-emblem-plate">
            <div class="card-emblem-icon" data-emblem-index="${index}"></div>
          </div>
        </div>
        <div class="card-set-name">${escapeHtml(p.tournament)}</div>
        <div class="card-name-bar"><span class="bar-icon" data-bar-icon-index="${index}"></span><span>${escapeHtml(p.name)}</span></div>
        <div class="card-team-name">${escapeHtml(p.team || '')}</div>
        <div class="card-bottom-badge"><div class="badge-num">${p.ovr}</div></div>
        <div class="card-corner-tri left"></div>
        <div class="card-corner-tri right"></div>
      </div>
    </div>
  `;
}

function buildLockedCardMarkup(){
  return `
    <div class="locked-card">
      <div class="lock-icon">${LOCK_ICON}</div>
      <div class="lock-txt">Locked</div>
    </div>
  `;
}

function renderCollection(){
  if(!PLAYERS.length){
    collectionGroups.innerHTML = '<div class="empty-hist">Load player data on the Packs tab first.</div>';
    return;
  }
  const owned = ownedKeySet();
  const totalOwned = new Set(PLAYERS.filter(p => owned.has(playerKey(p))).map(p => playerKey(p))).size;
  collectionSummary.innerHTML = `<div class="stat-chip">CARDS COLLECTED <b>${totalOwned} / ${PLAYERS.length}</b></div>`;

  // players that are owned and need an emblem icon filled in after insertion (avoids
  // embedding raw SVG markup inside HTML attributes)
  const emblemQueue = [];

  collectionGroups.innerHTML = TOURNAMENTS.map(t => {
    const rows = PLAYERS.filter(p => p.tournament === t);
    const ownedInGroup = rows.filter(p => owned.has(playerKey(p))).length;
    const cardsHtml = rows.map(p => {
      const key = playerKey(p);
      if(owned.has(key)){
        const idx = emblemQueue.length;
        emblemQueue.push(p);
        return buildMiniCardMarkup(p, tierFor(p.ovr), idx);
      }
      return buildLockedCardMarkup();
    }).join('');

    return `
      <div class="collection-group">
        <div class="collection-group-head">
          <h3>${escapeHtml(t)}</h3>
          <div class="prog">${ownedInGroup} / ${rows.length} collected</div>
        </div>
        <div class="collection-grid">${cardsHtml}</div>
      </div>
    `;
  }).join('');

  collectionGroups.querySelectorAll('.card-emblem-icon[data-emblem-index]').forEach(container => {
    const idx = parseInt(container.getAttribute('data-emblem-index'), 10);
    const p = emblemQueue[idx];
    if(!p) return;
    imgOrFallback(container, p.roleIcon, ROLE_ICONS[p.role] || '');
  });

  collectionGroups.querySelectorAll('.bar-icon[data-bar-icon-index]').forEach(container => {
    const idx = parseInt(container.getAttribute('data-bar-icon-index'), 10);
    const p = emblemQueue[idx];
    if(!p) return;
    container.innerHTML = ROLE_ICONS[p.role] || '';
  });
}

/* ---------- burst fx ---------- */
function fireBurst(tier){
  const color = TIER_COLOR[tier];
  burst.style.setProperty('--burst-color', color);
  burst.classList.remove('fire'); void burst.offsetWidth; burst.classList.add('fire');
  rays.classList.remove('fire'); void rays.offsetWidth; rays.classList.add('fire');
  rays.innerHTML = `
    <defs>
      <radialGradient id="rayGrad2" cx="50%" cy="55%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    ${Array.from({length:14}).map((_,i)=>{
      const angle = (360/14)*i;
      return `<rect x="49.3" y="0" width="1.4" height="55" fill="url(#rayGrad2)" transform="rotate(${angle} 50 55)"/>`;
    }).join('')}
  `;
}

/* ---------- pack open flow ---------- */
function openPack(){
  if(!currentPoolFiltered.length) return;
  openBtn.disabled = true;
  pack.classList.add('shaking');

  setTimeout(()=>{
    pack.classList.add('charging');
  }, 150);

  setTimeout(()=>{
    const p = pickPlayer();
    const tier = renderCard(p);

    fireBurst(tier);
    packWrap.style.display = 'none';

    cardOuter.classList.add('show');
    card3d.classList.remove('flip');
    void card3d.offsetWidth;
    card3d.classList.add('flip');
    cardOuter.classList.add('reveal');

    addToHistory(p, tier);

    pack.classList.remove('shaking','charging');
  }, 950);
}

openBtn.addEventListener('click', openPack);

document.getElementById('againBtn').addEventListener('click', ()=>{
  cardOuter.classList.remove('show','reveal');
  card3d.classList.remove('flip');
  packWrap.style.display = 'flex';
  openBtn.disabled = false;
});

/* ---------- parallax / holo tilt ---------- */
card3d.addEventListener('mousemove', (e)=>{
  const rect = card3d.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const rx = (0.5 - y) * 18;
  const ry = (x - 0.5) * 18;
  card3d.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  holoSheen.style.opacity = 0.5;
  holoSheen.style.backgroundPosition = `${x*100}% ${y*100}%`;
});
card3d.addEventListener('mouseleave', ()=>{
  card3d.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  holoSheen.style.opacity = '';
});

init();
