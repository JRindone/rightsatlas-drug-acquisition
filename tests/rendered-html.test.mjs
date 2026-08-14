import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the original specialty strategy shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cohaddy Bio \| Build a Specialty Team<\/title>/i);
  assert.match(html, /Cohaddy Bio/i);
  assert.match(html, /Preparing the strategy room/);
  assert.match(html, /Open US Specialty Asset Screener/);
});

test("keeps the two publishing targets aligned", async () => {
  const [externalHtml, layout, app, strategyApp, router, catalog] = await Promise.all([
    readFile(new URL("../external/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AssetScreenerApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AcquisitionApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AppRouter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/data/catalog.json", import.meta.url), "utf8"),
  ]);

  for (const source of [externalHtml, layout]) {
    assert.match(source, /Cohaddy Bio \| Build a Specialty Team/);
    assert.match(source, /rights holder, annual sales, call points/i);
  }
  assert.match(app, /US specialty markets/);
  assert.match(app, /Priority keywords/);
  assert.match(app, /Annual sales screen/);
  assert.match(app, /Ranking weights/);
  assert.match(app, /Export CSV/);
  assert.match(app, /Back to original version/);
  assert.doesNotMatch(app, /Cohaddy/i);
  assert.match(strategyApp, /Shared corporate infrastructure/);
  assert.match(strategyApp, /Platform coherence/);
  assert.match(strategyApp, /Calculated from/);
  assert.match(router, /tool.*asset-screener/);
  assert.match(router, /PreviousVersion/);
  assert.match(router, /Open US Specialty Asset Screener/);
  assert.match(catalog, /"strategyRecords":40/);
  assert.match(catalog, /Build a focused specialty franchise/);
});
