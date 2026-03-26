# JustLend Lending Data Query

Core query skill for JustLend DAO on TRON. Enables AI agents to query market data, check account positions, and analyze lending information.

## Workflow Rules

### 1. Always Check Before Advising
- Use `get_all_markets` to find the best supply/borrow APYs (includes mining rewards).
- Use `get_dashboard` for protocol-level stats (total TVL, user count).
- Use `get_account_summary` or `get_account_data_from_api` to check health factor. If `shortfallUSD > 0`, the user is **at liquidation risk**.
- Use `get_trx_balance` or `get_token_balance` to check balances.
- Use `check_allowance` to verify TRC20 approval status.

## Available Tools

| Tool | Description |
|------|-------------|
| `get_all_markets` | All markets with supply/borrow APY, mining rewards, and TVL |
| `get_dashboard` | Protocol overview: total supply, borrow, TVL, user count |
| `get_supported_markets` | List all supported markets with addresses |
| `get_jtoken_details` | Detailed jToken info: interest rate model, reserves, mining rewards |
| `get_account_summary` | Health factor, liquidity, liquidation risk |
| `get_account_data_from_api` | Comprehensive account data from API (positions, rewards) |
| `get_trx_balance` | Native TRX balance |
| `get_token_balance` | TRC20 token balance |
| `check_allowance` | Check TRC20 approval status for JustLend |

## Examples

- "Check the current supply APY for USDT and USDD. Which is higher?"
- "Show me the JustLend protocol dashboard."
- "What's the detailed info for the jUSDT market?"
- "Check my JustLend account — is my position safe from liquidation?"
- "Do I have USDT approved for JustLend?"
- "List all supported JustLend markets and their addresses."
