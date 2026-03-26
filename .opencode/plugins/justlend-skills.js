/**
 * JustLend Skills plugin for OpenCode.ai
 *
 * Injects JustLend skill context via system prompt transform.
 *
 * Installation:
 *   git clone https://github.com/justlend/justlend-skills ~/.config/opencode/justlend-skills
 *   cd ~/.config/opencode/justlend-skills && bash install.sh
 *   ln -s ~/.config/opencode/justlend-skills/.opencode/plugins/justlend-skills.js ~/.config/opencode/plugins/justlend-skills.js
 *   ln -s ~/.config/opencode/justlend-skills/skills ~/.config/opencode/skills/justlend-skills
 */
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const SKILL_NAMES = [
  "justlend-lending-v1",
  "justlend-trx-staking",
  "justlend-energy-rental",
  "justlend-governance-v1"
];

const extractFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };
  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      frontmatter[key] = value;
    }
  }
  return { frontmatter, content: match[2] };
};

export const JustLendSkillsPlugin = async ({ client, directory }) => {
  const skillsDir = path.join(PROJECT_ROOT, "skills");
  const agentsFile = path.join(PROJECT_ROOT, "AGENTS.md");

  const getBootstrapContent = () => {
    const parts = [];

    if (fs.existsSync(agentsFile)) {
      parts.push(fs.readFileSync(agentsFile, "utf8").trim());
    }

    const triggerLines = [];
    for (const name of SKILL_NAMES) {
      const skillPath = path.join(skillsDir, name, "SKILL.md");
      if (!fs.existsSync(skillPath)) continue;
      const { frontmatter } = extractFrontmatter(fs.readFileSync(skillPath, "utf8"));
      if (frontmatter.description) {
        triggerLines.push(`- **${name}**: ${frontmatter.description}`);
      }
    }

    if (triggerLines.length > 0) {
      parts.push(`## When to Load Each Skill\n\n${triggerLines.join("\n")}`);
    }

    parts.push(
      `## Using Skills in OpenCode\n\nUse OpenCode's native \`skill\` tool:\n` +
      SKILL_NAMES.map(n => `- \`skill: ${n}\``).join("\n") +
      `\n\nAll commands use: node ${PROJECT_ROOT}/scripts/mcp_server.mjs <command> [options]`
    );

    return parts.length > 0
      ? `<JUSTLEND_SKILLS>\n${parts.join("\n\n")}\n</JUSTLEND_SKILLS>`
      : null;
  };

  return {
    "experimental.chat.system.transform": async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (bootstrap) {
        (output.system ||= []).push(bootstrap);
      }
    },
  };
};
