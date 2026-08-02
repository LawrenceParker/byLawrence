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
  if(r>=75) return 'diamond';
  if(r>=60) return 'platinum';   
  return 'gold';
}

// Card id is built from its own fields (not row position) so IDs stay stable
// across CSV re-orders/edits - important since owned/discovered cards are
// referenced by id in saved progress.
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
}

const TIERS = {
  gold: { 
    label:"Gold", 
    color:"#edcc57", 
    glow:"#fff0a3", 
    weight:0.16,
    grad:"linear-gradient(120deg, #9e7a24, #edcc57, #fff0a3, #edcc57, #9e7a24)",
    cardA:"#403207", 
    cardB:"#d6ad3d" 
  },
   
  platinum: { 
    label:"Platinum", 
    color:"#3ca5b7", 
    glow:"#a8edf5", 
    weight:0.075,
    grad:"linear-gradient(120deg, #176070, #3ca5b7, #b9f5fa, #3ca5b7, #176070)",
    cardA:"#0d343b", 
    cardB:"#2f91a3" 
  },
   
  diamond: { 
    label:"Diamond", 
    color:"#a36ef1", 
    glow:"#e2ccff", 
    weight:0.075,
    grad:"linear-gradient(120deg, #542a9b, #a36ef1, #e2ccff, #a36ef1, #542a9b)",
    cardA:"#29154f", 
    cardB:"#8050c9" 
  },

  ascendant: { 
    label:"Ascendant", 
    color:"#21a163", 
    glow:"#8df0bb", 
    weight:0.075,
    grad:"linear-gradient(120deg, #12613c, #21a163, #9af5c3, #21a163, #12613c)",
    cardA:"#0b3824", 
    cardB:"#19834f" 
  },
   
  immortal: { 
    label:"Immortal", 
    color:"#8d1f44", 
    glow:"#e56a91", 
    weight:0.075,
    grad:"linear-gradient(120deg, #4d1029, #8d1f44, #f08aaa, #8d1f44, #4d1029)",
    cardA:"#310b1b", 
    cardB:"#741938" 
  },
  
  radiant: { 
    label:"Radiant", 
    color:"#f6efba", 
    glow:"#ffffff", 
    weight:0.025,
    grad:"linear-gradient(120deg, #d4c66f, #f6efba, #ffffff, #f6efba, #d4c66f)",
    cardA:"#3a3520", 
    cardB:"#e5d98c" 
  }
};

const TIER_ORDER = ["gold","platinum","diamond","ascendant", "immortal", "radiant"];

let RTG_MIN = 55, RTG_MAX = 99; // sane defaults, recalculated once CSV loads
function computeRtgRange(){
  RTG_MIN = Math.min(...CARDS.map(c=>c.rtg));
  RTG_MAX = Math.max(...CARDS.map(c=>c.rtg));
}

function sellPrice(rtg){
  const mult = 1 + ((rtg - RTG_MIN) / (RTG_MAX - RTG_MIN)) * 4; // 1x -> 5x
  return Math.round((150 * mult) / 5) * 5;
}

const PACKS = [
  {
    id:"stage1", tournament:"Stage 1", name:"STAGE 1 PACK", price:150, count:1,
    desc:"Stage 1..."
  },
  {
    id:"masters", tournament:"MASTERS LONDON", name:"MASTERS LONDON PACK", price:150, count:1,
    desc:"Masters London..."
  }
];

const STARTING_CREDITS = 5000;
const STORAGE_KEY = "vct_vault_state_v1";

/* =========================================================
   ICONS
   ========================================================= */
