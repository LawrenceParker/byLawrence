/* ============================================================
   FESTIVAL WHEELS — app.js
   Static, client-only. Reads live loot tables from Google Sheets
   (CSV export), falls back to demo data if no sheet is configured.
   ============================================================ */

window.addEventListener("error", (e) => {
  console.error("Festival Wheels error:", e.error || e.message);
  toastSafe(`Something broke: ${e.message}. Check the browser console for details.`);
});
function toastSafe(msg) {
  // toast() is defined further down; this wrapper lets the global error
  // handler above call it even if it fires before the rest of the file runs.
  try { toast(msg); } catch { alert(msg); }
}

const RARITY_COLOR = {
  common: "var(--common)",
  rare: "var(--rare)",
  epic: "var(--epic)",
  legendary: "var(--legendary)",
};
const RARITY_ORDER = ["common", "rare", "epic", "legendary"];

const LS_KEYS = {
  credits: "fw_credits",
  inventory: "fw_inventory",
  collection: "fw_collection",
  jobs: "fw_jobs",
};

let STATE = {
  wheels: [],          // [{key,name,cost,color,tab,loot:[{id,name,rarity,value,weight,desc}]}]
  credits: 0,
  inventory: [],        // [{uid,name,rarity,value,wheelKey,wheelName,ts}]
  activeFilter: "all",
  spinning: false,
  catalog: [],           // every unique item across all wheels, built once wheels load
  collection: {},         // key -> snapshot of the item, permanent once discovered
  collectionFilter: "all",
  jobs: {},              // job key -> startedAt timestamp, or absent/null if idle
  currentView: "wheels",
};

/* ---------------- demo fallback data ---------------- */
function demoWheels() {
  return [
    { key: "bronze", name: "Bronze Wheel", cost: 100, color: "#8a93a3", loot: [
      { id: "b1", name: "Rusty Pickup", rarity: "common", value: 60, weight: 40 },
      { id: "b2", name: "Compact Hatchback", rarity: "common", value: 90, weight: 35 },
      { id: "b3", name: "Sport Coupe '98", rarity: "rare", value: 220, weight: 20 },
      { id: "b4", name: "Vintage Roadster", rarity: "epic", value: 500, weight: 5 },
    ]},
    { key: "silver", name: "Silver Wheel", cost: 250, color: "#4ea1ff", loot: [
      { id: "s1", name: "Rally Hatch", rarity: "common", value: 140, weight: 35 },
      { id: "s2", name: "Turbo Coupe", rarity: "rare", value: 380, weight: 35 },
      { id: "s3", name: "Track Special", rarity: "rare", value: 420, weight: 20 },
      { id: "s4", name: "Widebody GT", rarity: "epic", value: 950, weight: 10 },
    ]},
    { key: "gold", name: "Gold Wheel", cost: 600, color: "#ffb800", loot: [
      { id: "g1", name: "Muscle Classic", rarity: "rare", value: 500, weight: 30 },
      { id: "g2", name: "Twin-Turbo GT", rarity: "epic", value: 1400, weight: 40 },
      { id: "g3", name: "Rally Legend", rarity: "epic", value: 1650, weight: 22 },
      { id: "g4", name: "Hypercar Prototype", rarity: "legendary", value: 4200, weight: 8 },
    ]},
    { key: "platinum", name: "Platinum Wheel", cost: 1200, color: "#b24eff", loot: [
      { id: "p1", name: "Track-Tuned GT", rarity: "epic", value: 1800, weight: 40 },
      { id: "p2", name: "Works Rally Car", rarity: "epic", value: 2100, weight: 32 },
      { id: "p3", name: "Le Mans Prototype", rarity: "legendary", value: 5200, weight: 20 },
      { id: "p4", name: "Festival One-Off", rarity: "legendary", value: 7800, weight: 8 },
    ]},
    { key: "diamond", name: "Diamond Wheel", cost: 2500, color: "#17e6c9", loot: [
      { id: "d1", name: "Hypercar Prototype", rarity: "legendary", value: 6000, weight: 40 },
      { id: "d2", name: "Bespoke Grand Tourer", rarity: "legendary", value: 8200, weight: 35 },
      { id: "d3", name: "Festival Icon Edition", rarity: "legendary", value: 15000, weight: 15 },
      { id: "d4", name: "One-of-One Concept", rarity: "legendary", value: 30000, weight: 10 },
    ]},
  ];
}

