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
// of showing several thin/low-rated cards for one person, collapse them
// into a single "Flex" card. roleRTG is already weighted by rounds played
// per role, so a simple average across their roles is the fair aggregate
// (same logic applied to ATT/DEF).
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

const TIERS = {
  radiant:  { label:"Radiant",  color:"#f5f1d6", glow:"#f5f1d6",
              grad:"linear-gradient(120deg, #8c8a7a, #f5f1d6, #8c8a7a, #f5f1d6)",
              cardA:"#6b6a5f", cardB:"#d4cfb3" },
  immortal: { label:"Immortal", color:"#743465", glow:"#743465",
              grad:"linear-gradient(120deg, #3d1b34, #743465, #3d1b34, #743465)",
              cardA:"#2a1224", cardB:"#5c2a50" },
  ascendant:{ label:"Ascendant", color:"#1ca85f", glow:"#1ca85f",
              grad:"linear-gradient(120deg, #0e5c35, #1ca85f, #0e5c35, #1ca85f)",
              cardA:"#083a22", cardB:"#15804a" },
  diamond:  { label:"Diamond",  color:"#a771ed", glow:"#a771ed",
              grad:"linear-gradient(120deg, #5c3a86, #a771ed, #5c3a86, #a771ed)",
              cardA:"#3e275c", cardB:"#8257c0" },
  platinum: { label:"Platinum", color:"#36a0b3", glow:"#36a0b3",
              grad:"linear-gradient(120deg, #1c5560, #36a0b3, #1c5560, #36a0b3)",
              cardA:"#12363d", cardB:"#2a7f8e" },
  gold:     { label:"Gold",     color:"#e8c046", glow:"#e8c046",
              grad:"linear-gradient(120deg, #7a6724, #e8c046, #7a6724, #e8c046)",
              cardA:"#4d3f17", cardB:"#b89a38" }
};
const TIER_ORDER = ["gold","platinum","diamond","ascendant","immortal","radiant"];

/* =========================================================
   AVATAR / HEADSHOT HANDLING
   ========================================================= */
const AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></svg>`;

// Headshot PNGs are optional — drop files into a `headshots/` folder next to this
// HTML file. Since hosts like GitHub Pages are case-sensitive, each player is
// looked up two ways before giving up: a lowercased slug (e.g. "TenZ" ->
// headshots/tenz.png) and the exact in-game name as typed in the CSV (e.g.
// headshots/TenZ.png) - whichever one you actually saved the file as will be
// found. If neither exists, this falls back to a single shared silhouette
// image (headshots/silhouette.png), and if even that's missing, falls back
// to the built-in placeholder icon.
const SILHOUETTE_SRC = "headshots/silhouette.png";

function headshotSlug(player){
  return player.toLowerCase().replace(/[^a-z0-9]/g,'');
}
// strips characters that aren't valid in filenames, but keeps the original case
function headshotExactName(player){
  return player.replace(/[\/\\:*?"<>|]/g,'').trim();
}
function avatarCandidates(player){
  const lower = `headshots/${headshotSlug(player)}.png`;
  const exact = `headshots/${headshotExactName(player)}.png`;
  const list = [lower];
  if(exact !== lower) list.push(exact); // don't bother retrying an identical URL
  list.push(SILHOUETTE_SRC);
  return list;
}
function escapeAttr(str){
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
}
function avatarBlock(player){
  const candidates = avatarCandidates(player);
  return `<img src="${candidates[0]}" alt="${escapeAttr(player)}" loading="lazy"
      data-player="${escapeAttr(player)}" data-attempt="0" onerror="advanceAvatarSrc(this)">
    <span class="avatar-fallback">${AVATAR_SVG}</span>`;
}
function advanceAvatarSrc(img){
  const candidates = avatarCandidates(img.dataset.player);
  const attempt = parseInt(img.dataset.attempt, 10) + 1;
  if(attempt < candidates.length){
    img.dataset.attempt = attempt;
    img.src = candidates[attempt];
  } else {
    img.onerror = null;
    img.style.display = 'none';
    img.nextElementSibling.style.display = 'flex';
  }
}

/* =========================================================
   CARD MARKUP
   ========================================================= */
function cardMarkup(c, opts){
  opts = opts || {};
  const t = TIERS[c.tier];
  const isFlex = c.role === 'Flex';
  const roleLabel = isFlex ? 'FLEX' : c.role;
  const teamLine = isFlex && c.flexRoles ? `${c.team} · ${c.flexRoles.join('/')}` : c.team;
  return `
    <div class="pcard" data-tier="${c.tier}">
      <div class="pcard-inner">
        <div class="pcard-photo">
          ${avatarBlock(c.player)}
          <div class="pcard-rating" style="--rating-ring:${t.color}">${c.rtg}</div>
          <div class="pcard-tourtag">${c.tournament}</div>
          ${opts.badge ? `<div class="pcard-cornerbadge">${opts.badge}</div>` : ''}
        </div>
        <div class="pcard-plate">
          <div class="pcard-name">${c.player}</div>
          <div class="pcard-team" title="${teamLine}">${teamLine}</div>
          <div class="pcard-stats"><span>ATT<b>${c.att}</b></span><span>DEF<b>${c.def}</b></span></div>
          <div class="pcard-meta">
            <span class="tier-pill" style="color:${t.color}">● ${t.label}</span>
            <span class="role-pill">${roleLabel}</span>
          </div>
        </div>
      </div>
      <svg class="pcard-trace" viewBox="0 0 500 700" style="--trace-color:${t.color}" aria-hidden="true">
        <rect class="trace-blur" pathLength="100" x="5" y="5" width="490" height="690" rx="22"></rect>
        <rect class="trace-line" pathLength="100" x="5" y="5" width="490" height="690" rx="22"></rect>
      </svg>
    </div>`;
}

/* =========================================================
   COLLECTION - cards pulled from packs, persisted in localStorage.
   Stored as counts (not just a set) so duplicates show a ×N badge.
   ========================================================= */
const COLLECTION_KEY = "vct_vault_collection_v1";
let ownedCounts = {};

function loadCollection(){
  try{
    const raw = localStorage.getItem(COLLECTION_KEY);
    if(raw) ownedCounts = JSON.parse(raw) || {};
  }catch(e){
    ownedCounts = {};
  }
}
function saveCollection(){
  try{ localStorage.setItem(COLLECTION_KEY, JSON.stringify(ownedCounts)); }
  catch(e){ /* private browsing / storage unavailable - collection just won't persist */ }
}
function addToCollection(cardId){
  ownedCounts[cardId] = (ownedCounts[cardId] || 0) + 1;
}

/* =========================================================
   PACKS - free, unlimited, pulls from the entire card pool (no per-
   tournament packs, no weighting by rarity - every card is an equally
   likely pull). 5 cards per pack, revealed Night Market style: all 5 land
   face-down in a row and can be flipped individually, in any order.
   ========================================================= */
function pullPack(n){
  const pulled = [];
  for(let i=0; i<n; i++){
    pulled.push(CARDS[Math.floor(Math.random() * CARDS.length)]);
  }
  return pulled;
}

let currentPackCards = null;

function renderPacks(){
  document.getElementById('pageContent').innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Card Packs</div>
      <div class="page-title">OPEN A PACK</div>
      <div class="page-sub">Pull 5 random player cards from the full pool. Click each one to reveal it.</div>
    </div>
    <div id="packArea"></div>
  `;
  renderPackArea();
}

