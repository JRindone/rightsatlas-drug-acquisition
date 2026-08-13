# Cohaddy Bio Asset Strategy

A mobile-first CEO workspace for evaluating two independent asset-acquisition strategies:

- Option 1 - Current platform: acquire into Cohaddy Bio's current cardiovascular, psychiatry and primary-care call points.
- Option 2 - New specialty platform: build a dedicated team around a coherent multi-asset platform.

The app includes 20 ranked targets for each option, 25 unique targets, four illustrative specialty-team models and a searchable 1,605-product universe. Target briefs emphasize strategic fit, rights holder, annual sales, call points, administration, team model and next diligence decisions.

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