/* ---------------- CSV loading ---------------- */
function csvUrl(sheetId, tab) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
}

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ""; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && next === '\n') i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const headers = (rows.shift() || []).map(h => h.trim().toLowerCase());
  return rows.filter(r => r.some(v => v.trim() !== "")).map(r => {
    const obj = {};
    headers.forEach((h, idx) => obj[h] = (r[idx] ?? "").trim());
    return obj;
  });
}

// Fetches any CSV URL — a local file path or a remote one — and parses it.
async function fetchCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch "${url}" (${res.status})`);
  return parseCSV(await res.text());
}

async function fetchSheetTab(sheetId, tab) {
  return fetchCSV(csvUrl(sheetId, tab));
}

// Shared row -> data mapping, used by both the local-CSV and Google-Sheets loaders.
function mapLootRow(row, r, i) {
  return {
    id: `${row.key}_${i}`,
    name: r.name || "Unknown Item",
    rarity: (r.rarity || "common").toLowerCase(),
    value: Number(r.value) || 0,
    weight: Number(r.weight) || 1,
    desc: r.desc || "",
    image: r.image || "",
  };
}
function mapWheelDef(row, loot) {
  return {
    key: row.key || row.tab.toLowerCase(),
    name: row.name || row.tab,
    cost: Number(row.cost) || 0,
    color: row.color || "#ff6a33",
    tab: row.tab,
    loot,
  };
}

// Local CSV files — the default and fastest option. Reads config.csv plus
// one <tab>.csv per wheel from APP_CONFIG.LOCAL_DATA_DIR, all fetched in
// parallel. No network round-trip to Google, so this loads near-instantly.
async function loadWheelsFromLocalCSV() {
  const dir = (APP_CONFIG.LOCAL_DATA_DIR || "data").replace(/\/+$/, "");
  const configRows = await fetchCSV(`${dir}/config.csv`);
  if (!configRows.length) throw new Error(`${dir}/config.csv is empty`);

  const validRows = configRows.filter(row => row.tab);
  if (!validRows.length) throw new Error(`No wheels found in ${dir}/config.csv`);

  const wheels = await Promise.all(validRows.map(async row => {
    const lootRows = await fetchCSV(`${dir}/${row.tab}.csv`);
    return mapWheelDef(row, lootRows.map((r, i) => mapLootRow(row, r, i)));
  }));

  return wheels;
}

// Google Sheets — kept as an option if you'd rather edit loot tables from
// a spreadsheet than local files. Slower to load since every tab is a
// request to Google's servers, but editable from anywhere without touching
// the repo. Set DATA_SOURCE to "sheet" in config.js to use this instead.
async function loadWheelsFromSheet() {
  const sheetId = APP_CONFIG.SHEET_ID?.trim();
  if (!sheetId) return null;

  const configRows = await fetchSheetTab(sheetId, APP_CONFIG.CONFIG_TAB);
  if (!configRows.length) throw new Error("Config tab is empty");

  const validRows = configRows.filter(row => row.tab);
  if (!validRows.length) throw new Error("No wheels found in Config tab");

  // Fetch every wheel's loot table at the same time instead of waiting for
  // each one in turn — Promise.all still returns them in the original order.
  const wheels = await Promise.all(validRows.map(async row => {
    const lootRows = await fetchSheetTab(sheetId, row.tab);
    return mapWheelDef(row, lootRows.map((r, i) => mapLootRow(row, r, i)));
  }));

  return wheels;
}

/* ---------------- persistence ---------------- */
function loadState() {
  const credits = localStorage.getItem(LS_KEYS.credits);
  STATE.credits = credits !== null ? Number(credits) : APP_CONFIG.STARTING_CREDITS;
  try { STATE.inventory = JSON.parse(localStorage.getItem(LS_KEYS.inventory)) || []; }
  catch { STATE.inventory = []; }
  try { STATE.collection = JSON.parse(localStorage.getItem(LS_KEYS.collection)) || {}; }
  catch { STATE.collection = {}; }
  try { STATE.jobs = JSON.parse(localStorage.getItem(LS_KEYS.jobs)) || {}; }
  catch { STATE.jobs = {}; }
}
function saveCredits() { localStorage.setItem(LS_KEYS.credits, String(STATE.credits)); }
function saveInventory() { localStorage.setItem(LS_KEYS.inventory, JSON.stringify(STATE.inventory)); }
function saveCollection() { localStorage.setItem(LS_KEYS.collection, JSON.stringify(STATE.collection)); }
function saveJobs() { localStorage.setItem(LS_KEYS.jobs, JSON.stringify(STATE.jobs)); }

/* ---------------- UI helpers ---------------- */
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return Array.from(document.querySelectorAll(sel)); }

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._h);
  toast._h = setTimeout(() => { t.hidden = true; }, 2200);
}

function renderCredits() {
  $("#creditsValue").textContent = STATE.credits.toLocaleString();
}

function switchView(view) {
  STATE.currentView = view;
  ["wheels", "inventory", "shop", "collection", "jobs"].forEach(v => {
    $(`#view-${v}`).classList.toggle("hidden", v !== view);
  });
  $all(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  if (view === "inventory") renderInventory();
  if (view === "shop") renderShop();
  if (view === "collection") renderCollection();
  if (view === "jobs") renderJobs();
}

