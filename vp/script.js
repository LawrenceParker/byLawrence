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

/* fallback tier/rank badges — shown in the rank-icon slot unless a real
   images/ranks/<tier>.png is dropped in (see rankIconPath below) */
const TIER_RANK_ICONS = {
  gold: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L27 9V17C27 23 22 27.5 16 29C10 27.5 5 23 5 17V9L16 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M16 10L18.2 14.2L23 15L19.5 18.2L20.3 23L16 20.6L11.7 23L12.5 18.2L9 15L13.8 14.2L16 10Z" fill="currentColor"/>
  </svg>`,
  platinum: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L27 9V17C27 23 22 27.5 16 29C10 27.5 5 23 5 17V9L16 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M16 9L21 16L16 23L11 16L16 9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  </svg>`,
  diamond: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L27 9V17C27 23 22 27.5 16 29C10 27.5 5 23 5 17V9L16 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M11 12H21L24 16L16 24L8 16L11 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M8 16H24M13 12L16 24M19 12L16 24" stroke="currentColor" stroke-width="1.3"/>
  </svg>`,
  immortal: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L27 9V17C27 23 22 27.5 16 29C10 27.5 5 23 5 17V9L16 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M16 8L20 16L16 24L12 16L16 8Z" fill="currentColor"/>
    <path d="M8 16L24 16" stroke="currentColor" stroke-width="1.6"/>
  </svg>`,
  radiant: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L27 9V17C27 23 22 27.5 16 29C10 27.5 5 23 5 17V9L16 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M16 8L18 14L24 16L18 18L16 24L14 18L8 16L14 14L16 8Z" fill="currentColor"/>
  </svg>`
};

function rankIconPath(tier){
  return `images/ranks/${tier}.png`;
}

/* fallback "character" silhouette for the centre art slot, tuned for the
   card's light photo backdrop — dark navy shape with a thin accent outline */
function centreFallbackSVG(role, accent){
  const shapes = {
    Duelist: `
      <polygon points="90,14 155,84 140,180 40,180 25,84" fill="#10151d" opacity="0.94"/>
      <polygon points="90,14 155,84 140,180 40,180 25,84" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="90" cy="70" r="24" fill="none" stroke="${accent}" stroke-width="3"/>
      <path d="M90 46 L90 94 M66 70 L114 70" stroke="${accent}" stroke-width="2.5"/>
    `,
    Initiator: `
      <circle cx="90" cy="96" r="78" fill="#10151d" opacity="0.94"/>
      <circle cx="90" cy="96" r="78" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="90" cy="96" r="40" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="90" cy="96" r="12" fill="${accent}"/>
    `,
    Controller: `
      <ellipse cx="90" cy="100" rx="74" ry="86" fill="#10151d" opacity="0.94"/>
      <ellipse cx="90" cy="100" rx="74" ry="86" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <path d="M30 108 C54 72 126 72 150 108" stroke="${accent}" stroke-width="3" fill="none" opacity="0.9"/>
      <path d="M42 132 C62 108 118 108 138 132" stroke="${accent}" stroke-width="2.5" fill="none" opacity="0.65"/>
    `,
    Sentinel: `
      <polygon points="90,10 158,38 158,114 90,182 22,114 22,38" fill="#10151d" opacity="0.94"/>
      <polygon points="90,10 158,38 158,114 90,182 22,114 22,38" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <path d="M90 48 V132 M54 74 H126" stroke="${accent}" stroke-width="2.5"/>
    `
  };
  return `<svg viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg">
    ${shapes[role] || shapes.Duelist}
  </svg>`;
}

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
    role: r.Role,
    team: r.Team || '',
    tournament: r.Tournament || 'Set 1',
    atk: parseInt(r.attRTG, 10) || 0,
    def_: parseInt(r.defRTG, 10) || 0,
    ovr: parseInt(r.roleRTG, 10) || 0,
    roleIcon: r.RoleIcon || '',
    centreImage: r.CentreImage || ''
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
  const accent = TIER_COLOR[tier];

  card.setAttribute('data-tier', tier);
  document.getElementById('roleName').textContent = p.role;
  document.getElementById('playerName').textContent = p.name;
  document.getElementById('teamName').textContent = p.team || '';
  document.getElementById('attRating').textContent = p.atk;
  document.getElementById('defRating').textContent = p.def_;
  document.getElementById('roleRating').textContent = p.ovr;

  const rankContainer = document.getElementById('rankIcon');
  imgOrFallback(rankContainer, rankIconPath(tier), TIER_RANK_ICONS[tier] || '');

  const roleContainer = document.getElementById('roleIcon');
  imgOrFallback(roleContainer, p.roleIcon, ROLE_ICONS[p.role] || '');

  const centreContainer = document.getElementById('centreImage');
  imgOrFallback(centreContainer, p.centreImage, centreFallbackSVG(p.role, accent));

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
      <div class="player-card" data-tier="${tier}">
        <div class="card-bg-pattern"></div>
        <div class="holo-sheen"></div>
        <div class="rank-icon" data-rank-index="${index}"></div>
        <div class="role-icon" data-role-index="${index}"></div>
        <div class="centre-image" data-centre-index="${index}"></div>
        <div class="card-info">
          <div class="role-name">${escapeHtml(p.role)}</div>
          <div class="player-name">${escapeHtml(p.name)}</div>
          <div class="team-name">${escapeHtml(p.team || '')}</div>
          <div class="ratings">
            <div class="rating">
              <span class="rating-label">ATT RTG</span>
              <span class="rating-value">${p.atk}</span>
            </div>
            <div class="rating center">
              <span class="rating-label">ROLE RTG</span>
              <span class="rating-value">${p.ovr}</span>
            </div>
            <div class="rating">
              <span class="rating-label">DEF RTG</span>
              <span class="rating-value">${p.def_}</span>
            </div>
          </div>
        </div>
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

  // players that are owned and need their icons/art filled in after insertion
  // (avoids embedding raw SVG markup inside HTML attributes)
  const ownedQueue = [];

  collectionGroups.innerHTML = TOURNAMENTS.map(t => {
    const rows = PLAYERS.filter(p => p.tournament === t);
    const ownedInGroup = rows.filter(p => owned.has(playerKey(p))).length;
    const cardsHtml = rows.map(p => {
      const key = playerKey(p);
      if(owned.has(key)){
        const idx = ownedQueue.length;
        ownedQueue.push(p);
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

  collectionGroups.querySelectorAll('.rank-icon[data-rank-index]').forEach(container => {
    const idx = parseInt(container.getAttribute('data-rank-index'), 10);
    const p = ownedQueue[idx];
    if(!p) return;
    const tier = tierFor(p.ovr);
    imgOrFallback(container, rankIconPath(tier), TIER_RANK_ICONS[tier] || '');
  });

  collectionGroups.querySelectorAll('.role-icon[data-role-index]').forEach(container => {
    const idx = parseInt(container.getAttribute('data-role-index'), 10);
    const p = ownedQueue[idx];
    if(!p) return;
    imgOrFallback(container, p.roleIcon, ROLE_ICONS[p.role] || '');
  });

  collectionGroups.querySelectorAll('.centre-image[data-centre-index]').forEach(container => {
    const idx = parseInt(container.getAttribute('data-centre-index'), 10);
    const p = ownedQueue[idx];
    if(!p) return;
    const tier = tierFor(p.ovr);
    imgOrFallback(container, p.centreImage, centreFallbackSVG(p.role, TIER_COLOR[tier]));
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