function renderPackArea(){
  const area = document.getElementById('packArea');

  if(!currentPackCards){
    area.innerHTML = `
      <div class="pack-intro">
        <div class="pack-tile" id="packTile">
          <div class="pack-tile-mark">VCT</div>
          <div class="pack-tile-sub">5-CARD PACK</div>
        </div>
        <button class="btn" id="openPackBtn">OPEN PACK</button>
      </div>
    `;
    document.getElementById('openPackBtn').addEventListener('click', ()=>{
      currentPackCards = pullPack(5);
      currentPackCards.forEach(c=> addToCollection(c.id));
      saveCollection();
      renderPackArea();
    });
    return;
  }

  const slotsHtml = currentPackCards.map((c,i)=>`
    <div class="market-slot">
      <div class="market-flip" data-idx="${i}">
        <div class="market-face market-back">
          <div class="market-back-mark">VCT</div>
          <div class="market-back-sub">TAP TO REVEAL</div>
        </div>
        <div class="market-face market-front">${cardMarkup(c)}</div>
      </div>
    </div>
  `).join('');

  area.innerHTML = `
    <div class="market-row">${slotsHtml}</div>
    <div class="market-actions">
      <button class="btn ghost" id="openAgainBtn">OPEN ANOTHER PACK</button>
    </div>
  `;

  document.querySelectorAll('.market-flip').forEach(el=>{
    el.addEventListener('click', ()=>{
      if(el.classList.contains('flipped')) return;
      el.classList.add('flipped');
    });
  });

  document.getElementById('openAgainBtn').addEventListener('click', ()=>{
    currentPackCards = null;
    renderPackArea();
  });

  initCardTilt();
}

/* =========================================================
   MY COLLECTION - only cards actually pulled from packs (rendered below
   via the shared renderCardBrowser, same filter system as All Cards)
   ========================================================= */
function cardById(id){ return CARDS.find(c=>c.id===id); }

/* =========================================================
   GALLERY - grouped by team (default, split further by tournament),
   or a flat list sorted by rating
   ========================================================= */
let filters = { tournament: 'all', team: 'all', role: 'all', search: '', mode: 'team' };
const ROLE_ORDER = ['Duelist', 'Initiator', 'Controller', 'Sentinel', 'Flex'];

function renderAllCards(){
  const totalPlayers = CARDS.length;
  const totalTeams = new Set(CARDS.map(c=>c.team)).size;
  const totalTournaments = new Set(CARDS.map(c=>c.tournament)).size;
  const pageHead = `
    <div class="page-head">
      <div class="eyebrow">Player Cards</div>
      <div class="page-title">THE VAULT</div>
      <div class="page-sub">Every player card across each tournament — grouped by team, or ranked by rating.</div>
      <div class="stats-strip">${totalPlayers} Players · ${totalTeams} Teams · ${totalTournaments} Tournament${totalTournaments>1?'s':''}</div>
    </div>`;
  renderCardBrowser(CARDS, filters, pageHead, renderAllCards);
}

let collectionFilters = { tournament:'all', team:'all', role:'all', search:'', mode:'team' };

function renderCollection(){
  const ownedIds = Object.keys(ownedCounts).filter(id => ownedCounts[id] > 0);
  const ownedCards = ownedIds.map(id => cardById(id)).filter(Boolean);

  if(ownedCards.length === 0){
    document.getElementById('pageContent').innerHTML = `
      <div class="page-head">
        <div class="eyebrow">Your Collection</div>
        <div class="page-title">MY COLLECTION</div>
        <div class="page-sub">Cards you pull from packs will show up here.</div>
      </div>
      <div class="empty-state"><div class="big">No cards yet</div>Open a pack to start your collection.</div>
    `;
    return;
  }

  const totalCopies = ownedIds.reduce((sum,id)=> sum + ownedCounts[id], 0);
  const pageHead = `
    <div class="page-head">
      <div class="eyebrow">Your Collection</div>
      <div class="page-title">MY COLLECTION</div>
      <div class="page-sub">Every card you've pulled from packs, grouped by team.</div>
      <div class="stats-strip">${ownedIds.length} Unique Cards · ${totalCopies} Total Pulls</div>
    </div>`;
  renderCardBrowser(ownedCards, collectionFilters, pageHead, renderCollection,
    c => ({ badge: ownedCounts[c.id] > 1 ? `×${ownedCounts[c.id]}` : null })
  );
}

