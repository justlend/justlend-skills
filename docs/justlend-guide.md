# JustLend Lending Guide

JustLend is a TRON-based decentralized lending protocol. Users can supply assets to earn interest or borrow assets by providing collateral.

## Core Concepts
- **jTokens**: Interest-bearing tokens representing your supply position (e.g., jUSDT).
- **Collateral Factor**: The maximum percentage of an asset's value that can be borrowed.
- **Health Factor**: A measure of the safety of your loan. Below 1.0, you are subject to liquidation.

## Key Operations
1. **Supply**: Sending assets to the protocol to earn APY.
2. **Enter Market**: Enabling an asset to be used as collateral.
3. **Borrow**: Taking assets out against your collateral.
4. **Repay**: Returning borrowed assets plus interest.
5. **Withdraw**: Redeeming jTokens for the underlying asset.

## Risk Management
Always maintain a Health Factor above 1.5 to avoid liquidation risks during market volatility.
