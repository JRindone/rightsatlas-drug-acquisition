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
  const [externalHtml, layout, app, strategyApp, diligence, commercialModels, router, catalog, dealBenchmarks] = await Promise.all([
    readFile(new URL("../external/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AssetScreenerApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AcquisitionApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/diligence.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/commercialModels.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/AppRouter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/data/catalog.json", import.meta.url), "utf8"),
    readFile(new URL("../public/data/deal-benchmarks.json", import.meta.url), "utf8"),
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
  assert.match(strategyApp, /Revenue uses reported facts/);
  assert.match(strategyApp, /Commercial model &amp; sources/);
  assert.equal((diligence.match(/^  "specialty-[^"]+": \{/gm) ?? []).length, 20);
  assert.match(diligence, /Public parent/);
  assert.match(diligence, /Private/);
  assert.match(diligence, /U\.S\. split not disclosed/);
  assert.match(diligence, /sec\.gov/);
  assert.equal((commercialModels.match(/^  (?:"[^"]+"|[A-Z0-9]+): \{$/gm) ?? []).length, 20);
  assert.match(commercialModels, /Specialty sales reps/);
  assert.match(commercialModels, /Priority geographies|geographies/);
  assert.match(strategyApp, /Modeled standalone U\.S\. team/);
  assert.match(strategyApp, /Observed evidence/);
  assert.match(strategyApp, /Estimation method/);
  assert.match(strategyApp, /U\.S\. specialty deal benchmarks/);
  assert.match(strategyApp, /Export.*rows/);
  assert.match(router, /tool.*asset-screener/);
  assert.match(router, /PreviousVersion/);
  assert.match(router, /Open US Specialty Asset Screener/);
  assert.match(catalog, /"strategyRecords":40/);
  assert.match(catalog, /Build a focused specialty franchise/);
  const deals = JSON.parse(dealBenchmarks);
  assert.equal(deals.deals.length, 34);
  assert.ok(deals.deals.every((deal) => deal.sourceUrl && deal.rightsScope && deal.insight));
  assert.ok(deals.deals.some((deal) => deal.structure === "Royalty monetization"));
  assert.ok(deals.deals.some((deal) => deal.status.includes("Terminated")));
});