/* ---------------- wheel selection cards ---------------- */
function renderWheelSkeletons(n = 5) {
  const grid = $("#wheelGrid");
  grid.innerHTML = Array.from({ length: n })
    .map(() => `<div class="wheel-card skeleton"></div>`)
    .join("");
}

function renderWheelGrid() {
  const grid = $("#wheelGrid");
  grid.innerHTML = "";
  STATE.wheels.forEach(w => {
    const card = document.createElement("div");
    card.className = "wheel-card";
    card.style.setProperty("--tier-color", w.color);
    const affordable = STATE.credits >= w.cost;
    card.innerHTML = `
      <span class="tier-eyebrow">${w.loot.length} rewards</span>
      <h3>${escapeHtml(w.name)}</h3>
      <p class="wheel-desc">Odds favor ${topRarity(w.loot)} tier drops.</p>
      <div class="wheel-cost">
        <span class="cost-num">${w.cost.toLocaleString()}</span>
        <span class="cost-tag">CREDITS</span>
      </div>
      <button class="spin-btn" ${affordable ? "" : "disabled"}>${affordable ? "Spin" : "Not enough credits"}</button>
    `;
    card.querySelector(".spin-btn").addEventListener("click", () => openSpin(w));
    grid.appendChild(card);
  });
}

