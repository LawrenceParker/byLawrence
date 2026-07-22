/* ============================================================
   VCT PACKS — data loading, pack logic, persistence
   ============================================================ */

const CSV_PATH = 'players.csv';
const STORAGE_KEY = 'vctPacks.history.v1';

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

function tierFor(ovr){
  if(ovr>=95) return 'radiant';
  if(ovr>=85) return 'immortal';
  if(ovr>=75) return 'diamond';
  if(ovr>=65) return 'platinum';
  return 'gold';
}

function portraitSVG(role, accent){
  const shapes = {
    Duelist: `
      <polygon points="75,10 130,70 118,150 32,150 20,70" fill="url(#pg)" opacity="0.9"/>
      <polygon points="75,10 130,70 118,150 32,150 20,70" fill="none" stroke="${accent}" stroke-width="2"/>
      <circle cx="75" cy="60" r="20" fill="none" stroke="${accent}" stroke-width="2.5"/>
      <path d="M75 40 L75 80 M55 60 L95 60" stroke="${accent}" stroke-width="2"/>
    `,
    Initiator: `
      <circle cx="75" cy="80" r="65" fill="url(#pg)" opacity="0.9"/>
      <circle cx="75" cy="80" r="65" fill="none" stroke="${accent}" stroke-width="2"/>
      <circle cx="75" cy="80" r="34" fill="none" stroke="${accent}" stroke-width="2"/>
      <circle cx="75" cy="80" r="10" fill="${accent}" opacity="0.8"/>
    `,
    Controller: `
      <ellipse cx="75" cy="85" rx="62" ry="72" fill="url(#pg)" opacity="0.9"/>
      <ellipse cx="75" cy="85" rx="62" ry="72" fill="none" stroke="${accent}" stroke-width="2"/>
      <path d="M25 90 C45 60 105 60 125 90" stroke="${accent}" stroke-width="2.5" fill="none" opacity="0.85"/>
      <path d="M35 110 C52 90 98 90 115 110" stroke="${accent}" stroke-width="2" fill="none" opacity="0.6"/>
    `,
    Sentinel: `
      <polygon points="75,8 132,32 132,95 75,152 18,95 18,32" fill="url(#pg)" opacity="0.9"/>
      <polygon points="75,8 132,32 132,95 75,152 18,95 18,32" fill="none" stroke="${accent}" stroke-width="2"/>
      <path d="M75 40 V110 M45 62 H105" stroke="${accent}" stroke-width="2"/>
    `
  };
  return `<svg viewBox="0 0 150 165" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    ${shapes[role] || shapes.Duelist}
  </svg>`;
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
    atk: parseInt(r.attRTG, 10) || 0,
    def_: parseInt(r.defRTG, 10) || 0,
    ovr: parseInt(r.roleRTG, 10) || 0,
    roleIcon: r.RoleIcon || '',
    playerImage: r.PlayerImage || ''
  })).filter(p => p.name && p.role);
}

/* ---------- state ---------- */
let PLAYERS = [];
let history = loadHistory();

/* ---------- DOM refs ---------- */
const loadState = document.getElementById('loadState');
const errorState = document.getElementById('errorState');
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
  loadState.style.display = 'none';
  errorState.style.display = 'none';
  packWrap.style.display = 'flex';
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

/* ---------- image fallback helper ---------- */
function imgOrFallback(container, src, fallbackHTML, extraClass){
  if(src){
    const img = document.createElement('img');
    if(extraClass) img.className = extraClass;
    img.onerror = () => { container.innerHTML = fallbackHTML; };
    img.src = src;
    container.innerHTML = '';
    container.appendChild(img);
  } else {
    container.innerHTML = fallbackHTML;
  }
}

/* ---------- card rendering ---------- */
function pickPlayer(){
  return PLAYERS[Math.floor(Math.random() * PLAYERS.length)];
}

function renderCard(p){
  const tier = tierFor(p.ovr);
  const accent = TIER_COLOR[tier];

  card.setAttribute('data-tier', tier);
  document.getElementById('tierTag').textContent = TIER_LABEL[tier];
  document.getElementById('ovrNum').textContent = p.ovr;
  document.getElementById('roleFull').textContent = p.role;
  document.getElementById('pName').textContent = p.name;
  document.getElementById('pTeamLine').textContent = p.team || p.role;
  document.getElementById('atkVal').textContent = p.atk;
  document.getElementById('defVal').textContent = p.def_;

  const iconContainer = document.getElementById('roleIcon');
  iconContainer.style.color = accent;
  imgOrFallback(iconContainer, p.roleIcon, ROLE_ICONS[p.role] || '', null);

  const portraitContainer = document.getElementById('portrait');
  imgOrFallback(portraitContainer, p.playerImage, portraitSVG(p.role, accent), 'portrait-img');

  document.getElementById('pullCaption').textContent = `${p.name} — ${TIER_LABEL[tier]} ${p.role.toUpperCase()}`;

  return tier;
}

/* ---------- history + stats ---------- */
function addToHistory(p, tier){
  history.unshift({ p, tier, ts: Date.now() });
  if(history.length > 60) history.pop();
  saveHistory();
  renderHistory();
  renderStatsFromHistory();
}

function renderHistory(){
  if(!history.length){
    historyGrid.innerHTML = '<div class="empty-hist">No pulls yet — open a pack to start your collection.</div>';
    return;
  }
  historyGrid.innerHTML = history.map(h => `
    <div class="mini-card" data-tier="${h.tier}">
      <div class="m-ovr">${h.p.ovr}</div>
      <div class="m-name">${h.p.name}</div>
      <div class="m-role">${h.p.role}</div>
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
  if(!confirm('Clear your saved pull history? This cannot be undone.')) return;
  history = [];
  saveHistory();
  renderHistory();
  renderStatsFromHistory();
});

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
