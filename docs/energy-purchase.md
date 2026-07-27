# JustLend Energy Direct Purchase

Direct purchase obtains a live backend quote, signs a native TRX transfer locally, and submits the
signed transaction to the configured service. The client does not broadcast the payment itself.

## Lifecycle

`config → quote → explicit confirmation → sign only → backend submit/broadcast → order polling`

Terminal order states are `delivered`, `partial`, `failed`, `expired`, and `cancelled`.

## Operational boundary

- The full MCP server must receive `JUSTLEND_ENERGY_API_URL`; this skills repository has no default.
- Purchase limits, supported durations, activation fees, unit prices, and resource-pool addresses are live API data.
- A signed transaction is sensitive because anyone holding it may broadcast it before expiration.
- An ambiguous result must retain a payment-risk marker and block a second payment until chain/history reconciliation.

See [`skills/justlend-energy-purchase/SKILL.md`](../skills/justlend-energy-purchase/SKILL.md) for the agent workflow and tool-level safety rules.