// Shared by All Cards and My Collection - search, tournament/team/role
// filters, By Team / Top Rated modes, and the rarity breakdown. cardOptsFn
// is optional and lets a page pass per-card cardMarkup() options (My
// Collection uses it for the duplicate ×N badge).
function renderCardBrowser(cardPool, filterState, pageHeadHtml, rerenderFn, cardOptsFn){
  // preserve search box focus/cursor across the full re-render triggered by typing
  const prevSearchEl = document.getElementById('searchInput');
  const searchHadFocus = document.activeElement === prevSearchEl;
  const searchSelStart = searchHadFocus ? prevSearchEl.selectionStart : null;
  const searchSelEnd = searchHadFocus ? prevSearchEl.selectionEnd : null;

  // preserve first-seen order from the CSV for a stable, sensible tournament order
  const tournamentOrder = [...new Set(cardPool.map(c=>c.tournament))];
  const tourOptions = ['all', ...tournamentOrder].map(t=>
    `<option value="${t}" ${filterState.tournament===t?'selected':''}>${t==='all'?'All Events':t}</option>`
  ).join('');

  const teamOrder = [...new Set(cardPool.map(c=>c.team))].sort();
  const teamOptions = ['all', ...teamOrder].map(team=>
    `<option value="${team}" ${filterState.team===team?'selected':''}>${team==='all'?'All Teams':team}</option>`
  ).join('');

  const rolesPresent = [...new Set(cardPool.map(c=>c.role))];
  const roleOrder = [...ROLE_ORDER.filter(r=>rolesPresent.includes(r)), ...rolesPresent.filter(r=>!ROLE_ORDER.includes(r)).sort()];
  const roleOptions = ['all', ...roleOrder].map(role=>
    `<option value="${role}" ${filterState.role===role?'selected':''}>${role==='all'?'All Roles':role}</option>`
  ).join('');

  const searchTerm = filterState.search.trim().toLowerCase();
  const list = cardPool.filter(c =>
    (filterState.tournament==='all' || c.tournament===filterState.tournament) &&
    (filterState.team==='all' || c.team===filterState.team) &&
    (filterState.role==='all' || c.role===filterState.role) &&
    (searchTerm==='' || c.player.toLowerCase().includes(searchTerm) || c.team.toLowerCase().includes(searchTerm))
  );

  const renderCard = c => cardOptsFn ? cardMarkup(c, cardOptsFn(c)) : cardMarkup(c);

  // rarity breakdown of the current filtered set
  const rarityVizHtml = TIER_ORDER.map(tier=>{
    const count = list.filter(c=>c.tier===tier).length;
    return `<div class="rarity-pill"><span class="rarity-dot" style="background:${TIERS[tier].color}"></span>${TIERS[tier].label} <b>${count}</b></div>`;
  }).join('');

  let contentHtml;
  if(filterState.mode === 'rating'){
    const sorted = [...list].sort((a,b)=> b.rtg - a.rtg);
    contentHtml = `<div class="card-grid">${sorted.map(renderCard).join('')}</div>`;
  } else {
    const teams = [...new Set(list.map(c=>c.team))].sort();
    contentHtml = teams.map(team=>{
      const teamCards = list.filter(c=>c.team===team);
      const teamTournaments = tournamentOrder.filter(t => teamCards.some(c=>c.tournament===t));

      const tourGroupsHtml = teamTournaments.map(tour=>{
        const cards = teamCards.filter(c=>c.tournament===tour).sort((a,b)=> b.rtg - a.rtg);
        return `
          <div class="tour-group">
            <div class="tour-label">${tour}</div>
            <div class="card-grid">${cards.map(renderCard).join('')}</div>
          </div>`;
      }).join('');

      return `
        <div class="team-block">
          <div class="team-header">
            <div class="team-name">${team}</div>
            <div class="team-count">${teamCards.length} Player${teamCards.length>1?'s':''}</div>
          </div>
          ${tourGroupsHtml}
        </div>`;
    }).join('');
  }

  if(list.length === 0){
    contentHtml = `<div class="empty-state"><div class="big">No cards match this filter</div>Try a different search, event, team, or role.</div>`;
  }

  document.getElementById('pageContent').innerHTML = `
    ${pageHeadHtml}
    <div class="search-row">
      <input type="text" class="search-input" id="searchInput" placeholder="Search by player or team…" value="${filterState.search.replace(/"/g,'&quot;')}">
    </div>
    <div class="controlbar">
      <div class="filter-group">
        <select class="select-filter" id="tourFilter">${tourOptions}</select>
        <select class="select-filter" id="teamFilter">${teamOptions}</select>
        <select class="select-filter" id="roleFilter">${roleOptions}</select>
      </div>
      <div class="mode-toggle">
        <button class="chip ${filterState.mode==='team'?'active':''}" data-mode="team">By Team</button>
        <button class="chip ${filterState.mode==='rating'?'active':''}" data-mode="rating">Top Rated</button>
      </div>
    </div>
    <div class="rarity-viz">${rarityVizHtml}</div>
    ${contentHtml}
  `;

  const searchEl = document.getElementById('searchInput');
  searchEl.addEventListener('input', (e)=>{
    filterState.search = e.target.value;
    rerenderFn();
  });
  if(searchHadFocus){
    searchEl.focus();
    searchEl.setSelectionRange(searchSelStart, searchSelEnd);
  }

  document.getElementById('roleFilter').addEventListener('change', (e)=>{
    filterState.role = e.target.value;
    rerenderFn();
  });
  document.getElementById('tourFilter').addEventListener('change', (e)=>{
    filterState.tournament = e.target.value;
    rerenderFn();
  });
  document.getElementById('teamFilter').addEventListener('change', (e)=>{
    filterState.team = e.target.value;
    rerenderFn();
  });
  document.querySelectorAll('[data-mode]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ filterState.mode = btn.dataset.mode; rerenderFn(); });
  });

  initCardTilt();
}

