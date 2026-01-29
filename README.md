# AI Agent Skill Installer (skill-linker)

一個現代化的互動式 CLI 工具，用於將 AI Agent Skills 快速連結（Symlink）到各種 AI Agent 的專案或全域目錄中。

## ✨ 功能特色

- **現代化 TUI 介面**：使用 `prompts` 提供流暢的互動體驗。
- **模糊搜尋 (Fuzzy Search)**：在選擇 Skill 時可輸入關鍵字快速過濾。
- **智慧偵測**：自動偵測系統中已安裝的 Agent，並在選單中預設勾選。
- **多 Agent 支援**：支援 Claude Code, GitHub Copilot, Antigravity, Cursor, Windsurf, OpenCode, Gemini CLI 等。
- **雙重範圍 (Scope)**：可選擇安裝到當前 `專案目錄 (Project)` 或 `全域目錄 (Global)`。
- **自動 Clone**：支援從 GitHub Clone 並自動處理 Multi-skill Repos。
- **完全相容 npx**：無需安裝，隨插即用。

## 🚀 快速開始

### 方式 1：使用 npx (推薦)

```bash
# 啟動互動式安裝介面
npx skill-linker

# 從 GitHub Clone 並安裝
npx skill-linker --from https://github.com/user/my-skill

# 指定本地路徑
npx skill-linker /path/to/my-skill
```

### 方式 2：本地開發/安裝

```bash
git clone https://github.com/raybird/skill-linker.git
cd skill-linker
npm install
npm link # 之後可直接使用 skill-linker 指令
```

## 🛠️ 命令說明

```
Usage: skill-linker [options] [command] [skill-path]

Interactive CLI to link AI Agent Skills to various agents

Arguments:
  skill-path           指定本地 Skill 目錄路徑

Options:
  -V, --version        顯示版本號
  --from <github-url>  從 GitHub Clone Skill 後再連結
  -l, --list           列出庫中的 Skills (可互動選擇)
  -h, --help           顯示說明

Commands:
  list                 列出所有庫中的 Repos 與其 Skills
```

### 📋 瀏覽模式 (List Mode)

使用 `list` 子指令或 `-l` 參數可以啟動兩層式的互動瀏覽：

```bash
npx skill-linker list
```

1. **第一層**：選擇已 Clone 的 Repository (會標註是否有 `skills/` 子目錄)。
2. **第二層**：如果該 Repo 包含多個 Skills，會進階列出供您查看。

## 📂 Skill Library 管理

當您使用 `--from` 參數時，Skills 會自動存放到 `~/Documents/AgentSkills`，並以 **owner/repo** 結構分層：

```
~/Documents/AgentSkills/
├── anthropics/
│   └── skills/          # https://github.com/anthropics/skills
└── your-org/
    └── your-skill/      # https://github.com/your-org/your-skill
```

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

## 📦 推薦的 Public Skill Repos

| Repo | 說明 |
|------|------|
| [anthropics/skills](https://github.com/anthropics/skills) | Claude 官方 Skills (pdf, docx, pptx, xlsx...) |
| [moltbot/skills](https://github.com/moltbot/skills) | 各種封存的 AI Agent Skills (來自 clawdhub.com) |

## ⚠️ 注意事項

1. **權限問題**：在建立 Symlink 時，請確保您有對應目錄的寫入權限。
2. **環境需求**：需安裝 Node.js 14.0.0 以上版本。

## 授權

MIT License

