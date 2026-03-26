#!/bin/bash
set -e

echo "Installing JustLend Skills..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js v20+ first."
    echo "  https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Error: Node.js v20+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << 'EOL'
# TronGrid API Key (required) — get from https://www.trongrid.io/
TRONGRID_API_KEY=

# Network: mainnet or nile (testnet)
NETWORK=mainnet
EOL
    echo ""
    echo "Created .env file. Please edit it with your credentials:"
    echo "  TRONGRID_API_KEY  — get from https://www.trongrid.io/"
else
    echo ".env file already exists, skipping."
fi

echo ""
echo "Installation complete!"
echo ""
echo "Usage:"
echo "  npm start                              # Run MCP server"
echo "  node scripts/justlend_api.mjs markets  # List markets (CLI)"
echo ""
echo "Configure your AI client (Claude Desktop, Cursor, etc.) to use:"
echo "  node $(pwd)/scripts/mcp_server.mjs"
