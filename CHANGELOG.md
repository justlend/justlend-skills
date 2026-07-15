# Changelog

All notable changes to `justlend-skills`. Format based on Keep a Changelog.
`SPDX-License-Identifier: MIT`. Exact publish timestamps: see `skills/_meta.json`.

## [1.1.0]

### Added
- **JustLend V2 (Moolah)** isolated-market skill (`justlend-lending-v2`): ERC4626 supply vaults, `(collateral, loan)` borrow markets, per-market `risk`/`lltv`, liquidation, and history.
- Multi-client manifests for Codex (`.codex/`) and OpenCode (`.opencode/`) alongside the Claude Desktop / Claude Code / Cursor configs.
- Routing frontmatter (`name` / `description` with when-to-use + negative triggers) on every `SKILL.md`.

### Notes
- The bundled MCP server (`scripts/mcp_server.mjs`) remains **read-only (9 tools)**. Write operations (supply/borrow/repay/withdraw, sTRX staking, energy rental, governance voting) require the full [@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend) **plus a signing wallet** — the bundled server never signs or moves funds.

## [1.0.0]

### Added
- Initial read-only skills package: market data, protocol dashboard, account health, TRC20 balances, and allowances via a 9-tool stdio MCP server + a CLI (`scripts/justlend_api.mjs`).