function topRarity(loot) {
  const rarities = new Set(loot.map(l => l.rarity));
  for (let i = RARITY_ORDER.length - 1; i >= 0; i--) {
    if (rarities.has(RARITY_ORDER[i])) return RARITY_ORDER[i];
  }
  return "common";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- spin overlay ---------------- */
let currentWheel = null;

function openSpin(wheel, autoSpin = true) {
  currentWheel = wheel;
  $("#spinWheelTitle").textContent = wheel.name;
  $("#spinResult").hidden = true;
  $("#spinOverlay").hidden = false;
  buildReelStrip(wheel, wheel.loot[0]); // idle preview before the real spin kicks off
  if (autoSpin) {
    // let the reel paint at rest for a beat before it whips into motion
    requestAnimationFrame(() => setTimeout(() => {
      try { doSpin(); } catch (err) { console.error(err); toast(`Spin failed: ${err.message}`); }
    }, 250));
  }
}

function closeSpinOverlay() {
  $("#spinOverlay").hidden = true;
  renderWheelGrid();
}

$("#closeSpin").addEventListener("click", closeSpinOverlay);
$("#doneSpinBtn").addEventListener("click", () => { closeSpinOverlay(); switchView("inventory"); });
$("#spinAgainBtn").addEventListener("click", () => openSpin(currentWheel, true));

const ITEM_H = 92;        // must match --item-h in style.css
const STRIP_FILLER = 28;  // rows of random filler above the winner, for spin length/feel

function buildSlotRow(item) {
  const row = document.createElement("div");
  row.className = "slot-item";
  row.style.setProperty("--rarity-color", rarityColorHex(item.rarity));
  row.innerHTML = `
    <img src="${imageFor(item)}" alt="" loading="lazy">
    <div class="slot-item-text">
      <span class="slot-item-rarity">${item.rarity}</span>
      <span class="slot-item-name">${escapeHtml(item.name)}</span>
    </div>
  `;
  return row;
}

// Builds the vertical reel strip: a run of random filler rows, then the
// winner, then one trailing filler row so the viewport has something to
// show below the winner once it's centered. Returns the winner's index.
function buildReelStrip(wheel, winner) {
  const strip = $("#slotStrip");
  strip.style.transition = "none";
  strip.style.transform = "translateY(0px)";
  strip.innerHTML = "";

  const items = [];
  for (let i = 0; i < STRIP_FILLER; i++) {
    items.push(wheel.loot[Math.floor(Math.random() * wheel.loot.length)]);
  }
  const winnerIndex = items.length;
  items.push(winner);
  items.push(wheel.loot[Math.floor(Math.random() * wheel.loot.length)]);

  items.forEach(item => strip.appendChild(buildSlotRow(item)));
  strip.offsetHeight; // reflow so the transition-reset above actually applies
  return winnerIndex;
}

function rarityColorHex(rarity) {
  const map = { common: "#8a93a3", rare: "#4ea1ff", epic: "#b24eff", legendary: "#ffb800" };
  return map[rarity] || map.common;
}

// Inline SVG car-silhouette placeholder, tinted per rarity, used whenever
// a loot item has no "image" URL set in the sheet.
const _fallbackCache = {};
function fallbackImage(rarity) {
  const color = rarityColorHex(rarity);
  if (_fallbackCache[color]) return _fallbackCache[color];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120">
      <rect width="200" height="120" fill="#11161f"/>
      <ellipse cx="100" cy="95" rx="80" ry="8" fill="#000" opacity=".35"/>
      <path d="M25 82 Q20 55 45 50 L60 32 Q70 24 85 24 L120 24 Q135 24 145 34 L158 50 Q182 54 178 82 Z"
            fill="${color}" opacity=".9"/>
      <rect x="70" y="34" width="55" height="20" rx="4" fill="#11161f" opacity=".55"/>
      <circle cx="58" cy="84" r="14" fill="#0b0e14"/>
      <circle cx="58" cy="84" r="6" fill="${color}"/>
      <circle cx="145" cy="84" r="14" fill="#0b0e14"/>
      <circle cx="145" cy="84" r="6" fill="${color}"/>
    </svg>`;
  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  _fallbackCache[color] = uri;
  return uri;
}

function imageFor(item) {
  return item.image && item.image.trim() ? item.image.trim() : fallbackImage(item.rarity);
}

function weightedPick(loot) {
  const total = loot.reduce((s, l) => s + l.weight, 0);
  let r = Math.random() * total;
  for (const item of loot) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return loot[loot.length - 1];
}

function doSpin() {
  if (STATE.spinning || !currentWheel) return;
  if (STATE.credits < currentWheel.cost) { toast("Not enough credits for this wheel."); return; }

  STATE.spinning = true;
  STATE.credits -= currentWheel.cost;
  saveCredits(); renderCredits();
  $("#spinResult").hidden = true;

  const wheel = currentWheel;
  const winner = weightedPick(wheel.loot);
  const winnerIndex = buildReelStrip(wheel, winner);

  const strip = $("#slotStrip");
  requestAnimationFrame(() => {
    strip.style.transition = "transform 4s cubic-bezier(.08,.82,.17,1)";
    const targetY = -(winnerIndex - 1) * ITEM_H; // lands the winner in the center row
    strip.style.transform = `translateY(${targetY}px)`;
  });

  setTimeout(() => {
    finishSpin(wheel, winner);
  }, 4300);
}

function finishSpin(wheel, item) {
  STATE.spinning = false;

  const uid = `inv_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  STATE.inventory.unshift({
    uid, name: item.name, rarity: item.rarity, value: item.value, image: item.image || "",
    wheelKey: wheel.key, wheelName: wheel.name, ts: Date.now(),
  });
  saveInventory();
  updateInvCount();

  const isNewDiscovery = recordDiscovery(item, wheel);

  const card = $("#resultCard");
  card.style.setProperty("--rarity-color", rarityColorHex(item.rarity));
  card.innerHTML = `
    ${isNewDiscovery ? `<span class="new-badge">NEW · Added to Collection Book</span>` : ""}
    <div class="r-image-wrap"><img src="${imageFor(item)}" alt="${escapeHtml(item.name)}"></div>
    <span class="r-rarity">${item.rarity}</span>
    <div class="r-name">${escapeHtml(item.name)}</div>
    <div class="r-value">Worth ${item.value.toLocaleString()} credits · from ${escapeHtml(wheel.name)}</div>
  `;
  $("#spinResult").hidden = false;
}

/* ---------------- inventory ---------------- */
function updateInvCount() {
  $("#invCount").textContent = STATE.inventory.length;
}

function renderRarityFilters() {
  const wrap = $("#rarityFilters");
  wrap.innerHTML = `<button class="chip active" data-rarity="all">All</button>` +
    RARITY_ORDER.map(r => `<button class="chip" data-rarity="${r}">${r}</button>`).join("");
  wrap.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      STATE.activeFilter = btn.dataset.rarity;
      wrap.querySelectorAll(".chip").forEach(b => b.classList.toggle("active", b === btn));
      renderShop();
    });
  });
}

