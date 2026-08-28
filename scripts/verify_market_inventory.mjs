import JustLendAPI from "./justlend_api.mjs";

const ACTIVE = [
  "TRX", "USDD", "USDT", "wstUSDT", "sTRX", "SUN", "BTT", "NFT", "JST",
  "WIN", "HTX", "U", "USD1", "TUSD", "WBTC", "BTC", "ETH", "ETHB",
];
const LEGACY = ["USDDOLD", "USDJ", "WBTT", "BUSDOLD", "SUNOLD", "USDCOLD"];
const EXPECTED = [...ACTIVE, ...LEGACY];

const api = new JustLendAPI();
const markets = await api.getAllMarkets();
if (!Array.isArray(markets)) {
  throw new Error(`Market API did not return an array: ${JSON.stringify(markets)}`);
}

const actual = markets.map(({ symbol }) => symbol);
const missing = EXPECTED.filter((symbol) => !actual.includes(symbol));
const unexpected = actual.filter((symbol) => !EXPECTED.includes(symbol));
if (actual.length !== EXPECTED.length || missing.length || unexpected.length) {
  throw new Error(
    `Canonical market inventory drifted: expected ${EXPECTED.length}, received ${actual.length}; ` +
      `missing=${JSON.stringify(missing)} unexpected=${JSON.stringify(unexpected)}`,
  );
}

console.log(JSON.stringify({
  verifiedAt: new Date().toISOString(),
  source: "https://labc.ablesdxd.link/justlend/markets",
  total: actual.length,
  active: ACTIVE.length,
  legacy: LEGACY.length,
  includesJU: actual.includes("U"),
  symbols: actual,
}, null, 2));
