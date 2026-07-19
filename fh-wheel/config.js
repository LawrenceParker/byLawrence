/*
  ================================
  FESTIVAL WHEELS — CONFIGURATION
  ================================

  Loot table data comes from one of two places, controlled by DATA_SOURCE
  below:

  "local" (default, fastest) — plain CSV files sitting next to wheel.html
  in a folder (LOCAL_DATA_DIR, default "data/"). No network fetch to any
  third party, so it loads almost instantly and works offline once the
  page itself is cached. This is what ships in the starter files.

    data/config.csv   — one row per wheel:
       key,name,cost,color,tab
       bronze,Bronze Wheel,100,#8a93a3,Bronze

    data/<tab>.csv     — one file per wheel (name must match the "tab"
                          column above exactly, case-sensitive), columns:
       name,rarity,value,weight,image,desc
       1965 Mustang Fastback,rare,340,15,,

    - rarity: common / rare / epic / legendary (controls color)
    - value: credits earned when this item is sold
    - weight: relative odds of landing this segment (bigger = more common)
    - image: optional direct image URL — leave blank for a placeholder
    - desc: optional, currently unused in the UI

    Editing these is just editing text files — commit the change and
    redeploy (or refresh, if you're serving locally). No sharing settings,
    no waiting on Google's servers.

    Note: fetching local files with `fetch()` requires the page to be
    served over http(s) — a real server (GitHub Pages counts) or a local
    dev server like `python3 -m http.server`. Double-clicking wheel.html
    to open it as a file:// URL will NOT work, the fetches get blocked.

  "sheet" — reads live from a Google Sheet instead, useful if you want to
  edit loot tables from anywhere without touching the repo. Slower to load
  since every tab is a separate request to Google's servers. Set:
       DATA_SOURCE: "sheet"
       SHEET_ID: "the long ID from your sheet's URL"
  and share the sheet as "Anyone with the link" → Viewer. Same
  Config-tab-plus-one-tab-per-wheel structure as the CSV files above.

  Leaving DATA_SOURCE unset/invalid, or leaving SHEET_ID blank while set
  to "sheet", falls back to small built-in demo data so the site still
  works out of the box.
*/

const APP_CONFIG = {
  DATA_SOURCE: "local", // "local" | "sheet"

  // Used when DATA_SOURCE is "local": folder path (relative to wheel.html)
  LOCAL_DATA_DIR: "data",

  // Used when DATA_SOURCE is "sheet"
  SHEET_ID: "",
  CONFIG_TAB: "Config",

  // Starting credits for first-time visitors
  STARTING_CREDITS: 50000,

  // Quick Sell: instant, guaranteed, but always at a loss off base value
  QUICK_SELL_LOSS_PCT: 15,

  // Auction: a weighted table of possible outcomes. Each item's final
  // payout = base value × a random multiplier between min/max of whichever
  // tier gets picked (weight = relative odds, same idea as loot weights).
  // Tune freely — add/remove tiers, adjust ranges, whatever you like.
  AUCTION_OUTCOMES: [
    { label: "Lowball bid", min: 0.5, max: 0.8, weight: 20 },
    { label: "Fair market price", min: 0.8, max: 1.2, weight: 40 },
    { label: "Strong bidding", min: 1.2, max: 1.8, weight: 25 },
    { label: "Bidding war!", min: 1.8, max: 2.8, weight: 10 },
    { label: "Jackpot buyer!", min: 3.0, max: 5.0, weight: 5 },
  ],
  // Jobs: a free way to earn credits over time if you run out. Each job
  // runs independently on its own timer — start it, wait, it pays out
  // automatically (even if you closed the tab while it was running).
  // duration is in seconds. Add, remove, or retune freely.
  JOBS: [
    { key: "wash", name: "Car Wash", desc: "Wash cars in the paddock.", duration: 30, payout: 2000 },
    { key: "tow", name: "Tow Truck Run", desc: "Recover stranded cars.", duration: 90, payout: 5000 },
    { key: "pit", name: "Pit Crew Shift", desc: "Work a full shift on the pit wall.", duration: 300, payout: 10000 },
    { key: "vip", name: "VIP Chauffeur", desc: "Drive festival VIPs between events.", duration: 900, payout: 25000 },
  ],
};
