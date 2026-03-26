# Installing JustLend Skills for Codex CLI

## Prerequisites

- Node.js 20+
- Git

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/justlend/justlend-skills ~/.codex/justlend-skills
   cd ~/.codex/justlend-skills
   bash install.sh
   ```

2. **Create the skills symlink:**

   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/justlend-skills/skills ~/.agents/skills/justlend-skills
   ```

3. **Restart Codex** to discover the skills.

## Verify

```bash
ls ~/.agents/skills/justlend-skills
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `justlend-lending-v1` | Supply, withdraw, borrow, repay assets on JustLend |
| `justlend-trx-staking` | sTRX liquid staking (requires full MCP server) |
| `justlend-energy-rental` | Energy rental from JustLend marketplace (requires full MCP server) |
| `justlend-governance-v1` | DAO governance voting (requires full MCP server) |

## Updating

```bash
cd ~/.codex/justlend-skills && git pull && npm install
```

## Uninstalling

```bash
rm ~/.agents/skills/justlend-skills
rm -rf ~/.codex/justlend-skills
```
