---
name: justlend-energy-purchase
description: >-
  Buy TRON Energy directly through JustLend using an authoritative API quote and
  a native TRX payment that is signed locally but broadcast by the configured
  backend. Use when the user wants to buy energy immediately, compare direct
  purchase pricing, inspect a purchase order/history, or recover an uncertain
  payment. Writes require the full MCP server, an explicitly configured energy
  API, a signing wallet, and per-payment user confirmation. Not for long-term
  energy rental or staking/freezing TRX for resources.
---

# JustLend Energy Direct Purchase

Use the full [`@justlend/mcp-server-justlend`](https://github.com/justlend/mcp-server-justlend).
The bundled read-only server in this repository does not sign payments.

## Tools

| Tool | Purpose | Write? |
|------|---------|:------:|
| `get_energy_purchase_config` | Live limits, durations, prices, and pool capacity | No |
| `quote_energy_purchase` | Authoritative quote; does not create or reserve an order | No |
| `get_energy_purchase_order` | Order and delivery state | No |
| `get_energy_purchase_history` | Settled history by payer | No |
| `get_energy_payment_risk` | Reconcile a payment with an uncertain result | No |
| `buy_energy_direct` | Sign a TRX payment and submit it for backend broadcast | **Yes** |

## Safety Rules

1. Require `JUSTLEND_ENERGY_API_URL`. If it is missing or untrusted, stop; never substitute another JustLend API host.
2. Load `get_energy_purchase_config` and use its limits, durations, and prices. Do not invent economic fallback values.
3. Call `quote_energy_purchase` immediately before every purchase.
4. Show the user the payer, every receiver, energy per receiver, duration, exact `amount_sun` converted to TRX, and the fact that the backend may broadcast the payment.
5. Call `buy_energy_direct` only after explicit confirmation of that exact payment. Pass the quoted `amount_sun` as `expectedAmountSun` and set `confirmPayment=true` only then.
6. Never request, display, log, or persist a private key or signed transaction. Treat a signed payment as broadcastable until expiry.
7. Never broadcast the payment locally. The configured backend validates and broadcasts it.
8. On a timeout or unknown submission result, retry only the same signed transaction through the tool's internal workflow. Never initiate another purchase silently.
9. If `payment_result_unknown`, `tx_already_claimed`, or `payment_risk_unresolved` appears, call `get_energy_payment_risk`; block a new payment until reconciliation succeeds.

## Purchase Workflow

1. Call `get_energy_purchase_config`.
2. Validate receiver addresses and choose a live `duration` and permitted energy amount.
3. Call `quote_energy_purchase`.
4. If `can_fulfill` is false or the pool is insufficient, stop without opening the wallet.
5. Present the complete payment preview and wait for explicit confirmation.
6. Call `buy_energy_direct` with the confirmed quote amount.
7. Report the payment tx hash and order id. Track non-terminal orders with `get_energy_purchase_order`.
8. Treat only `delivered`, `partial`, `failed`, `expired`, and `cancelled` as terminal. Do not describe `paid`, `pending`, or `delegating` as delivered.
9. Re-query history/order state before any retry after a post-payment error.

## Error Handling

| Error | Action |
|-------|--------|
| `amount_changed` / `price_moved` | Re-fetch config and quote; require confirmation again |
| `pool_insufficient` | Lower the requested energy/receiver count or wait; do not sign |
| `invalid_duration` | Use a duration from live config |
| `user_rejected` | Stop; do not retry automatically |
| `tx_expired` / `broadcast_failed` | Reconcile first, then obtain a new quote and confirmation |
| `delivery_failed` | Payment may already have moved; show tx/order and re-query state |
| `payment_result_unknown` | Block new payment and run risk reconciliation |

## Routing

- Use `justlend-energy-rental` for multi-day rental or return/cancel workflows.
- Use this skill for the separately quoted direct-purchase service.
- Explain the distinction before moving funds when the user's wording is ambiguous.

