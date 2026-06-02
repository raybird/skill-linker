# AI Agent Skill Installer (skill-linker)

[![npm version](https://img.shields.io/npm/v/skill-linker.svg)](https://www.npmjs.com/package/skill-linker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

一個現代化的 CLI 工具，用於將 AI Agent Skills 快速連結（Symlink）到各種 AI Agent 的專案或全域目錄中。

## 🤔 這是什麼？

**AI Agent Skill** 是一包能擴充 AI 助手能力的檔案（例如讓 Claude 會處理 PDF、Word、Excel）。各家 AI 工具（Claude Code、Cursor、Gemini…）都會去自己的 `skills/` 目錄尋找這些技能。

`skill-linker` 幫你把一份 Skill 一次**連結（symlink）**到一個或多個 AI 工具的 skills 目錄，免去手動複製、也讓日後更新一處即可同步生效。

> 💡 **最快上手**：幫你的 Claude Code 安裝官方 Skills（PDF / Word / Excel / PPT 等），複製這行即可：
>
> ```bash
> npx skill-linker install --from https://github.com/anthropics/skills --agent claude
> ```

## ✨ 功能特色

- **CLI 優先設計**：專為 AI Agent 打造的命令列介面，無需互動問答。
- **自動化流程**：支援自動 Clone、安裝、覆寫。
- **多 Agent 支援**：支援 Claude Code, GitHub Copilot, Antigravity, Cursor, Windsurf, OpenCode, Gemini CLI 等。
- **雙重範圍 (Scope)**：可選擇安裝到當前 `專案目錄 (Project)` 或 `全域目錄 (Global)`。
- **自動 Clone**：支援從 GitHub Clone 並自動處理 Multi-skill Repos。
- **完全相容 npx**：無需安裝，隨插即用。

## 🚀 快速開始

### 方式 1：使用 npx (推薦)

```bash
# 安裝技能（需要 --skill 或 --from）
npx skill-linker install --skill <路徑> --agent opencode --scope both --yes
npx skill-linker install --from https://github.com/anthropics/skills --agent claude --scope both

# 列出 Skill Library 中的 Repos
npx skill-linker list
npx skill-linker list --repo anthropics/skills
npx skill-linker list --repo anthropics/skills --json
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
Usage: skill-linker [command]

CLI to link AI Agent Skills to various agents

Commands:
  install    Install a skill to specified agents
  list       List available skills in library

Options:
  -V, --version    顯示版本號
  -h, --help       顯示說明
```

### install 命令

```
Usage: skill-linker install [--skill <path> | --from <github-url>] [options]

Options:
  --skill <path>          指定本地 Skill 目錄路徑
  --from <github-url>     從 GitHub Clone 後再進行連結
  -a, --agent <names...>  指定一個或多個 Agent 名稱（opencode claude cursor …）
  -s, --scope <scope>     範圍：project, global, both（預設 both）
  -y, --yes              自動覆寫已存在的連結，並在 repo 已存在時更新
```

> `--skill` 與 `--from` 至少要提供一個（兩者皆可省略其一）。
>
> **`--agent` 省略時**：會自動安裝到所有「已偵測到」的 Agent —— 也就是那些全域目錄（如 `~/.claude`、`~/.cursor`）已存在於你系統上的工具。

範例：

```bash
# 指定本地路徑安裝到 opencode
npx skill-linker install --skill /path/to/skill --agent opencode

# 從 GitHub Clone 並一次安裝到多個 Agents
npx skill-linker install --from https://github.com/anthropics/skills --agent claude cursor --scope both

# 省略 --agent：安裝到所有已偵測到的 Agents
npx skill-linker install --skill /path/to/skill --scope both --yes

# 只安裝 multi-skill repo 中的「單一」子技能（用 GitHub 的 /tree/<branch>/<子路徑> 連結）
npx skill-linker install --from https://github.com/anthropics/skills/tree/main/skills/pdf --agent claude
```

`list` 會掃描你的 Skill Library（`~/Documents/AgentSkills`，由 `--from` 自動建立），顯示曾經 Clone 過的 repos 與其中的 skills。

```
Usage: skill-linker list [options]

Options:
  -r, --repo <name>   指定 Repository 名稱（格式為 owner/repo）
  --skills            平鋪列出整個 Library 中的每一個 skill
  --json              JSON 輸出格式
```

範例：

```bash
# 列出 Library 中所有 Repos
npx skill-linker list

# 平鋪列出所有 repo 底下的每一個 skill（owner/repo/skill）
npx skill-linker list --skills

# 列出特定 Repo 的 Skills（名稱為 owner/repo）
npx skill-linker list --repo anthropics/skills

# JSON 輸出（適合腳本處理）
npx skill-linker list --repo anthropics/skills --json
```

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

| 平台 / 工具            | 專案目錄            | 全域目錄                        |
| ---------------------- | ------------------- | ------------------------------- |
| **Claude Code**        | `.claude/skills/`   | `~/.claude/skills/`             |
| **GitHub Copilot**     | `.github/skills/`   | `~/.copilot/skills/`            |
| **Google Antigravity** | `.agent/skills/`    | `~/.gemini/antigravity/skills/` |
| **Cursor**             | `.cursor/skills/`   | `~/.cursor/skills/`             |
| **OpenCode**           | `.opencode/skills/` | `~/.config/opencode/skills/`    |
| **OpenAI Codex**       | `.codex/skills/`    | `~/.codex/skills/`              |
| **Gemini CLI**         | `.gemini/skills/`   | `~/.gemini/skills/`             |
| **Windsurf**           | `.windsurf/skills/` | `~/.codeium/windsurf/skills/`   |

## 📦 推薦的 Public Skill Repos

### Claude 官方 Skills (pdf, docx, pptx, xlsx...)

[anthropics/skills](https://github.com/anthropics/skills)

```bash
npx skill-linker install --from https://github.com/anthropics/skills --agent claude
```

### moltbot 的 AI Agent Skills (來自 clawdhub.com)

[moltbot/skills](https://github.com/moltbot/skills)

```bash
npx skill-linker install --from https://github.com/moltbot/skills --agent opencode
```

### 精選的 AI Skills 工具箱

[obra/superpowers](https://github.com/obra/superpowers)

```bash
npx skill-linker install --from https://github.com/obra/superpowers --agent claude cursor
```

## 🗑️ 移除已安裝的 Skill

本工具目前沒有 `uninstall` 命令。由於安裝動作只是建立一個 **symlink**，要移除時直接刪掉對應 Agent skills 目錄中的那個連結即可，**不會**影響到原始的 Skill 來源：

```bash
# 例如移除 Claude Code 專案目錄中名為 pdf 的 skill
rm .claude/skills/pdf

# 或移除全域安裝
rm ~/.claude/skills/pdf
```

各 Agent 的 skills 目錄位置請參考上方[支援的 Agent 與路徑](#-支援的-agent-與路徑)。若要刪除整份已 Clone 的來源，移除 `~/Documents/AgentSkills/<owner>/<repo>` 即可。

## ⚠️ 注意事項

1. **權限問題**：在建立 Symlink 時，請確保您有對應目錄的寫入權限。
2. **環境需求**：需安裝 Node.js 18.0.0 以上版本。
3. **Windows**：建立 Symlink 需開啟「開發者模式」或以系統管理員權限執行，否則 `fs.symlinkSync` 會失敗。
4. **覆寫保護**：`--yes` 只會覆寫既有的 Symlink；若目標是「真實目錄／檔案」，工具會拒絕刪除以保護資料。

## 授權

MIT License