/* =========================================================
   3D TILT + HOLOGRAPHIC FOIL (VanillaTilt) - re-run after every render()
   since the gallery innerHTML gets fully rebuilt on filter/mode changes.
   Degrades gracefully (cards just stay flat/static) if the CDN is blocked.
   ========================================================= */
function initCardTilt(){
  if(typeof VanillaTilt === 'undefined') return;
  const cards = document.querySelectorAll('.pcard');
  if(cards.length === 0) return;

  VanillaTilt.init(cards, {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.35,
    perspective: 900,
    scale: 1.02
  });

  cards.forEach(card=>{
    card.addEventListener('tiltChange', (e)=>{
      const { tiltX, tiltY } = e.detail;
      const x = 50 + tiltX * 2.2;
      const y = 50 + tiltY * 2.2;
      card.style.setProperty('--foil-shift', `${x}% ${y}%`);

      const intensity = Math.sqrt(tiltX*tiltX + tiltY*tiltY);
      const opacity = Math.min(intensity / 12, 1) * 0.35;
      card.style.setProperty('--foil-opacity', opacity.toFixed(3));
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

/* =========================================================
   PAGE ROUTER - three pages, sharing the same #pageContent mount point
   ========================================================= */
let currentPage = 'allcards';

function renderPage(){
  if(currentPage === 'allcards') renderAllCards();
  else if(currentPage === 'packs') renderPacks();
  else if(currentPage === 'collection') renderCollection();
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
    if(!dataReady) return; // ignore nav clicks before the CSV has loaded
    setPage(btn.dataset.page);
  });
});

function startApp(){
  dataReady = true;
  loadCollection();
  setPage('allcards');
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
