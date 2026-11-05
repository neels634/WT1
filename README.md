# Shet Samruddhi: clickable prototype

Front-end-only demo for the Seva Innovation Challenge jury round.
**Every number is sample data**, and nothing connects to a server.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/ (hash routing, relative paths: host anywhere)
```

## The 3-minute demo path

1. Welcome: pick Marathi or English, tap **Farmer**.
2. Home (Onion, Phaltan): tap **Where should I sell?**
3. Mandi Mitra: tap **Pune** to see its 7-day price line.
4. Tap **Compare**: 20 quintals, Tempo. Pune is best, +Rs 200 per quintal (Rs 4,000 on 20 q).
5. Read the advice, tap **Sell here**.
6. Pick a buyer or the village group, tap **Confirm sale**.
7. Menu (top right) → **Taluka officer**: the sale shows in the village table, Recent sales and the average gain.

**Reset demo** is on the Welcome screen and in the top-right menu. A page reload also resets everything.

## Where things live

| Path | What |
| --- | --- |
| `src/data/mock.ts` | All sample numbers (prices, history, buyers, villages, families) |
| `src/data/calc.ts` | Net price, gain, sell-or-hold rule, buyer offers |
| `src/i18n/en.ts`, `src/i18n/mr.ts` | All text. Marathi is a draft: have a Marathi speaker proofread it |
| `src/state/AppState.tsx` | Language, role, crop, compare inputs, the demo sale |
| `src/screens/` | One file per screen |
| `src/components/` | TopBar, BottomSheet, Toast, SampleBadge, buttons, icons |

Before the jury: replace the village names with your pilot villages, and verify the scheme text (marked "To be verified").