function quickSellValue(item) {
  const afterLoss = item.value * (1 - APP_CONFIG.QUICK_SELL_LOSS_PCT / 100);
  return Math.max(1, Math.round(afterLoss));
}

function pickAuctionOutcome() {
  const tiers = APP_CONFIG.AUCTION_OUTCOMES;
  const total = tiers.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of tiers) {
    if (r < t.weight) return { label: t.label, multiplier: t.min + Math.random() * (t.max - t.min) };
    r -= t.weight;
  }
  const t = tiers[tiers.length - 1];
  return { label: t.label, multiplier: t.min };
}

function renderInventory() {
  const grid = $("#inventoryGrid");
  $("#invEmpty").hidden = STATE.inventory.length > 0;
  grid.innerHTML = "";
  STATE.inventory.forEach(item => grid.appendChild(buildItemCard(item, false)));
}

function buildItemCard(item, sellable) {
  const el = document.createElement("div");
  el.className = "item-card";
  el.style.setProperty("--rarity-color", rarityColorHex(item.rarity));
  const actionsHtml = sellable ? `
    <div class="i-actions">
      <button class="quick-sell-btn">Quick Sell<span class="btn-sub">${quickSellValue(item).toLocaleString()} cr</span></button>
      <button class="auction-btn">Auction<span class="btn-sub">Gamble for more</span></button>
    </div>` : "";
  el.innerHTML = `
    <div class="i-image"><img src="${imageFor(item)}" alt="" loading="lazy"></div>
    <span class="i-rarity">${item.rarity}</span>
    <div class="i-name">${escapeHtml(item.name)}</div>
    <div class="i-source">from ${escapeHtml(item.wheelName)}</div>
    <div class="i-base">Base value ${item.value.toLocaleString()}</div>
    ${actionsHtml}
  `;
  if (sellable) {
    el.querySelector(".quick-sell-btn").addEventListener("click", () => quickSellItem(item.uid));
    el.querySelector(".auction-btn").addEventListener("click", () => openAuction(item.uid));
  }
  return el;
}

