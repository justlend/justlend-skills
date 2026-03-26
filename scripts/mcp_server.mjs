import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import JustLendAPI from "./justlend_api.mjs";

const server = new Server(
  {
    name: "justlend-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const api = new JustLendAPI();

// Define exactly the tools that have real on-chain implementations
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_all_markets",
        description: "Overview of all JustLend markets including supply/borrow APY and TVL.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_account_summary",
        description: "Get account health factor, liquidity, and liquidation risk status.",
        inputSchema: {
          type: "object",
          properties: {
            address: { type: "string", description: "TRON address" },
          },
          required: ["address"],
        },
      },
      {
        name: "get_trx_balance",
        description: "Check native TRX balance.",
        inputSchema: {
          type: "object",
          properties: {
            address: { type: "string", description: "TRON address" },
          },
          required: ["address"],
        },
      },
      {
        name: "get_token_balance",
        description: "Check TRC20 token balance (e.g., USDT, USDD).",
        inputSchema: {
          type: "object",
          properties: {
            address: { type: "string", description: "TRON address" },
            token: { type: "string", description: "Token symbol (e.g., USDT)" },
          },
          required: ["address", "token"],
        },
      },
      {
        name: "get_dashboard",
        description: "Get JustLend protocol dashboard: total supply, total borrow, TVL, number of suppliers/borrowers.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_jtoken_details",
        description: "Get detailed jToken market info: interest rate model, reserves, mining rewards, utilization, etc.",
        inputSchema: {
          type: "object",
          properties: {
            jtokenAddr: { type: "string", description: "jToken contract address (e.g., TXJgMdjVX5dKiQaUi9QobwNxtSQaFqccvd for jUSDT)" },
          },
          required: ["jtokenAddr"],
        },
      },
      {
        name: "get_account_data_from_api",
        description: "Get comprehensive user account data from API: lending positions, balances, mining rewards, health factor. More stable than on-chain queries.",
        inputSchema: {
          type: "object",
          properties: {
            address: { type: "string", description: "TRON address" },
          },
          required: ["address"],
        },
      },
      {
        name: "get_supported_markets",
        description: "List all supported JustLend lending markets with jToken addresses, underlying token addresses, and decimals.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "check_allowance",
        description: "Check if a TRC20 token has been approved for JustLend. Must be approved before supply or repay for TRC20 assets. Not needed for TRX.",
        inputSchema: {
          type: "object",
          properties: {
            address: { type: "string", description: "TRON address to check" },
            asset: { type: "string", description: "Asset symbol (e.g., USDT)" },
          },
          required: ["address", "asset"],
        },
      }
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_all_markets":
        return { content: [{ type: "text", text: JSON.stringify(await api.getAllMarkets(), null, 2) }] };
      case "get_account_summary":
        return { content: [{ type: "text", text: JSON.stringify(await api.getAccountSummary(args.address), null, 2) }] };
      case "get_trx_balance":
        return { content: [{ type: "text", text: JSON.stringify(await api.getTrxBalance(args.address), null, 2) }] };
      case "get_token_balance":
        return { content: [{ type: "text", text: JSON.stringify(await api.getTokenBalance(args.address, args.token), null, 2) }] };
      case "get_dashboard":
        return { content: [{ type: "text", text: JSON.stringify(await api.getDashboard(), null, 2) }] };
      case "get_jtoken_details":
        return { content: [{ type: "text", text: JSON.stringify(await api.getJTokenDetails(args.jtokenAddr), null, 2) }] };
      case "get_account_data_from_api":
        return { content: [{ type: "text", text: JSON.stringify(await api.getAccountDataFromAPI(args.address), null, 2) }] };
      case "get_supported_markets":
        return { content: [{ type: "text", text: JSON.stringify(api.getSupportedMarkets(), null, 2) }] };
      case "check_allowance":
        return { content: [{ type: "text", text: JSON.stringify(await api.checkAllowance(args.address, args.asset), null, 2) }] };
      default:
        throw new Error(`Unknown or unimplemented tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("JustLend MCP Server running on stdio with real on-chain tools.");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});