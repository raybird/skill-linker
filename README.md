# AI Agent Skill Installer (skill-linker)

[![npm version](https://img.shields.io/npm/v/skill-linker.svg)](https://www.npmjs.com/package/skill-linker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

一個現代化的互動式 CLI 工具，用於將 AI Agent Skills 快速連結（Symlink）到各種 AI Agent 的專案或全域目錄中。

## ✨ 功能特色

- **現代化 TUI 介面**：使用 `prompts` 提供流暢的互動體驗。
- **模糊搜尋 (Fuzzy Search)**：在選擇 Repository 時，直接輸入文字即可即時過濾清單。
- **智慧偵測**：自動偵測系統中已安裝的 Agent，並在選單中預設勾選。
- **多 Agent 支援**：支援 Claude Code, GitHub Copilot, Antigravity, Cursor, Windsurf, OpenCode, Gemini CLI 等。
- **雙重範圍 (Scope)**：可選擇安裝到當前 `專案目錄 (Project)` 或 `全域目錄 (Global)`。
- **自動 Clone**：支援從 GitHub Clone 並自動處理 Multi-skill Repos。
- **完全相容 npx**：無需安裝，隨插即用。

## 🚀 快速開始

### 方式 1：使用 npx (推薦)

```bash
# 啟動互動式安裝介面 (選擇本地或新 Clone)
npx skill-linker

# 瀏覽並從庫中 (AgentSkills/) 挑選已下載的 Skill
npx skill-linker list
# 或使用縮寫
npx skill-linker -l

# 從 GitHub Clone 並安裝
npx skill-linker --from https://github.com/user/my-skill

# 指定本地路徑 (如果是自己 clone 下來的指定目錄)
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
  --from <github-url>  先從 GitHub Clone Skill 後再進行連結
  -l, --list           列出庫中可用的 Skills (可互動選擇)
  -h, --help           顯示說明

Commands:
  list                 列出庫中所有可用的 Repos 與其 Skills
```

### 📋 瀏覽模式 (List Mode)

如果您想從之前透過 `--from` 下載過的庫 (`~/Documents/AgentSkills`) 中挑選 Skill 來安裝，請使用 `list` 子指令：

```bash
npx skill-linker list
```

或使用選項：
```bash
npx skill-linker -l
```

1. **第一層**：選擇已 Clone 的 Repository (會標註是否有 `skills/` 子目錄)。
2. **第二層**：如果該 Repo 包含多個 Skills，會進階列出供您查看。

> 💡 **提示**：如果您已經手動 `git clone` 了某個 Skill Repo，也可以直接指定路徑安裝：
> ```bash
> npx skill-linker /path/to/your-cloned-repo
> ```

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

### Claude 官方 Skills (pdf, docx, pptx, xlsx...)
[anthropics/skills](https://github.com/anthropics/skills)
```bash
npx skill-linker --from https://github.com/anthropics/skills
```

### moltbot 的 AI Agent Skills (來自 clawdhub.com)
[moltbot/skills](https://github.com/moltbot/skills)
```bash
npx skill-linker --from https://github.com/moltbot/skills
```

### 精選的 AI Skills 工具箱
[obra/superpowers](https://github.com/obra/superpowers)
```bash
npx skill-linker --from https://github.com/obra/superpowers
```

## ⚠️ 注意事項

1. **權限問題**：在建立 Symlink 時，請確保您有對應目錄的寫入權限。
2. **環境需求**：需安裝 Node.js 18.0.0 以上版本。

## 授權

MIT License
