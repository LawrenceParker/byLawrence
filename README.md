# Festival Wheels

A Forza Horizon–style prize wheel site: spin one of five wheels for a chance
at loot, stash it in your inventory, then sell items in the shop for credits
to spin again. Pure HTML/CSS/JS — no backend, no build step, works as-is on
GitHub Pages.

## Files

- `wheel.html` — page structure (rename it back to `index.html` if this is
  the only page on the site — otherwise drop it alongside your existing
  `index.html` and link to it, see below)
- `style.css` — all styling (festival/asphalt theme, rarity colors, wheel dial)
- `config.js` — **the only file you need to edit** to plug in your Google Sheet
- `app.js` — all app logic (sheet loading, spinning, inventory, shop offers)

## 1. Try it first

Open `wheel.html` in a browser (or push the folder to GitHub Pages) — it runs
on built-in demo loot tables out of the box, so you can see everything working
before touching Google Sheets.

## Linking from your existing index.html

Drop all four files (`wheel.html`, `style.css`, `config.js`, `app.js`) into
your repo — in their own subfolder if you want, e.g. `/wheels/` — and link to
it from your existing site:

```html
<a href="wheel.html">Spin the wheel</a>
```

(adjust the path if you put it in a subfolder, e.g. `/wheels/wheel.html`)

## 2. Set up your Google Sheet

Create a new Google Sheet with these tabs (tab names are case-sensitive):

**`Config`** — one row per wheel:

| key    | name         | cost | color   | tab    |
|--------|--------------|------|---------|--------|
| bronze | Bronze Wheel | 100  | #8a93a3 | Bronze |
| silver | Silver Wheel | 250  | #4ea1ff | Silver |
| gold   | Gold Wheel   | 600  | #ffb800 | Gold   |
| platinum | Platinum Wheel | 1200 | #b24eff | Platinum |
| diamond | Diamond Wheel | 2500 | #17e6c9 | Diamond |

- `cost` — credits required to spin that wheel
- `color` — hex color used as that wheel's accent
- `tab` — the name of the sheet tab holding that wheel's loot table

**One tab per wheel** (matching the `tab` column above), each with columns:

| name              | rarity    | value | weight | image | desc |
|-------------------|-----------|-------|--------|-------|------|
| 1965 Mustang Fastback | rare  | 340   | 15     | https://example.com/mustang.jpg |    |
| Rusty Pickup      | common    | 60    | 40     |       |      |

- `rarity` — `common`, `rare`, `epic`, or `legendary` (controls color)
- `value` — credits earned when the item is sold
- `weight` — relative odds of landing that segment (bigger number = more likely; weights don't need to sum to 100, they're normalized automatically)
- `image` — optional direct URL to an image (car photo, render, etc). Shown on
  the wheel segment, the big win reveal, and inventory/shop cards. Leave blank
  and a tinted placeholder silhouette is used instead, so the game still looks
  right before you've sourced real images.
- `desc` — optional, not currently shown in the UI but reserved for future use

Add as many rows/items as you like to each wheel — the wheel dial resizes
segments automatically based on weight. Note: the image URL needs to be
publicly reachable and allow being embedded (most direct image links work;
Google Drive "preview" links generally do not).

## 3. Share the sheet

File → Share → **"Anyone with the link" → Viewer** is enough. If you get
loading errors on GitHub Pages, use File → Share → **Publish to web** →
Entire document → CSV instead, which is more reliable for public traffic.

## 4. Plug in the Sheet ID

Open `config.js` and paste your Sheet ID (the long string in the sheet's URL
between `/d/` and `/edit`):

```js
const APP_CONFIG = {
  SHEET_ID: "1AbCдефgh...your-id-here",
  ...
};
```

Reload the page — it now pulls your live loot tables. Editing the sheet
updates the game the next time a visitor loads the page (no redeploy needed).

## 5. Tune the shop offers

Still in `config.js`:

```js
OFFER_ROTATE_MINUTES: 3,   // how often the special offer rotates
OFFER_BONUS_MIN: 10,       // minimum bonus %
OFFER_BONUS_MAX: 30,       // maximum bonus %
```

Each rotation randomly targets either a rarity tier or a specific wheel's
items and grants a bonus % on top of an item's base sell value while it's
live. A countdown bar in the Shop tab shows time remaining.

## 6. Deploy to GitHub Pages

Push this folder to a repo, then in the repo's Settings → Pages, set the
source to that branch/folder. No build step required.

## Notes on persistence

Credits and inventory are stored in the visitor's browser via `localStorage`
— there's no shared server-side database, so progress is per-device/browser
and resets if they clear site data. First-time visitors start with
`STARTING_CREDITS` (set in `config.js`, default 500).