function quickSellItem(uid) {
  const idx = STATE.inventory.findIndex(i => i.uid === uid);
  if (idx === -1) return;
  const item = STATE.inventory[idx];
  const gained = quickSellValue(item);
  STATE.credits += gained;
  STATE.inventory.splice(idx, 1);
  saveCredits(); saveInventory();
  renderCredits(); updateInvCount(); renderInventory(); renderShop(); renderWheelGrid();
  toast(`Quick sold ${item.name} for ${gained.toLocaleString()} credits`);
}

/* ---------------- auction flow ---------------- */
function openAuction(uid) {
  const idx = STATE.inventory.findIndex(i => i.uid === uid);
  if (idx === -1) return;
  const item = STATE.inventory[idx];

  // committed the moment the gavel starts — pull it from inventory now so
  // it can't be sold twice while the auction is "in progress"
  STATE.inventory.splice(idx, 1);
  saveInventory(); updateInvCount(); renderInventory(); renderShop(); renderWheelGrid();

  $("#auctionOverlay").hidden = false;
  $("#auctionResultWrap").hidden = true;
  $("#auctionPreview").innerHTML = `<img src="${imageFor(item)}" alt="${escapeHtml(item.name)}">`;

  const statusEl = $("#auctionStatus");
  const lines = ["Opening the floor…", "Going once…", "Going twice…"];
  let step = 0;
  statusEl.textContent = lines[0];
  const stepInterval = setInterval(() => {
    step++;
    if (step < lines.length) statusEl.textContent = lines[step];
  }, 650);

  setTimeout(() => {
    clearInterval(stepInterval);
    resolveAuction(item);
  }, 2300);
}

function resolveAuction(item) {
  const outcome = pickAuctionOutcome();
  const payout = Math.max(1, Math.round(item.value * outcome.multiplier));

  STATE.credits += payout;
  saveCredits(); renderCredits();

  $("#auctionStatus").textContent = "SOLD!";
  const gainPct = Math.round((outcome.multiplier - 1) * 100);
  const card = $("#auctionResultCard");
  card.style.setProperty("--rarity-color", rarityColorHex(item.rarity));
  card.innerHTML = `
    <span class="r-rarity">${outcome.label}</span>
    <div class="r-name">${escapeHtml(item.name)}</div>
    <div class="r-value">Sold for ${payout.toLocaleString()} credits (${gainPct >= 0 ? "+" : ""}${gainPct}% vs base ${item.value.toLocaleString()})</div>
  `;
  $("#auctionResultWrap").hidden = false;
  toast(`Auctioned ${item.name} for ${payout.toLocaleString()} credits`);
}

$("#closeAuction").addEventListener("click", () => { $("#auctionOverlay").hidden = true; });
$("#auctionDoneBtn").addEventListener("click", () => { $("#auctionOverlay").hidden = true; });

$("#sellAllBtn").addEventListener("click", () => {
  if (!STATE.inventory.length) { toast("Nothing to sell."); return; }
  const items = STATE.activeFilter === "all" ? [...STATE.inventory] : STATE.inventory.filter(i => i.rarity === STATE.activeFilter);
  if (!items.length) { toast("Nothing to sell in this filter."); return; }
  let total = 0;
  items.forEach(i => total += quickSellValue(i));
  const uids = new Set(items.map(i => i.uid));
  STATE.inventory = STATE.inventory.filter(i => !uids.has(i.uid));
  STATE.credits += total;
  saveCredits(); saveInventory();
  renderCredits(); updateInvCount(); renderInventory(); renderShop(); renderWheelGrid();
  toast(`Quick sold ${items.length} items for ${total.toLocaleString()} credits`);
});

/* ---------------- jobs ---------------- */
function startJob(key) {
  if (STATE.jobs[key]) return; // already running
  STATE.jobs[key] = Date.now();
  saveJobs();
  renderJobs();
  updateJobsBadge();
}

// Runs every tick (and once at boot). Awards credits for any job whose
// timer has elapsed — including one that finished while the tab was
// closed, since we compare against the stored start timestamp rather
// than counting down locally. Returns true if anything completed.
function checkJobCompletions() {
  let changed = false;
  APP_CONFIG.JOBS.forEach(job => {
    const startedAt = STATE.jobs[job.key];
    if (!startedAt) return;
    if (Date.now() - startedAt >= job.duration * 1000) {
      STATE.jobs[job.key] = null;
      STATE.credits += job.payout;
      changed = true;
      toast(`${job.name} complete — +${job.payout.toLocaleString()} credits`);
    }
  });
  if (changed) { saveCredits(); saveJobs(); renderCredits(); }
  return changed;
}

