import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import JustLendAPI from "./justlend_api.mjs";
import { createToolError, createToolSuccess } from "./mcp_contract.mjs";
import { MCP_TOOLS } from "./mcp_tools.mjs";

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const server = new Server(
  {
    name: "justlend-mcp-server",
    version,
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
    tools: MCP_TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: providedArgs } = request.params;
  const args = providedArgs ?? {};

  try {
    let result;
    switch (name) {
      case "get_all_markets":
        result = await api.getAllMarkets();
        break;
      case "get_account_summary":
        result = await api.getAccountSummary(args.address);
        break;
      case "get_trx_balance":
        result = await api.getTrxBalance(args.address);
        break;
      case "get_token_balance":
        result = await api.getTokenBalance(args.address, args.token);
        break;
      case "get_dashboard":
        result = await api.getDashboard();
        break;
      case "get_jtoken_details":
        result = await api.getJTokenDetails(args.jtokenAddr);
        break;
      case "get_account_data_from_api":
        result = await api.getAccountDataFromAPI(args.address);
        break;
      case "get_supported_markets":
        result = api.getSupportedMarkets();
        break;
      case "check_allowance":
        result = await api.checkAllowance(args.address, args.asset);
        break;
      default:
        throw new Error(`Unknown or unimplemented tool: ${name}`);
    }
    return createToolSuccess(name, result);
  } catch (error) {
    return createToolError(name, error);
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
