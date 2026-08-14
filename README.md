# Cohaddy Bio Specialty Platform

A mobile-first CEO workspace for acquiring a differentiated U.S. commercial asset and building a dedicated specialty team around a coherent multi-asset platform.

The original specialty strategy is the primary experience. A configurable screener for the full 1,605-product universe remains available at `?tool=asset-screener`.

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
