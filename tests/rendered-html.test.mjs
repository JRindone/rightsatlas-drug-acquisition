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

test("server-renders the Cohaddy Bio strategy shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Cohaddy Bio \| Asset Strategy<\/title>/i);
  assert.match(html, /two acquisition strategies/i);
  assert.match(html, /Cohaddy Bio/);
  assert.match(html, /Preparing the strategy room/);
});

test("keeps the two publishing targets aligned", async () => {
  const [externalHtml, layout, app, catalog] = await Promise.all([
    readFile(new URL("../external/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AcquisitionApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/data/catalog.json", import.meta.url), "utf8"),
  ]);

  for (const source of [externalHtml, layout]) {
    assert.match(source, /Cohaddy Bio \| Asset Strategy/);
    assert.match(source, /rights holder, annual sales, call points/i);
  }
  assert.match(app, /Current platform/);
  assert.match(app, /Prescribing info/);
  assert.match(catalog, /"strategyRecords":40/);
  assert.match(catalog, /Acquire into today’s call points/);
});
