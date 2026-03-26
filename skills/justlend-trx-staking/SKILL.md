# JustLend sTRX Staking

Liquid staking skill for TRX on JustLend. Stake TRX to receive sTRX tokens, which earn staking rewards automatically while remaining usable in DeFi protocols.

> **Note**: This skill requires the full MCP server ([@justlend/mcp-server-justlend](https://github.com/justlend/mcp-server-justlend)) which provides `stake_trx_to_strx`, `unstake_strx`, `get_strx_dashboard`, and other staking tools.

## How sTRX Works

1. **Stake**: Deposit TRX into the sTRX contract → receive sTRX tokens
2. **Rewards**: Staking rewards accrue to the sTRX/TRX exchange rate (sTRX appreciates over time)
3. **Unstake**: Burn sTRX to get TRX back (subject to ~14 day unbonding period)

## Tools (Full MCP Server)

| Tool | Description | Write? |
|------|-------------|--------|
| `get_strx_dashboard` | Staking APY, exchange rate, total supply | No |
| `get_strx_account` | User staking info (staked amount, income, rewards) | No |
| `get_strx_balance` | sTRX token balance | No |
| `check_strx_withdrawal_eligibility` | Unbonding status and withdrawal readiness | No |
| `stake_trx_to_strx` | Stake TRX to receive sTRX | **Yes** |
| `unstake_strx` | Unstake sTRX (starts unbonding period) | **Yes** |
| `claim_strx_rewards` | Claim staking rewards | **Yes** |

## Examples

- "What is the current sTRX staking APY?"
- "Stake 1000 TRX to get sTRX."
- "Check my sTRX staking rewards."
- "Unstake all my sTRX."
