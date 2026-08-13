# RightsAtlas

RightsAtlas is a mobile-first deal workspace for finding and reviewing U.S. drug assets. It brings rights holders, annual sales, therapeutic fit, transaction signals, and next actions into one focused acquisition workflow.

## What is included

- Ranked deal flow with rights holder, annual sales, and therapeutic area upfront
- Search and commercial filters across 1,605 screened products
- A 12-asset acquisition shortlist with strategic fit and transaction signals
- Side-by-side comparison for up to three products
- Device-local deal status and working notes
- Shareable URL state and filtered CSV export
- A compact explanation of the acquisition criteria

## Data scope

The bundled snapshot includes 1,104 prescription NDA product families and 501 originator 351(a) biologics. It contains 81 public rights-rule matches, 635 curated mechanism/target matches, and nine recommended acquisition candidates.

This application is a screening aid, not a legal chain-of-title opinion, valuation, or substitute for contract, patent, exclusivity, supply, REMS, reimbursement, antitrust, or current commercial-availability diligence.

## Run locally

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

## Build targets

```bash
npm run build
npm run build:pages
```

The standard build targets the vinext/Cloudflare runtime. The Pages build creates the static GitHub Pages artifact in `dist-pages/`.

## Deployment

Pushes to `main` automatically build and deploy the static site through the GitHub Pages workflow in `.github/workflows/deploy-pages.yml`.