function updateJobsBadge() {
  const activeCount = APP_CONFIG.JOBS.filter(j => STATE.jobs[j.key]).length;
  const badge = $("#jobsActiveCount");
  badge.textContent = activeCount;
  badge.hidden = activeCount === 0;
}

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}

function buildJobCard(job) {
  const el = document.createElement("div");
  const startedAt = STATE.jobs[job.key];

  if (startedAt) {
    el.className = "job-card running";
    const elapsedMs = Date.now() - startedAt;
    const totalMs = job.duration * 1000;
    const pct = Math.min(100, (elapsedMs / totalMs) * 100);
    el.innerHTML = `
      <h3>${escapeHtml(job.name)}</h3>
      <p class="job-desc">${escapeHtml(job.desc)}</p>
      <div class="job-payout">+${job.payout.toLocaleString()} credits</div>
      <div class="job-progress">
        <div class="job-progress-track"><div class="job-progress-fill" style="width:${pct}%"></div></div>
        <span class="job-timer">${formatDuration(totalMs - elapsedMs)} remaining</span>
      </div>
    `;
  } else {
    el.className = "job-card";
    el.innerHTML = `
      <h3>${escapeHtml(job.name)}</h3>
      <p class="job-desc">${escapeHtml(job.desc)}</p>
      <div class="job-payout">+${job.payout.toLocaleString()} credits</div>
      <div class="job-meta">Takes ${formatDuration(job.duration * 1000)}</div>
      <button class="job-start-btn">Start Job</button>
    `;
    el.querySelector(".job-start-btn").addEventListener("click", () => startJob(job.key));
  }
  return el;
}

function renderJobs() {
  const grid = $("#jobsGrid");
  grid.innerHTML = "";
  APP_CONFIG.JOBS.forEach(job => grid.appendChild(buildJobCard(job)));
}

function tickJobs() {
  checkJobCompletions();
  updateJobsBadge();
  if (STATE.currentView === "jobs") renderJobs();
}

/* ---------------- collection book ---------------- */

// Items are matched into a single collection entry by name (trimmed,
// case-insensitive) — so the same car appearing in two different wheels
// counts as one collectible, not two.
function collectionKey(name) {
  return name.trim().toLowerCase();
}

// Builds the full catalog of every unique item across every wheel. Called
// once wheels are loaded/reloaded; drives the "locked" placeholders.
function buildCatalog() {
  const seen = new Map();
  STATE.wheels.forEach(wheel => {
    wheel.loot.forEach(item => {
      const key = collectionKey(item.name);
      if (!seen.has(key)) {
        seen.set(key, {
          key, name: item.name, rarity: item.rarity, value: item.value,
          image: item.image || "", wheelName: wheel.name, wheelKey: wheel.key,
        });
      }
    });
  });
  STATE.catalog = Array.from(seen.values());
}

// Records a permanent discovery the first time an item is won. Returns
// true if this was a brand-new entry (so the spin reveal can show a badge).
function recordDiscovery(item, wheel) {
  const key = collectionKey(item.name);
  if (STATE.collection[key]) return false;
  STATE.collection[key] = {
    name: item.name, rarity: item.rarity, value: item.value,
    image: item.image || "", wheelName: wheel.name, wheelKey: wheel.key,
    ts: Date.now(),
  };
  saveCollection();
  updateCollectionCount();
  return true;
}

function updateCollectionCount() {
  const owned = STATE.catalog.filter(c => STATE.collection[c.key]).length;
  $("#collectionCount").textContent = `${owned}/${STATE.catalog.length}`;
}

