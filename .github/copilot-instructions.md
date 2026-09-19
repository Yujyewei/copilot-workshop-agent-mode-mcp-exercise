# Copilot 專案指引

這是一份給 GitHub Copilot 在本專案中工作時遵循的規則。請在每次協助修改程式碼前先閱讀並遵守。

## 技術限制

- 這是**純前端專案**,只能使用 HTML、CSS、原生 JavaScript。
- 禁止引入任何框架或套件(例如 React、Vue、jQuery、Bootstrap、Tailwind 等)。
- 不要建立 `package.json`,也不要執行 `npm install` 或任何套件管理指令。
- 不要引用任何外部 CDN 資源(字型、圖示、函式庫等),整個網頁必須能夠**離線開啟並正常運作**。
- 檔案結構固定為根目錄下的三個檔案:`index.html`、`styles.css`、`app.js`。不要新增其他程式檔案或資料夾來拆分程式碼。

## 程式風格

- 程式碼中的**註解一律使用繁體中文**;變數與函式命名一律使用**英文 camelCase**(例如 `todoList`、`addTodoItem`)。
- CSS 顏色一律使用 `:root` 中定義的 CSS 變數(例如 `var(--color-primary)`),不要在樣式規則中寫死色碼(hex/rgb)。
- JavaScript 一律使用 `const` 或 `let` 宣告變數,不要使用 `var`。
- 產生或更新 DOM 內容時,一律使用 `textContent` 或 `document.createElement()` 等 DOM API,不要用 `innerHTML` 拼接字串組出畫面內容(避免 XSS 風險與難以維護的字串樣板)。

## 協作方式

- **動手修改程式碼之前**,先用條列方式說明打算修改哪些檔案、要做什麼變動,等待使用者確認後才開始實際編輯。
- **一次只處理使用者要求的那一件事**,不要順手做沒有被要求的重構、格式調整或額外優化。
- 每次修改完成後,說明**要怎麼在瀏覽器中開啟並驗證**這次的變動(例如要點哪裡、預期看到什麼結果)。
