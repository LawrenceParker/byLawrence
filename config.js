/*
  ================================
  FESTIVAL WHEELS — CONFIGURATION
  ================================

  1. Create a Google Sheet with 6 tabs (exact names matter, case-sensitive):

     "Config"   — one row per wheel, columns:
        key | name | cost | color | tab
        e.g:  bronze | Bronze Wheel | 100 | #8a93a3 | Bronze
              silver | Silver Wheel | 250 | #4ea1ff | Silver
              gold   | Gold Wheel   | 600 | #ffb800 | Gold
              ...

     One tab PER WHEEL (name must match the "tab" column above), columns:
        name | rarity | value | weight | desc
        e.g:  1965 Mustang Fastback | rare | 340 | 15 |
        - rarity: common / rare / epic / legendary (controls color)
        - value: credits earned when this item is sold
        - weight: relative odds of landing this segment (bigger = more common)

  2. Share the sheet: File > Share > "Anyone with the link" > Viewer.
     (Publishing to web also works and is more reliable for heavy traffic:
      File > Share > Publish to web > Entire document > CSV)

  3. Paste your Sheet ID below. It's the long string in the sheet's URL:
     https://docs.google.com/spreadsheets/d/  >>>THIS PART<<<  /edit

  If SHEET_ID is left blank, the site runs on built-in demo data so you can
  see everything working before you wire up your own sheet.
*/

const APP_CONFIG = {
  SHEET_ID: "1k1lzi3nX_1K9WbCpFoXx_IZeCA0fvqlf-NsO5MAa3Ic", // <-- paste your Google Sheet ID here
  CONFIG_TAB: "Config",

  // Starting credits for first-time visitors
  STARTING_CREDITS: 500,

  // How often the shop rotates its special offer, in minutes
  OFFER_ROTATE_MINUTES: 2,

  // Range of the bonus % the rotating offer can grant (applied to sell value)
  OFFER_BONUS_MIN: 10,
  OFFER_BONUS_MAX: 30,
};
