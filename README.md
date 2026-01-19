# AI Agent Skill Installer

一個互動式 CLI 工具，用於將 AI Agent Skills 快速連結（Symlink）到各種 AI Agent 的專案或全域目錄中。

## ✨ 功能特色

- **多 Agent 支援**：支援 Claude Code, GitHub Copilot, Antigravity, Cursor, Windsurf, OpenCode 等。
- **雙重範圍 (Scope)**：可選擇安裝到當前 `專案目錄 (Project)` 或 `全域目錄 (Global)`。
- **自動 Clone**：使用 `--from` 參數可直接從 GitHub Clone Skill。
- **Skill Library 支援**：自動偵測統一的 Skill 存放區。

## 🚀 快速開始

### 方式 1：使用 npx (推薦)

無需安裝，直接執行：

```bash
# 互動式選擇本地 Skill
npx skill-linker

# 從 GitHub Clone 並安裝
npx skill-linker --from https://github.com/user/my-skill

# 指定本地路徑
npx skill-linker /path/to/my-skill
```

### 方式 2：Clone 此專案

```bash
git clone https://github.com/user/skill-installer.git
cd skill-installer
./link-skill.sh
```

## 🛠️ 命令說明

```
Usage: link-skill.sh [OPTIONS] [SKILL_PATH]

Options:
  --from <github_url>   從 GitHub Clone Skill 後再連結
  --help                顯示說明

Examples:
  ./link-skill.sh                           # 互動式選擇
  ./link-skill.sh /path/to/skill            # 指定本地 Skill
  ./link-skill.sh --from https://github.com/user/my-skill
```

## 📂 Skill Library

建議將您的 Public Skills 統一存放在 `~/Documents/AgentSkills`：

```bash
mkdir -p ~/Documents/AgentSkills
cd ~/Documents/AgentSkills
git clone https://github.com/user/my-awesome-skill.git
```

腳本會自動偵測此目錄並列出可用的 Skills。

## 🛠️ 支援的 Agent 與路徑

| 平台 / 工具 | 專案目錄 | 全域目錄 |
|------------|---------|---------|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` |
| **GitHub Copilot** | `.github/skills/` | `~/.copilot/skills/` |
| **Google Antigravity** | `.agent/skills/` | `~/.gemini/antigravity/skills/` |
| **Cursor** | `.cursor/skills/` | `~/.cursor/skills/` |
| **OpenCode** | `.opencode/skill/` | `~/.config/opencode/skill/` |
| **OpenAI Codex** | `.codex/skills/` | `~/.codex/skills/` |
| **Gemini CLI** | `.gemini/skills/` | `~/.gemini/skills/` |
| **Windsurf** | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |

## ⚠️ 注意事項

1. **Windows 使用者**：請使用 WSL 或 Git Bash 執行此工具。
2. **Git Clone First**：`--from` 參數會自動處理 clone，但如果不使用該參數，請確保 Skill 已在本地。

## 授權

MIT License
