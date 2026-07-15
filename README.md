# JustLend Skills

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![TRON Network](https://img.shields.io/badge/Network-TRON-red)
![MCP](https://img.shields.io/badge/MCP-Compatible-blue)
![JustLend](https://img.shields.io/badge/Protocol-JustLend_DAO-green)

AI Agent skills for [JustLend DAO](https://justlend.org) on the TRON network. Provides structured instructions and an MCP server that enables AI agents (Claude Code, Claude Desktop, Cursor, Codex, etc.) to query market data, check account positions, and analyze DeFi lending data.

## Features

- **Market Data**: Real-time APY (including mining rewards), TVL, and utilization for all JustLend markets
- **Protocol Dashboard**: Total supply, borrow, TVL, user count across the protocol
- **Account Analysis**: Health factor monitoring, liquidation risk assessment, balance queries
- **Token Allowances**: Check TRC20 approval status for JustLend contracts

- **JustLend V2**: Isolated-market lending — curated ERC4626 supply vaults + permissionless `(collateral, loan)` borrow markets, with per-market `risk`/`lltv`, liquidation, and history (see the [V2 skill](skills/justlend-lending-v2/SKILL.md))

> For advanced features (V2 lending, sTRX staking, energy rental, governance voting, mining rewards), use the full MCP server: [@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend) (adds the V2 tools, WTRX wrap/unwrap, and AI prompts).

## Which Mode to Use

| Mode | What it is | Use when | Writes? |
|------|-----------|----------|:------:|
| **Skills (this package)** | Agent instruction files (`SKILL.md`) + a bundled read-only MCP server (9 tools) | An agent needs to *query* JustLend — markets, your position/health, balances, allowances | No |
| **Bundled MCP server** (`npm start`) | The 9-tool read-only stdio server shipped here | Same, wired into a client (Claude / Cursor / Codex / OpenCode) | No |
| **CLI** (`node scripts/justlend_api.mjs`) | One-shot terminal queries | Quick manual checks / scripting reads | No |
| **Full MCP server** ([@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend)) | 98-tool read + **write** server | You need to *act*: supply/borrow/repay/withdraw, stake, rent energy, vote, liquidate | **Yes** (signing wallet required) |

### Skill → dependency matrix

| Skill | Bundled read MCP | Full MCP server | TronGrid key | Signing wallet | Writes? |
|-------|:---------------:|:---------------:|:-----------:|:-------------:|:------:|
| `justlend-dao` (base query) | ✅ | — | ✅ | — | No |
| `justlend-lending-v1` | — | ✅ | ✅ | ✅ | Yes |
| `justlend-lending-v2` | — | ✅ | ✅ | ✅ | Yes |
| `justlend-trx-staking` | — | ✅ | ✅ | ✅ | Yes |
| `justlend-energy-rental` | — | ✅ | ✅ | ✅ | Yes |
| `justlend-governance-v1` | — | ✅ | ✅ | ✅ | Yes |

Read-only skills work with just this package + a TronGrid key. Every write skill routes through the full server and needs a **signing wallet** (agent-wallet or a browser wallet); the bundled server has no signing capability.

## Supported Markets

| jToken | Underlying | Description |
|--------|-----------|-------------|
| jTRX   | TRX       | Native TRON token |
| jUSDT  | USDT      | Tether USD |
| jUSDD  | USDD      | Decentralized USD |
| jUSDC  | USDC      | USD Coin |
| jBTC   | BTC       | Bitcoin (TRC20) |
| jETH   | ETH       | Ethereum (TRC20) |
| jSUN   | SUN       | SUN Token |
| jWIN   | WIN       | WINkLink |

> The full MCP server supports 24+ markets including jsTRX, jwstUSDT, jWBTC, and more.

## Project Structure

```
justlend-skills/
├── scripts/                          # Core implementation
│   ├── mcp_server.mjs               # MCP server (9 read-only tools, stdio transport)
│   └── justlend_api.mjs             # JustLend API client & CLI tool
├── skills/                           # Agent skill instructions
│   ├── _meta.json                   # Skill metadata
│   ├── justlend-lending-v1/SKILL.md # V1 pooled lending operations guide
│   ├── justlend-lending-v2/SKILL.md # V2 isolated lending guide
│   ├── justlend-trx-staking/SKILL.md
│   ├── justlend-energy-rental/SKILL.md
│   └── justlend-governance-v1/SKILL.md
├── docs/                             # Protocol guides
│   ├── justlend-guide.md            # Lending concepts & risk management
│   ├── justlend-v2-guide.md         # V2 isolated-market concepts
│   ├── strx-staking-guide.md        # sTRX staking guide
│   └── resource-rental.md           # Energy rental guide
├── SKILL.md                          # Main skill reference
├── install.sh                        # Quick setup script
└── uninstall.sh                      # Cleanup script
```

## Quick Start

### 1. Install

```bash
git clone https://github.com/justlend/justlend-skills.git
cd justlend-skills
bash install.sh
```

Or manually:

```bash
npm install
cp .env.example .env   # Then edit .env with your keys
```

### 2. Configure

Edit `.env`:

```env
# Required — get from https://www.trongrid.io/
TRONGRID_API_KEY=your_trongrid_api_key

# Network: mainnet (default) or nile (testnet)
NETWORK=mainnet
```

### 3. Run

**As MCP Server** (for AI agents):

```bash
npm start
```

**As CLI Tool** (for quick checks):

```bash
node scripts/justlend_api.mjs markets              # List all markets with APY
node scripts/justlend_api.mjs dashboard            # Protocol dashboard (TVL, users)
node scripts/justlend_api.mjs supported-markets    # List supported markets & addresses
node scripts/justlend_api.mjs balance <addr>       # Check TRX balance
node scripts/justlend_api.mjs balance <addr> USDT  # Check token balance
node scripts/justlend_api.mjs account <addr>       # Account health status
node scripts/justlend_api.mjs account-api <addr>   # Full account data from API
node scripts/justlend_api.mjs jtoken-details <jtoken>  # Detailed jToken info
node scripts/justlend_api.mjs allowance <addr> USDT    # Check TRC20 approval
```

## Client Configuration

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "justlend": {
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO/justlend-skills/scripts/mcp_server.mjs"],
      "env": {
        "TRONGRID_API_KEY": "your_key"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "justlend": {
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO/justlend-skills/scripts/mcp_server.mjs"],
      "env": {
        "TRONGRID_API_KEY": "your_key"
      }
    }
  }
}
```

### Claude Code

Add to `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "justlend": {
      "command": "node",
      "args": ["/ABSOLUTE_PATH_TO/justlend-skills/scripts/mcp_server.mjs"],
      "env": {
        "TRONGRID_API_KEY": "your_key"
      }
    }
  }
}
```

### Codex

Codex reads the bundled [`.codex/`](.codex/INSTALL.md) manifest — register the same stdio command (`node /ABSOLUTE_PATH_TO/justlend-skills/scripts/mcp_server.mjs`, env `TRONGRID_API_KEY`) in your Codex MCP config; details in [`.codex/INSTALL.md`](.codex/INSTALL.md).

### OpenCode

OpenCode loads the bundled `.opencode/` plugin, which auto-discovers each skill from its `SKILL.md` frontmatter. Point OpenCode at this directory (or symlink `.opencode/`); the read-only MCP server registers the same way (`node .../scripts/mcp_server.mjs`, env `TRONGRID_API_KEY`).

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `get_all_markets` | All markets with supply/borrow APY, mining rewards, and TVL |
| `get_dashboard` | Protocol overview: total supply, borrow, TVL, user count |
| `get_supported_markets` | List all supported markets with jToken/underlying addresses |
| `get_jtoken_details` | Detailed jToken info: interest rate model, reserves, mining rewards |
| `get_account_summary` | Health factor, liquidity, liquidation risk |
| `get_account_data_from_api` | Comprehensive account data from API (positions, rewards) |
| `get_trx_balance` | Native TRX balance |
| `get_token_balance` | TRC20 token balance (USDT, USDD, etc.) |
| `check_allowance` | Check TRC20 approval status for JustLend contracts |

## Example Conversations

**"What are the best supply rates on JustLend?"**
→ AI calls `get_all_markets`, sorts by totalSupplyAPY (includes mining rewards), presents ranking

**"Show me the JustLend protocol stats"**
→ AI calls `get_dashboard`, displays total TVL, supply/borrow volume, user count

**"Check if my position is safe"**
→ AI calls `get_account_data_from_api` for full position details, analyzes health factor

## Safety & Boundaries

- **This package is read-only.** The bundled MCP server (`scripts/mcp_server.mjs`) and the CLI only *query* — no transaction signing, no writes, no fund movement. It cannot move or lose funds.
- **Credentials.** The only secret is a **TronGrid API key** (read-only RPC access), stored locally in `.env` (git-ignored). No signing key is used or stored by this package.
- **Write operations live in the full server.** supply/borrow/repay/withdraw, sTRX staking, energy rental, and governance voting run through [@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend), which requires a **signing wallet**. When you enable those, the host MUST:
  - **confirm every write with the user (HITL)** before signing — show amount, market, and direction;
  - **never auto-retry a mutating call** (a repay / borrow / liquidate / vote may already have landed) — re-query state first;
  - simulate / preview first, and prefer **Nile testnet** (`NETWORK=nile`) before mainnet.
- **Per-module risk (highest-consequence, irreversible):** `liquidate` (V2), `unstake` (sTRX — has an unbonding period), and `cast_vote` (locks JST as WJST until withdrawal). Treat these as destructive.

## Data & Privacy

- **What's read:** on-chain market/account data plus the JustLend read APIs. A queried **address is sent to TronGrid and the JustLend `/account` API** to fetch its balances / positions.
- **What's stored:** nothing is persisted or logged by this package beyond your local `.env` key; no user data leaves your machine except the read requests above.

## Troubleshooting

### API Errors
Ensure your `TRONGRID_API_KEY` is valid and not rate-limited. Get a key from [trongrid.io](https://www.trongrid.io/).

## License

MIT License — Copyright (c) 2026 JustLend DAO

`SPDX-License-Identifier: MIT`
