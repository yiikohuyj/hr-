<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10Okwx2SI5-xDUKCtTfdM7ETg-vwJyNrB


## Project Setup (專案設定)

這個專案使用 React + Vite 建置。

### Prerequisites (前置需求)
請確保您的電腦已安裝 [Node.js](https://nodejs.org/) (建議 v18+)。

### Installation (安裝)

1.  Clone 專案：
    ```bash
    git clone https://github.com/your-username/hr-.git
    ```
2.  安裝套件：
    ```bash
    npm install
    ```
3.  設定環境變數：
    - 複製 `.env.local` 範本 (如果有的話) 或直接建立。
    - 新增您自己的 keys:
      ```env
      GEMINI_API_KEY=your_gemini_api_key
      ```

### Development (本地開發)

啟動開發伺服器：
```bash
npm run dev
```
瀏覽器打開 `http://localhost:3000` 即可看到畫面。

### Deployment (部署)

本專案已配置 **GitHub Actions** 自動部署至 **GitHub Pages**。

1.  **推送到 GitHub**:
    - 只要將程式碼推送到 `main` 分支，GitHub Actions 就會自動觸發。
    - 流程會執行 `npm install` -> `npm run build` -> Deploy to `gh-pages` branch.

2.  **啟用 GitHub Pages**:
    - 到 Repository Settings -> Pages。
    - 在 "Build and deployment" 下，Source 選擇 **"Deploy from a branch"**。
    - Branch 選擇 **"gh-pages"** (此分支會在第一次 Action 跑完後自動建立)。

### Linting
檢查程式碼風格：
```bash
npm run lint
```
