# Skill-linker Release SOP

## Release Flow

### 方式 1：使用 Script（推薦）

```bash
# 進入專案目錄
cd /app/workspace/projects/skill-linker

# 執行 release script，指定版本類型
./release.sh patch   # 小幅更新 (4.0.4 -> 4.0.5)
./release.sh minor   # 功能更新 (4.0.4 -> 4.1.0)
./release.sh major   # 重大改版 (4.0.4 -> 5.0.0)
```

Script 會自動完成：

1. 比對本地與 npm 版本
2. 更新 package.json 版本
3. 建立 git commit
4. 建立對應 tag (vX.Y.Z)
5. 推送到遠端（觸發 GitHub Action）

### 方式 2：手動操作

```bash
# 1. 確認修改並 commit
git add -A
git commit -m "feat: your changes"

# 2. 根據版本類型更新版本號
npm version patch -m "chore: release v%s"   # patch
npm version minor -m "chore: release v%s"  # minor
npm version major -m "chore: release v%s"   # major

# 3. 自動推送到遠端（包含 tag）
git push && git push origin --tags
```

## Version 判斷規則

| 類型      | 說明               | 範例          |
| --------- | ------------------ | ------------- |
| **patch** | Bug fix 或小幅優化 | 4.0.4 → 4.0.5 |
| **minor** | 新功能向下相容     | 4.0.4 → 4.1.0 |
| **major** | 重大改版不相容     | 4.0.4 → 5.0.0 |

## GitHub Action 觸發

- Workflow: `.github/workflows/publish.yml`
- Trigger: Push tag `v*`
- 自動發布到 npm registry
