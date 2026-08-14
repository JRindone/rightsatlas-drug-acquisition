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

test("server-renders the US specialty asset screener shell and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Asset Screener \| US Specialty Markets<\/title>/i);
  assert.match(html, /Define acquisition criteria/i);
  assert.match(html, /Loading asset universe/);
});

test("keeps the two publishing targets aligned", async () => {
  const [externalHtml, layout, app, router, catalog] = await Promise.all([
    readFile(new URL("../external/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AssetScreenerApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AppRouter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/data/catalog.json", import.meta.url), "utf8"),
  ]);

  for (const source of [externalHtml, layout]) {
    assert.match(source, /Asset Screener \| US Specialty Markets/);
    assert.match(source, /rank 1,605 U\.S\. commercial drug products/i);
  }
  assert.match(app, /US specialty markets/);
  assert.match(app, /Priority keywords/);
  assert.match(app, /Annual sales screen/);
  assert.match(app, /Ranking weights/);
  assert.match(app, /Export CSV/);
  assert.match(app, /Open previous version/);
  assert.doesNotMatch(app, /Cohaddy/i);
  assert.match(router, /version.*previous/);
  assert.match(router, /PreviousVersion/);
  assert.match(catalog, /"strategyRecords":40/);
  assert.match(catalog, /Build a focused specialty franchise/);
});
