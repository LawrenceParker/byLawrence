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
  return rows
    .filter(r => r.Player && r.Tournament && r.roleRTG !== undefined && r.roleRTG !== '')
    .map(rowToCard);
}

const TIERS = {

  radiant: {
    label:"Radiant",
    color:"#fff4c7",
    glow:"#fff4c7",

    grad:
      "conic-gradient(from 0deg, #ff3b6b, #ffb347, #fff06a, #54f5b0, #5adfff, #a978ff, #ff64d8, #ff3b6b)",

    cardA:"#302c20",
    cardB:"#777052"
  },

  immortal: {
    label:"Immortal",
    color:"#d66abb",
    glow:"#b4509b",

    grad:
      "linear-gradient(120deg, #2a1025, #743465, #d05ba9, #57224d, #2a1025)",

    cardA:"#241020",
    cardB:"#67305a"
  },

  ascendant: {
    label:"Ascendant",
    color:"#24c879",
    glow:"#1ca85f",

    grad:
      "linear-gradient(120deg, #064b2b, #1ca85f, #61e6a0, #0b6d3d, #064b2b)",

    cardA:"#073a23",
    cardB:"#16834e"
  },

  diamond: {
    label:"Diamond",
    color:"#b77cff",
    glow:"#a771ed",

    grad:
      "linear-gradient(120deg, #4b2874, #a771ed, #e0c5ff, #7346a8, #4b2874)",

    cardA:"#352050",
    cardB:"#8257c0"
  },

  platinum: {
    label:"Platinum",
    color:"#54c6d8",
    glow:"#36a0b3",

    grad:
      "linear-gradient(120deg, #174751, #36a0b3, #8ce0e8, #24727f, #174751)",

    cardA:"#12363d",
    cardB:"#2a7f8e"
  },

  gold: {
    label:"Gold",
    color:"#e8c046",
    glow:"#e8c046",

    grad:
      "linear-gradient(120deg, #66551d, #e8c046, #8d7528, #f4d56d, #66551d)",

    cardA:"#403517",
    cardB:"#a98932"
  }
};

const TIER_ORDER = [
  "gold",
  "platinum",
  "diamond",
  "ascendant",
  "immortal",
  "radiant"
];

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

function cardMarkup(c){
  const t = TIERS[c.tier];

  return `
    <div
      class="pcard"
      data-tier="${c.tier}"
      data-rating="${c.rtg}"
      style="--rarity-color:${t.color}; --rarity-glow:${t.glow}; background:${t.grad};"
    >

      <div class="pcard-inner">

        <div
          class="pcard-photo"
          style="background:linear-gradient(160deg, ${t.cardA}, ${t.cardB})"
        >

          ${avatarBlock(c.player)}

          <div class="pcard-rating">
            ${c.rtg}
          </div>

          <div class="pcard-tourtag">
            ${c.tournament}
          </div>

        </div>

        <div class="pcard-plate">

          <div class="pcard-name">
            ${c.player}
          </div>

          <div class="pcard-team">
            ${c.team}
          </div>

          <div class="pcard-meta">

            <span
              class="tier-pill"
              style="color:${t.color}"
            >
              ● ${t.label}
            </span>

            <span class="role-pill">
              ${c.role}
            </span>

          </div>

          <div class="pcard-stats">
            <span>
              ATT <b>${c.att}</b>
            </span>

            <span>
              DEF <b>${c.def}</b>
            </span>
          </div>

        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   GALLERY - grouped by team (default, split further by tournament),
   or a flat list sorted by rating
   ========================================================= */
let filters = { tournament: 'all', mode: 'team' };

function render(){
  // preserve first-seen order from the CSV for a stable, sensible tournament order
  const tournamentOrder = [...new Set(CARDS.map(c=>c.tournament))];
  const tourOptions = ['all', ...tournamentOrder].map(t=>
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
      const teamCards = list.filter(c=>c.team===team);
      const teamTournaments = tournamentOrder.filter(t => teamCards.some(c=>c.tournament===t));

      const tourGroupsHtml = teamTournaments.map(tour=>{
        const cards = teamCards.filter(c=>c.tournament===tour).sort((a,b)=> b.rtg - a.rtg);
        return `
          <div class="tour-group">
            <div class="tour-label">${tour}</div>
            <div class="card-grid">${cards.map(cardMarkup).join('')}</div>
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

  initCardTilt();
}

/* =========================================================
   3D TILT + RARITY FOIL
   ========================================================= */

function initCardTilt(){

  if(typeof VanillaTilt === 'undefined') return;

  const cards = document.querySelectorAll('.pcard');

  if(cards.length === 0) return;

  VanillaTilt.init(cards, {
    max: 12,
    speed: 350,
    glare: true,
    "max-glare": 0.28,
    perspective: 950,
    scale: 1.025
  });

  cards.forEach(card => {

    const tier = card.dataset.tier;

    const foilStrength = {
      gold:0.08,
      platinum:0.14,
      diamond:0.22,
      ascendant:0.28,
      immortal:0.34,
      radiant:0.48
    }[tier] || 0.1;

    card.addEventListener('tiltChange', event => {

      const {
        tiltX,
        tiltY
      } = event.detail;

      const x = 50 + tiltX * 3;
      const y = 50 + tiltY * 3;

      card.style.setProperty(
        '--foil-shift',
        `${x}% ${y}%`
      );

      const intensity =
        Math.sqrt(
          tiltX * tiltX +
          tiltY * tiltY
        );

      const opacity =
        Math.min(intensity / 12, 1) *
        foilStrength;

      card.style.setProperty(
        '--foil-opacity',
        opacity.toFixed(3)
      );

    });

    card.addEventListener('mouseleave', () => {

      card.style.setProperty(
        '--foil-shift',
        '50% 50%'
      );

      card.style.setProperty(
        '--foil-opacity',
        tier === 'radiant' ? '.22' : '0'
      );

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
