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
  offer: "fw_offer",
  collection: "fw_collection",
};

let STATE = {
  wheels: [],          // [{key,name,cost,color,tab,loot:[{id,name,rarity,value,weight,desc}]}]
  credits: 0,
  inventory: [],        // [{uid,name,rarity,value,wheelKey,wheelName,ts}]
  activeFilter: "all",
  offer: null,          // {scope:'rarity'|'wheel', target, bonusPct, expiresAt}
  spinning: false,
  catalog: [],           // every unique item across all wheels, built once wheels load
  collection: {},         // key -> snapshot of the item, permanent once discovered
  collectionFilter: "all",
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
/* function csvUrl(sheetId, tab) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
} */



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

async function fetchTabLocal(tab) {
  const res = await fetch(`./hw-csv/${tab}.csv`);
  if (!res.ok) throw new Error(`Failed to fetch local CSV "${tab}.csv"`);
  return parseCSV(await res.text());
}

async function loadWheelsFromLocal() {
  // Load Config.csv first
  const configRows = await fetchTabLocal(APP_CONFIG.CONFIG_TAB);
  if (!configRows.length) throw new Error("Config.csv is empty");

  const validRows = configRows.filter(row => row.tab);
  if (!validRows.length) throw new Error("No wheels found in Config.csv");

  // Load each wheel's CSV
  const wheels = await Promise.all(validRows.map(async row => {
    const tabName = row.tab;
    const lootRows = await fetchTabLocal(tabName);

    const loot = lootRows.map((r, i) => ({
      id: `${row.key}_${i}`,
      name: r.name || "Unknown Item",
      rarity: (r.rarity || "common").toLowerCase(),
      value: Number(r.value) || 0,
      weight: Number(r.weight) || 1,
      desc: r.desc || "",
      image: r.image || "",
    }));

    return {
      key: row.key || tabName.toLowerCase(),
      name: row.name || tabName,
      cost: Number(row.cost) || 0,
      color: row.color || "#ff6a33",
      tab: tabName,
      loot,
    };
  }));

  return wheels;
}

/* ---------------- persistence ---------------- */
function loadState() {
  const credits = localStorage.getItem(LS_KEYS.credits);
  STATE.credits = credits !== null ? Number(credits) : APP_CONFIG.STARTING_CREDITS;
  try { STATE.inventory = JSON.parse(localStorage.getItem(LS_KEYS.inventory)) || []; }
  catch { STATE.inventory = []; }
  try { STATE.offer = JSON.parse(localStorage.getItem(LS_KEYS.offer)) || null; }
  catch { STATE.offer = null; }
  try { STATE.collection = JSON.parse(localStorage.getItem(LS_KEYS.collection)) || {}; }
  catch { STATE.collection = {}; }
}
function saveCredits() { localStorage.setItem(LS_KEYS.credits, String(STATE.credits)); }
function saveInventory() { localStorage.setItem(LS_KEYS.inventory, JSON.stringify(STATE.inventory)); }
function saveOffer() { localStorage.setItem(LS_KEYS.offer, JSON.stringify(STATE.offer)); }
function saveCollection() { localStorage.setItem(LS_KEYS.collection, JSON.stringify(STATE.collection)); }

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
  ["wheels", "inventory", "shop", "collection"].forEach(v => {
    $(`#view-${v}`).classList.toggle("hidden", v !== view);
  });
  $all(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  if (view === "inventory") renderInventory();
  if (view === "shop") renderShop();
  if (view === "collection") renderCollection();
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
      renderInventory();
    });
  });
}

function currentBonusFor(item) {
  const offer = getLiveOffer();
  if (!offer) return 0;
  if (offer.scope === "rarity" && offer.target === item.rarity) return offer.bonusPct;
  if (offer.scope === "wheel" && offer.target === item.wheelKey) return offer.bonusPct;
  return 0;
}

function quickSellValue(item) {
  const bonus = currentBonusFor(item);
  const afterLoss = item.value * (1 - APP_CONFIG.QUICK_SELL_LOSS_PCT / 100);
  return Math.max(1, Math.round(afterLoss * (1 + bonus / 100)));
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
  const items = STATE.activeFilter === "all"
    ? STATE.inventory
    : STATE.inventory.filter(i => i.rarity === STATE.activeFilter);

  $("#invEmpty").hidden = STATE.inventory.length > 0;
  grid.innerHTML = "";
  items.forEach(item => grid.appendChild(buildItemCard(item)));
}

