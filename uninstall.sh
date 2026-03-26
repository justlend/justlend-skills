#!/bin/bash

echo "🗑️  Uninstalling JustLend Skills..."

# Remove node_modules
if [ -d "node_modules" ]; then
    rm -rf node_modules
fi

echo "✅ Uninstallation complete!"
