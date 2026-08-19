import assert from "node:assert/strict";
import test from "node:test";
import JustLendAPI from "../scripts/justlend_api.mjs";

test("API failures reject so the MCP layer can classify them", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("fetch failed");
  };

  try {
    const api = new JustLendAPI();
    await assert.rejects(api.getAllMarkets(), /fetch failed/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
