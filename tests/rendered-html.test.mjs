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

test("server-renders the RightsAtlas application shell and deal-focused metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>RightsAtlas \| Find the Next Drug Asset<\/title>/i);
  assert.match(html, /rights holder, annual sales, therapeutic fit/i);
  assert.match(html, /RightsAtlas/);
  assert.match(html, /OPENING DEAL WORKSPACE/);
  assert.match(html, /Assembling the asset opportunity set/);
});

test("keeps the two publishing targets aligned", async () => {
  const [externalHtml, layout, app] = await Promise.all([
    readFile(new URL("../external/index.html", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/AcquisitionApp.tsx", import.meta.url), "utf8"),
  ]);

  for (const source of [externalHtml, layout]) {
    assert.match(source, /RightsAtlas \| Find the Next Drug Asset/);
    assert.match(source, /rights holder, annual sales, therapeutic fit/i);
  }
  assert.match(app, /Find the next asset HLS can actually win/);
  assert.match(app, /U\.S\. rights holder/);
  assert.match(app, /Annual sales/);
  assert.match(app, /Therapeutic area/);
});