const ICONS = {
  Duelist: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6.5 17.5 17.5 6.5M14 4l6 6M4 14l6 6M9 15l-4.5 4.5M15 9l4.5-4.5"/></svg>`,
  Initiator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="10" stroke-dasharray="1 4"/></svg>`,
  Controller: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18c2-1 3-3 3-5s-1-3-1-5 2-4 5-4 5 2 5 4-1 3-1 5 1 4 3 5"/><path d="M2 19c3 1.5 6 2 10 2s7-.5 10-2"/></svg>`,
  Sentinel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/></svg>`
};
const AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></svg>`;
const BOX_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/></svg>`;
const COIN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.5 1.3-2 3-2s3 .8 3 2-1.3 1.7-3 2-3 .7-3 2 1.3 2 3 2 3-.5 3-2"/></svg>`;

function roleIcon(role){ return ICONS[role] || ICONS.Sentinel; }

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

// Shared card visual - used by Vault, My Collection, and the pack-reveal moment,
// so every place a card shows up looks identical.
function cardMarkup(c, opts){
  opts = opts || {};
  const t = TIERS[c.tier];

  if(opts.locked){
    return `
    <div class="pcard locked" style="background:${t.grad}">
      <div class="pcard-inner">
        <div class="pcard-photo" style="background:linear-gradient(160deg, ${t.cardA}, ${t.cardB})">
          <div class="pcard-lockmark">?</div>
          <div class="pcard-tourtag">${c.tournament}</div>
        </div>
        <div class="pcard-plate">
          <div class="pcard-name">LOCKED</div>
          <div class="pcard-team">${c.tournament}</div>
        </div>
      </div>
    </div>`;
  }

  return `
    <div class="pcard" style="background:${t.grad}">
      <div class="pcard-inner">
        <div class="pcard-photo" style="background:linear-gradient(160deg, ${t.cardA}, ${t.cardB})">
          ${avatarBlock(c.player)}
          <div class="pcard-rating">${c.rtg}</div>
          <div class="pcard-tourtag">${c.tournament}</div>
          ${opts.badge ? `<div class="pcard-cornerbadge">${opts.badge}</div>` : ''}
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

/* =========================================================
   STATE (persisted via localStorage — this page is meant to be self-hosted,
   e.g. on GitHub Pages, so we use standard browser storage, not the
   Claude.ai-artifact-only window.storage API)
   ========================================================= */
let state = { credits: STARTING_CREDITS, owned: [], discovered: [] };
let currentPage = "packs";
let uidCounter = 1;

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      state = JSON.parse(raw);
      uidCounter = (state.owned.reduce((m,o)=>Math.max(m, o.uid||0), 0)) + 1;
    }
  }catch(e){
    // no saved state yet, or storage unavailable (e.g. private browsing) — use defaults
  }
  render();
}

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){
    console.error("Could not save progress", e);
  }
}

/* =========================================================
   HELPERS
   ========================================================= */
function cardById(id){ return CARDS.find(c=>c.id===id); }

function weightedTierPick(pool){
  // filter tiers that actually have cards in this pool
  const available = TIER_ORDER.filter(t => pool.some(c=>c.tier===t));
  const totalW = available.reduce((s,t)=>s+TIERS[t].weight,0);
  let r = Math.random()*totalW;
  for(const t of available){
    r -= TIERS[t].weight;
    if(r<=0) return t;
  }
  return available[available.length-1];
}

function pullCard(tournament){
  const pool = CARDS.filter(c=>c.tournament===tournament);
  const tier = weightedTierPick(pool);
  const tierPool = pool.filter(c=>c.tier===tier);
  return tierPool[Math.floor(Math.random()*tierPool.length)];
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._h);
  toast._h = setTimeout(()=>t.classList.remove('show'), 2200);
}

function ownedCountFor(cardId){
  return state.owned.filter(o=>o.cardId===cardId).length;
}

/* =========================================================
   RENDER: SHELL
   ========================================================= */
function render(){
  document.getElementById('creditsDisplay').textContent = state.credits.toLocaleString();
  document.querySelectorAll('#nav button').forEach(b=>{
    b.classList.toggle('active', b.dataset.page===currentPage);
  });
  const root = document.getElementById('pageContent');
  if(currentPage==='vault') root.innerHTML = renderVault();
  if(currentPage==='packs') root.innerHTML = renderPacks();
  if(currentPage==='collection') root.innerHTML = renderCollection();
  if(currentPage==='inventory') root.innerHTML = renderInventory();
  attachPageHandlers();
}

document.getElementById('nav').addEventListener('click', (e)=>{
  if(!dataReady) return;
  const btn = e.target.closest('button[data-page]');
  if(!btn) return;
  currentPage = btn.dataset.page;
  collectionFilter = {tournament:'all', tier:'all'};
  vaultFilter = {tournament:'all', tier:'all', team:'all'};
  render();
});

/* =========================================================
   RENDER: PACKS PAGE
   ========================================================= */
function renderPacks(){
  const packCards = PACKS.map(p=>{
    const accent = p.id==='masters' ? 'var(--diamond)' : 'var(--red)';
    return `
    <div class="pack" data-pack="${p.id}" style="--accent:${accent}">
      <div class="pack-tour">${p.tournament}</div>
      <div class="pack-name">${p.name}</div>
      <div class="pack-art">
        <div class="glow"></div>
        ${BOX_SVG}
      </div>
      <div class="pack-desc">${p.desc}</div>
      <div class="pack-foot">
        <div class="pack-price">${p.price.toLocaleString()}<span>credits · ${p.count} card${p.count>1?'s':''}</span></div>
        <button class="btn open-btn" data-pack="${p.id}" ${state.credits<p.price?'disabled':''}>OPEN</button>
      </div>
    </div>`;
  }).join('');

  const oddsChips = TIER_ORDER.map(t=>`
    <div class="odds-chip"><span class="odds-dot" style="background:${TIERS[t].color}"></span><b>${TIERS[t].label}</b>&nbsp;${(TIERS[t].weight*100).toFixed(1)}%</div>
  `).join('');

  return `
    <div class="page-head">
      <div class="eyebrow">Pull Roster Cards</div>
      <div class="page-title">OPEN A PACK</div>
      <div class="page-sub">Spend credits to pull player cards from each tournament's field. Higher roleRTG cards are rarer — and worth more if you decide to sell them.</div>
    </div>
    <div class="pack-grid">${packCards}</div>
    <div class="odds-note">
      ${oddsChips}
    </div>
  `;
}

/* =========================================================
   RENDER: VAULT PAGE (browse every card, no packing required)
   ========================================================= */
let vaultFilter = { tournament:'all', tier:'all', team:'all' };

function renderVault(){
  const tournaments = ['all', ...new Set(CARDS.map(c=>c.tournament))];
  const tourChips = tournaments.map(t=>`
    <button class="chip ${vaultFilter.tournament===t?'active':''}" data-vtour="${t}">${t==='all'?'All Events':t}</button>
  `).join('');
  const tierChips = ['all', ...TIER_ORDER].map(t=>`
    <button class="chip ${vaultFilter.tier===t?'active':''}" data-vtier="${t}">${t==='all'?'All Rarities':TIERS[t].label}</button>
  `).join('');
  const teams = [...new Set(CARDS.map(c=>c.team))].sort();
  const teamOptions = ['all', ...teams].map(team=>
    `<option value="${team}" ${vaultFilter.team===team?'selected':''}>${team==='all'?'All Teams':team}</option>`
  ).join('');

  let list = CARDS.filter(c=>
    (vaultFilter.tournament==='all' || c.tournament===vaultFilter.tournament) &&
    (vaultFilter.tier==='all' || c.tier===vaultFilter.tier) &&
    (vaultFilter.team==='all' || c.team===vaultFilter.team)
  );
  list = [...list].sort((a,b)=> b.rtg - a.rtg);

  const cardsWithBadge = list.map(c=>{
    const isDiscovered = state.discovered.includes(c.id);
    return cardMarkup(c, { badge: isDiscovered ? 'OWNED' : null });
  }).join('');

  return `
    <div class="page-head">
      <div class="eyebrow">Full Card Database</div>
      <div class="page-title">THE VAULT</div>
      <div class="page-sub">Every card from every tournament, fully revealed — browse the entire set without spending credits on packs.</div>
    </div>
    <div class="filterbar">${tourChips}</div>
    <div class="filterbar">${tierChips}</div>
    <div class="filterbar">
      <select class="select-filter" id="vaultTeamFilter">${teamOptions}</select>
    </div>
    <div class="card-grid">${cardsWithBadge || `<div class="empty-state" style="grid-column:1/-1"><div class="big">No cards match this filter</div>Try a different rarity, event, or team.</div>`}</div>
  `;
}

/* =========================================================
   RENDER: COLLECTION PAGE
   ========================================================= */
let collectionFilter = { tournament:'all', tier:'all' };

function renderCollection(){
  const tournaments = ['all', ...new Set(CARDS.map(c=>c.tournament))];
  const tourChips = tournaments.map(t=>`
    <button class="chip ${collectionFilter.tournament===t?'active':''}" data-ctour="${t}">${t==='all'?'All Events':t}</button>
  `).join('');
  const tierChips = ['all', ...TIER_ORDER].map(t=>`
    <button class="chip ${collectionFilter.tier===t?'active':''}" data-ctier="${t}">${t==='all'?'All Rarities':TIERS[t].label}</button>
  `).join('');

  let list = CARDS.filter(c=>
    (collectionFilter.tournament==='all' || c.tournament===collectionFilter.tournament) &&
    (collectionFilter.tier==='all' || c.tier===collectionFilter.tier)
  );

  const discoveredCount = CARDS.filter(c=>state.discovered.includes(c.id)).length;

  const cards = list.map(c=>{
    const isDiscovered = state.discovered.includes(c.id);
    const qty = ownedCountFor(c.id);
    if(!isDiscovered){
      return cardMarkup(c, { locked:true });
    }
    return cardMarkup(c, { badge: qty>0 ? `×${qty}` : '0 held' });
  }).join('');

  return `
    <div class="page-head">
      <div class="eyebrow">Collection Book</div>
      <div class="page-title">YOUR ROSTER</div>
      <div class="page-sub">${discoveredCount} / ${CARDS.length} cards discovered across both tournaments. Cards stay in your collection book even after you sell them.</div>
    </div>
    <div class="filterbar">${tourChips}</div>
    <div class="filterbar">${tierChips}</div>
    <div class="card-grid">${cards || `<div class="empty-state" style="grid-column:1/-1"><div class="big">No cards match this filter</div>Try a different rarity or event.</div>`}</div>
  `;
}

/* =========================================================
   RENDER: INVENTORY PAGE
   ========================================================= */
function renderInventory(){
  const groups = {};
  state.owned.forEach(o=>{
    groups[o.cardId] = groups[o.cardId] || [];
    groups[o.cardId].push(o);
  });
  const cardIds = Object.keys(groups);

  if(cardIds.length===0){
    return `
      <div class="page-head">
        <div class="eyebrow">Sell Cards</div>
        <div class="page-title">INVENTORY</div>
        <div class="page-sub">Cards you currently hold. Sell any card for credits — value scales with roleRTG.</div>
      </div>
      <div class="empty-state"><div class="big">Your inventory is empty</div>Open a pack to start pulling cards.</div>
    `;
  }

  cardIds.sort((a,b)=> cardById(b).rtg - cardById(a).rtg);

  const rows = cardIds.map(id=>{
    const c = cardById(id);
    const qty = groups[id].length;
    const price = sellPrice(c.rtg);
    return `
      <div class="inv-row">
        <div class="inv-tier-bar" data-tier="${c.tier}"></div>
        <div class="inv-icon" style="color:${TIERS[c.tier].color}">${roleIcon(c.role)}</div>
        <div class="inv-info">
          <div class="inv-name">${c.player}</div>
          <div class="inv-meta">${c.team} · ${c.tournament} · ${TIERS[c.tier].label} · ATT ${c.att} / DEF ${c.def}</div>
        </div>
        <div class="inv-rtg" style="color:${TIERS[c.tier].color}">${c.rtg}</div>
        <div class="inv-qty">×${qty} held</div>
        <button class="inv-sell-btn" data-sell="${id}">SELL · ${price}</button>
      </div>
    `;
  }).join('');

  const totalValue = state.owned.reduce((sum,o)=> sum + sellPrice(cardById(o.cardId).rtg), 0);

  return `
    <div class="page-head">
      <div class="eyebrow">Sell Cards</div>
      <div class="page-title">INVENTORY</div>
      <div class="page-sub">${state.owned.length} cards held · est. sell value ${totalValue.toLocaleString()} credits. Base price is 150 credits, multiplied up to 5× by roleRTG.</div>
    </div>
    ${rows}
  `;
}

/* =========================================================
   PAGE HANDLERS
   ========================================================= */
function attachPageHandlers(){
  document.querySelectorAll('.open-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> startPackOpening(btn.dataset.pack));
  });
  document.querySelectorAll('[data-ctour]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ collectionFilter.tournament = btn.dataset.ctour; render(); });
  });
  document.querySelectorAll('[data-ctier]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ collectionFilter.tier = btn.dataset.ctier; render(); });
  });
  document.querySelectorAll('[data-vtour]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ vaultFilter.tournament = btn.dataset.vtour; render(); });
  });
  document.querySelectorAll('[data-vtier]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ vaultFilter.tier = btn.dataset.vtier; render(); });
  });
  const vaultTeamFilter = document.getElementById('vaultTeamFilter');
  if(vaultTeamFilter){
    vaultTeamFilter.addEventListener('change', (e)=>{ vaultFilter.team = e.target.value; render(); });
  }
  document.querySelectorAll('[data-sell]').forEach(btn=>{
    btn.addEventListener('click', ()=> sellOne(btn.dataset.sell));
  });
}

function sellOne(cardId){
  const idx = state.owned.findIndex(o=>o.cardId===cardId);
  if(idx===-1) return;
  const c = cardById(cardId);
  const price = sellPrice(c.rtg);
  state.owned.splice(idx,1);
  state.credits += price;
  saveState();
  toast(`Sold ${c.player} for ${price.toLocaleString()} credits`);
  render();
}

/* =========================================================
   PACK OPENING SEQUENCE
   ========================================================= */
let pendingPulls = [];
let activePack = null;

function startPackOpening(packId){
  const pack = PACKS.find(p=>p.id===packId);
  if(!pack || state.credits < pack.price) return;

  activePack = pack;
  state.credits -= pack.price;
  saveState();
  render();

  pendingPulls = [];
  for(let i=0;i<pack.count;i++) pendingPulls.push(pullCard(pack.tournament));

  const overlay = document.getElementById('overlay');
  overlay.classList.add('show');
  showSleeveStage();
}

function showSleeveStage(){
  const stage = document.getElementById('packStage');
  stage.innerHTML = `
    <div class="tour-tag">${activePack.tournament}</div>
    <div class="sleeve" id="sleeve">
      <div class="sleeve-inner">
        <div class="sleeve-mark">VCT<br>VAULT</div>
        <div class="sleeve-sub">${activePack.name}</div>
      </div>
    </div>
    <div class="tap-hint">OPENING…</div>
  `;
  setTimeout(openSleeve, 700);
}

function openSleeve(){
  const sleeve = document.getElementById('sleeve');
  sleeve.classList.add('shaking');
  setTimeout(()=>{
    sleeve.classList.remove('shaking');
    sleeve.classList.add('burst');
    document.getElementById('flash').classList.add('go');
    setTimeout(showRevealStage, 260);
    setTimeout(()=> document.getElementById('flash').classList.remove('go'), 400);
  }, 450);
}

function showRevealStage(){
  // commit pulls to state now
  pendingPulls.forEach(card=>{
    if(!state.discovered.includes(card.id)) state.discovered.push(card.id);
    state.owned.push({ uid: uidCounter++, cardId: card.id });
  });
  saveState();

  const stage = document.getElementById('packStage');
  const cardsHtml = pendingPulls.map((c,i)=>{
    return `
    <div class="reveal-card" data-idx="${i}" style="--tier-color:${TIERS[c.tier].color}">
      ${cardMarkup(c)}
    </div>`;
  }).join('');

  stage.innerHTML = `
    <div class="tour-tag">${activePack.name}</div>
    <div class="reveal-row">${cardsHtml}</div>
    <div class="reveal-footer">
      <div class="reveal-summary" id="revealSummary">${pendingPulls.length} card${pendingPulls.length>1?'s':''} added to your collection</div>
      <button class="btn ghost" id="collectBtn">CONTINUE</button>
    </div>
  `;

  // reveal happens right in the burst/flash beat - pop cards in immediately, no separate step
  document.querySelectorAll('.reveal-card').forEach(el=> el.classList.add('shown'));
  document.getElementById('collectBtn').addEventListener('click', closeOverlay);
}

function closeOverlay(){
  document.getElementById('overlay').classList.remove('show');
  render();
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
  computeRtgRange();
  loadState();
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
  document.getElementById('overlayClose')?.addEventListener('click', closeOverlay);
  initApp();
}catch(e){
  showCsvError(e.message || 'see browser console for details');
}
