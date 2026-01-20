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
  --list                列出已 Clone 的 Repos 並選擇 Skills
  --help                顯示說明

Examples:
  ./link-skill.sh                           # 互動式選擇
  ./link-skill.sh --list                    # 瀏覽已 Clone 的 Repos
  ./link-skill.sh /path/to/skill            # 指定本地 Skill
  ./link-skill.sh --from https://github.com/user/my-skill
  ./link-skill.sh --from https://github.com/anthropics/skills/tree/main/skills/pdf
```

### Multi-Skill Repo 支援

對於包含多個 Skills 的 Repo（如 `anthropics/skills`），腳本會：
1. 自動偵測 `skills/` 子目錄
2. 列出所有可用的 Skills 讓您選擇
3. 或者您可以直接在 URL 中指定子路徑（如 `/tree/main/skills/pdf`）

### 📋 List Mode - 瀏覽已 Clone 的 Repos

使用 `--list` 參數可以瀏覽 Skill Library 中已 clone 的所有 repos：

```bash
npx skill-linker --list
```

操作流程：
1. 顯示所有已 clone 的 repos（以 `owner/repo` 格式）
2. 選擇要使用的 repo
3. 如果該 repo 包含多個 skills，會列出讓您選擇
4. 選擇後繼續正常的 Agent 安裝流程

這對於管理多個已下載的 skill repos 特別有用！

## 📦 推薦的 Public Skill Repos

| Repo | 說明 |
|------|------|
| [anthropics/skills](https://github.com/anthropics/skills) | Claude 官方 Skills (pdf, docx, pptx, xlsx...) |
| [obra/superpowers](https://github.com/obra/superpowers) | 開發流程 Skills (TDD, debugging, code-review...) |

```bash
# 安裝 Anthropic 的 PDF Skill
npx skill-linker --from https://github.com/anthropics/skills/tree/main/skills/pdf

# 安裝 obra 的所有開發 Skills (可互動選擇)
npx skill-linker --from https://github.com/obra/superpowers
```

## 📂 Skill Library

使用 `--from` 參數時，Skills 會自動存放到 `~/Documents/AgentSkills`，並以 **owner/repo** 結構分層：

```
~/Documents/AgentSkills/
├── anthropics/
│   └── skills/          # https://github.com/anthropics/skills
├── obra/
│   └── superpowers/     # https://github.com/obra/superpowers
└── your-org/
    └── your-skill/      # https://github.com/your-org/your-skill
```

這種命名空間結構可避免不同帳號擁有相同 repo 名稱時的衝突。

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
