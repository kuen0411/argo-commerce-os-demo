# ARGO Commerce OS｜互動展示版

供項目方點擊體驗的靜態 DEMO。來源為 2026-10-15 的展示網站版本 `e80a9b581b13e5a23a75006a22ebbf19174468a4`；本倉庫保留其介面、模擬資料與測試。

## 展示方式

開啟 GitHub Pages 網址即可使用，不需要 ChatGPT 帳號。首頁有四段可點擊情境；左側選單可進入 12 個頁面，包括合作對象、平台帳號、店舖、案件、任務、文件、財務及操作歷程。右上角可切換 6 種展示身分，初始展示密碼為 `Demo1234!`。進入各身分的首次導覽可查看可操作模組。

介面按鈕可展示資料建立、案件推進、補件、任務處理、結算與管理權限。資料均為模擬資料；操作結果只存在使用者自己的瀏覽器 `localStorage`，不同裝置和訪客不會同步。重新開啟同一瀏覽器會保留本地變更；清除該網站的瀏覽器資料即可回到初始展示狀態。

這個 DEMO 沒有後端驗證或資料庫。展示密碼和介面權限僅用於流程演示，不能保護真實資料。請勿上傳身分證、存摺、平台憑證、客戶資料或其他機密檔案。

## 本機執行與驗證

需要 Python 3 與 Node.js 18 或更新版本：

```bash
python -m http.server 8000 --directory dist
node --test tests/model.test.mjs tests/ui.test.mjs
```

瀏覽 `http://localhost:8000/`。不要以 `file://` 直接開啟，因為 JavaScript 模組需要 HTTP 伺服器。

## GitHub Pages 發布

此倉庫的 `.github/workflows/pages.yml` 在推送到 `main` 時執行測試，通過後發布 `dist/`。在 GitHub 建立公開 repository，推送 `main`，並於 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。完成部署後，公開網址通常是 `https://<帳號>.github.io/<倉庫名稱>/`；以 GitHub Pages 設定頁與部署紀錄顯示的實際網址為準。

GitHub Pages 的訪客不需登入 GitHub 或 ChatGPT；公開網站上的前端程式與模擬資料也可被任何人查看。此版只適合展示與流程驗證。若要承載真實資料或跨使用者協作，必須另建後端身分驗證、權限、檔案儲存及稽核機制。
