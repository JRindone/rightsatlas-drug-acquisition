# Cohaddy Bio Specialty Platform

A mobile-first CEO workspace for Option 2: acquire a differentiated U.S. commercial asset and build a dedicated specialty team around a coherent multi-asset platform.

The funnel screens 1,605 products to 635 mechanism-classified products, 81 specialty candidates and 20 ranked targets. The searchable database is limited to those 81 specialty candidates. Target briefs emphasize strategic fit, rights holder, annual sales, call points, administration, team model and next diligence decisions.

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

The standard build targets the hosted application. The Pages build creates the static GitHub Pages artifact in `dist-pages/`.

## Deployment

Pushes to `main` automatically publish the static site through GitHub Pages.
