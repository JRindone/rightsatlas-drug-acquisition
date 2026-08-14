# US Specialty Asset Screener

A mobile-first business tool for screening the U.S. specialty-product universe. Users define hard filters and ranking weights, review business-oriented product records, build a device-local shortlist and export results.

The searchable universe contains 1,605 commercial products. The previous specialty strategy experience remains available at `?version=previous`.

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
