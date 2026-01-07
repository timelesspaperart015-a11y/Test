# Customer CRUD Prototype

這是一個基於 React 的客戶管理原型系統。

## 技術棧 (Tech Stack)

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3
- **Deployment**: GitHub Pages (Automated via GitHub Actions)

## 快速開始 (Quick Start)

請確保您的環境已安裝 Node.js (推薦 v20+)。

### 1. 安裝依賴 (Install Dependencies)

```bash
npm install
```

### 2. 啟動開發伺服器 (Start Dev Server)

```bash
npm run dev
```
應用程式將在 `http://localhost:5173` (預設) 運行。

### 3. 建置生產版本 (Build)

```bash
npm run build
```
建置後的檔案將位於 `dist/` 目錄。

## 專案結構 (Project Structure)

- `App.tsx`: 主應用程式邏輯
- `components/`: UI 組件
- `mocks/`: 模擬資料與邏輯
- `vite.config.ts`: Vite 設定檔
- `.github/workflows/`: CI/CD 流程設定

## 部署 (Deployment)

本專案包含自動化部署流程：
1. 推送程式碼至 `main` 分支。
2. GitHub Action (`deploy.yml`) 會自動觸發。
3. 建置成功後，將會部署至 `gh-pages` 分支。
4. 請在 GitHub Repository 的 Settings > Pages 中，選擇 Source 為 `Deploy from a branch` 並選擇 `gh-pages` 分支。

## 開發指南

- **樣式**: 使用 Tailwind CSS class 進行開發。
- **環境變數**: 本地開發可使用 `.env` 檔案設定環境變數（已在 `.gitignore` 中排除）。
