# RightsAtlas

RightsAtlas is a mobile-first U.S. drug-product acquisition review workspace. It turns a public-source FDA and commercial-rights screen into a fast, traceable workflow for finding targets, comparing assets, recording diligence notes, and exporting working sets.

## What is included

- Search and filters across 1,605 screened products
- A 12-asset focused acquisition priority stack
- Regulatory, commercial-rights, mechanism, source, and diligence detail
- Side-by-side comparison for up to three products
- Device-local review status and analyst notes
- Shareable URL state and filtered CSV export
- Transparent scoring methodology and public-source registry

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
