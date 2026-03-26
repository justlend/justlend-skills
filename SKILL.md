# JustLend DAO — AI Agent Skill

This skill enables AI agents to interact with the [JustLend DAO](https://justlend.org) lending protocol on the TRON blockchain. Query real-time market data, check account positions, and analyze lending data via MCP tools.

## Prerequisites

- **Node.js** v20+
- **TronGrid API Key** — get from [trongrid.io](https://www.trongrid.io/)

## Available Tools

| Tool | Inputs | Description |
|------|--------|-------------|
| `get_all_markets` | — | All JustLend markets with supply/borrow APY, mining APY, and TVL |
| `get_account_summary` | `address` | Health factor, liquidity, and liquidation risk |
| `get_trx_balance` | `address` | Native TRX balance |
| `get_token_balance` | `address`, `token` | TRC20 token balance (e.g., USDT, USDD) |
| `get_dashboard` | — | Protocol overview: total supply, total borrow, TVL, user count |
| `get_jtoken_details` | `jtokenAddr` | Detailed jToken info: interest rate model, reserves, mining rewards |
| `get_account_data_from_api` | `address` | Comprehensive account data from API (positions, balances, rewards) |
| `get_supported_markets` | — | List all supported markets with jToken/underlying addresses |
| `check_allowance` | `address`, `asset` | Check TRC20 approval status for JustLend contracts |

## Critical Rules

### Health Factor Check
Always call `get_account_summary` before advising a user about their position. If `shortfallUSD > 0`, the position is **at liquidation risk**.

## Typical Workflows

### Check Market Rates
1. `get_all_markets` — view all markets with APY and TVL
2. Compare `totalSupplyAPY` (includes mining rewards) across markets

### Analyze Account Position
1. `get_account_summary` — check health factor and liquidity
2. `get_account_data_from_api` — get detailed position data
3. `get_token_balance` — check specific token balances

### Check Token Approval Status
1. `check_allowance` — verify if a TRC20 token is approved for JustLend

## Supported Assets

| Symbol | Type | jToken Address |
|--------|------|---------------|
| TRX | Native | `TE2RzoSV3wFK99w6J9UnnZ4vLfXYoxvRwP` |
| USDT | TRC20 | `TXJgMdjVX5dKiQaUi9QobwNxtSQaFqccvd` |
| USDD | TRC20 | `TKFRELGGoRgiayhwJTNNLqCNjFoLBh3Mnf` |
| USDC | TRC20 | `TNSBA6KvSvMoTqQcEgpVK7VhHT3z7wifxy` |
| BTC  | TRC20 | `TLeEu311Cbw63BcmMHDgDLu7fnk9fqGcqT` |
| ETH  | TRC20 | `TR7BUFRQeq1w5jAZf1FKx85SHuX6PfMqsV` |
| SUN  | TRC20 | `TPXDpkg9e3eZzxqxAUyke9S4z4pGJBJw9e` |
| WIN  | TRC20 | `TRg6MnpsFXc82ymUPgf5qbj59ibxiEDWvv` |

> For the full list of 24+ supported markets, use the full MCP server: [@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend)

## Example Prompts

- "What are the current supply APYs on JustLend? Which market has the best rate?"
- "Show me the JustLend protocol dashboard — total TVL, users, and borrow volume."
- "Check my JustLend account — is my position safe from liquidation?"
- "Show me detailed info for the jUSDT market including the interest rate model."
- "How much TRX do I have in my wallet?"
- "List all supported JustLend markets and their addresses."

## Security

- This is a **read-only** skill — no transaction signing or write operations
- Only requires a TronGrid API key for blockchain read access