function buildItemCard(item) {
  const el = document.createElement("div");
  el.className = "item-card";
  el.style.setProperty("--rarity-color", rarityColorHex(item.rarity));
  const bonus = currentBonusFor(item);
  const quick = quickSellValue(item);
  el.innerHTML = `
    <div class="i-image"><img src="${imageFor(item)}" alt="" loading="lazy"></div>
    <span class="i-rarity">${item.rarity}</span>
    <div class="i-name">${escapeHtml(item.name)}</div>
    <div class="i-source">from ${escapeHtml(item.wheelName)}</div>
    <div class="i-base">Base ${item.value.toLocaleString()}${bonus ? `<span class="boost">+${bonus}% today</span>` : ""}</div>
    <div class="i-actions">
      <button class="quick-sell-btn">Quick Sell<span class="btn-sub">${quick.toLocaleString()} cr</span></button>
      <button class="auction-btn">Auction<span class="btn-sub">Gamble for more</span></button>
    </div>
  `;
  el.querySelector(".quick-sell-btn").addEventListener("click", () => quickSellItem(item.uid));
  el.querySelector(".auction-btn").addEventListener("click", () => openAuction(item.uid));
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
  const bonus = currentBonusFor(item);
  const payout = Math.max(1, Math.round(item.value * outcome.multiplier * (1 + bonus / 100)));

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

/* ---------------- shop / rotating offers ---------------- */
function pickNewOffer() {
  const scopeIsRarity = Math.random() < 0.6;
  const bonusPct = Math.round(
    APP_CONFIG.OFFER_BONUS_MIN + Math.random() * (APP_CONFIG.OFFER_BONUS_MAX - APP_CONFIG.OFFER_BONUS_MIN)
  );
  let scope, target, label;
  if (scopeIsRarity) {
    target = RARITY_ORDER[Math.floor(Math.random() * RARITY_ORDER.length)];
    scope = "rarity";
    label = `+${bonusPct}% payouts on ${target} items today`;
  } else {
    const w = STATE.wheels[Math.floor(Math.random() * STATE.wheels.length)];
    target = w.key; scope = "wheel";
    label = `+${bonusPct}% payouts on items from ${w.name} today`;
  }
  const durationMs = APP_CONFIG.OFFER_ROTATE_MINUTES * 60 * 1000;
  STATE.offer = { scope, target, bonusPct, label, expiresAt: Date.now() + durationMs, durationMs };
  saveOffer();
}

function getLiveOffer() {
  if (!STATE.offer) return null;
  if (Date.now() >= STATE.offer.expiresAt) return null;
  return STATE.offer;
}

function ensureOffer() {
  if (!getLiveOffer()) pickNewOffer();
}

function renderShop() {
  ensureOffer();
  const offer = STATE.offer;
  $("#offerText").textContent = offer.label;
  $("#offerDot").hidden = false;

  const grid = $("#shopGrid");
  $("#shopEmpty").hidden = STATE.inventory.length > 0;
  grid.innerHTML = "";
  STATE.inventory.forEach(item => grid.appendChild(buildItemCard(item)));
}

function tickOfferTimer() {
  const offer = STATE.offer;
  if (!offer) return;
  const remaining = Math.max(0, offer.expiresAt - Date.now());
  if (remaining <= 0) {
    pickNewOffer();
    renderShop();
    return;
  }
  const pct = (remaining / offer.durationMs) * 100;
  $("#offerTimerFill").style.width = `${pct}%`;
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000).toString().padStart(2, "0");
  $("#offerTimerLabel").textContent = `${mm}:${ss}`;
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
    const sheetWheels = await loadWheelsFromLocal();
    if (sheetWheels) {
      STATE.wheels = sheetWheels;
      status.hidden = true;
    } else {
      STATE.wheels = demoWheels();
      status.hidden = false;
      status.textContent = "Running on demo loot tables — add your Google Sheet ID in config.js to go live.";
    }
  } catch (err) {
    console.error(err);
    STATE.wheels = demoWheels();
    status.hidden = false;
    status.textContent = `Couldn't load your Google Sheet (${err.message}). Showing demo loot tables instead.`;
  }
  status.classList.remove("loading");

  buildCatalog();
  renderCollectionFilters();
  updateCollectionCount();

  renderWheelGrid();
  ensureOffer();
  setInterval(tickOfferTimer, 1000);
  tickOfferTimer();
}

boot();