function renderCollectionFilters() {
  const wrap = $("#collectionFilters");
  const chips = [`<button class="chip active" data-wheel="all">All</button>`]
    .concat(STATE.wheels.map(w => `<button class="chip" data-wheel="${w.key}">${escapeHtml(w.name)}</button>`));
  wrap.innerHTML = chips.join("");
  wrap.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      STATE.collectionFilter = btn.dataset.wheel;
      wrap.querySelectorAll(".chip").forEach(b => b.classList.toggle("active", b === btn));
      renderCollection();
    });
  });
}

function buildCollectionCard(entry) {
  const owned = STATE.collection[entry.key];
  const el = document.createElement("div");
  el.className = "collection-card" + (owned ? "" : " locked");

  if (owned) {
    el.style.setProperty("--rarity-color", rarityColorHex(owned.rarity));
    el.innerHTML = `
      <div class="c-image"><img src="${imageFor(owned)}" alt="" loading="lazy"></div>
      <span class="c-rarity">${owned.rarity}</span>
      <div class="c-name">${escapeHtml(owned.name)}</div>
      <div class="c-source">from ${escapeHtml(owned.wheelName)}</div>
    `;
  } else {
    el.innerHTML = `
      <div class="c-image"><span>?</span></div>
      <span class="c-rarity">???</span>
      <div class="c-name">Undiscovered</div>
      <div class="c-source">from ${escapeHtml(entry.wheelName)}</div>
    `;
  }
  return el;
}

function renderCollection() {
  updateCollectionCount();
  const grid = $("#collectionGrid");
  const entries = STATE.collectionFilter === "all"
    ? STATE.catalog
    : STATE.catalog.filter(c => c.wheelKey === STATE.collectionFilter);

  grid.innerHTML = "";
  entries.forEach(entry => grid.appendChild(buildCollectionCard(entry)));

  const total = STATE.catalog.length;
  const owned = STATE.catalog.filter(c => STATE.collection[c.key]).length;
  $("#collectionProgressLabel").textContent = `${owned} / ${total} discovered`;
  $("#collectionProgressFill").style.width = total ? `${(owned / total) * 100}%` : "0%";
}

/* ---------------- auction house ---------------- */
function renderShop() {
  const grid = $("#shopGrid");
  const items = STATE.activeFilter === "all"
    ? STATE.inventory
    : STATE.inventory.filter(i => i.rarity === STATE.activeFilter);

  $("#shopEmpty").hidden = STATE.inventory.length > 0;
  grid.innerHTML = "";
  items.forEach(item => grid.appendChild(buildItemCard(item, true)));
}

/* ---------------- tabs ---------------- */
$all(".tab-btn").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.view)));

/* ---------------- boot ---------------- */
async function boot() {
  loadState();
  renderCredits();
  renderRarityFilters();
  updateInvCount();

  const status = $("#dataStatus");
  status.hidden = false;
  status.classList.add("loading");
  status.innerHTML = `<span class="spinner"></span> Loading loot tables…`;
  renderWheelSkeletons();

  try {
    let loadedWheels = null;
    if (APP_CONFIG.DATA_SOURCE === "local") {
      loadedWheels = await loadWheelsFromLocalCSV();
    } else if (APP_CONFIG.DATA_SOURCE === "sheet") {
      loadedWheels = await loadWheelsFromSheet();
    }
    if (loadedWheels) {
      STATE.wheels = loadedWheels;
      status.hidden = true;
    } else {
      STATE.wheels = demoWheels();
      status.hidden = false;
      status.textContent = "Running on demo loot tables — set DATA_SOURCE and the matching data in config.js to go live.";
    }
  } catch (err) {
    console.error(err);
    STATE.wheels = demoWheels();
    status.hidden = false;
    const sourceLabel = APP_CONFIG.DATA_SOURCE === "sheet" ? "your Google Sheet" : "your local CSV files";
    status.textContent = `Couldn't load ${sourceLabel} (${err.message}). Showing demo loot tables instead.`;
  }
  status.classList.remove("loading");

  buildCatalog();
  renderCollectionFilters();
  updateCollectionCount();

  checkJobCompletions(); // catch up on anything that finished while the tab was closed
  updateJobsBadge();
  setInterval(tickJobs, 1000);

  renderWheelGrid();

}

boot();
