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

> For advanced features (sTRX staking, energy rental, governance voting, mining rewards), use the full MCP server: [@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend)

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
│   ├── mcp_server.mjs               # MCP server (10 read-only tools, stdio transport)
│   └── justlend_api.mjs             # JustLend API client & CLI tool
├── skills/                           # Agent skill instructions
│   ├── _meta.json                   # Skill metadata
│   ├── justlend-lending-v1/SKILL.md # Lending operations guide
│   ├── justlend-trx-staking/SKILL.md
│   ├── justlend-energy-rental/SKILL.md
│   └── justlend-governance-v1/SKILL.md
├── docs/                             # Protocol guides
│   ├── justlend-guide.md            # Lending concepts & risk management
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

## Security

- **Read-Only**: This server only provides query functionality. No write operations or transaction signing.
- **API Key Only**: Only requires a TronGrid API key for blockchain read access.
- **Test First**: Use Nile testnet (`NETWORK=nile`) before mainnet operations.

## Troubleshooting

### API Errors
Ensure your `TRONGRID_API_KEY` is valid and not rate-limited. Get a key from [trongrid.io](https://www.trongrid.io/).

## License

MIT License Copyright (c) 2026 JustLend DAO
