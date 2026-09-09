# AGENTS.md — 給 AI agent 與人的共同作業規則

> 這份檔案是這個 repo 的「上下文入口」。任何 AI 工具（Claude Code、Codex、Cursor…）或新加入的人，開工前先讀這份，再讀 `COMPONENT-SPEC.md`。
> 為什麼要有：同一個專案會被多個 session、多個 agent 接力做。沒有一份固定的規則，每個 session 都會重新猜慣例，猜錯就是一次 diff 噪音。

## 1. 這個 repo 是什麼

車來了行動端設計系統的 **React 版**（React 19）。姊妹 repo：[chelaile-mobile-design-system](https://github.com/HarryFan/chelaile-mobile-design-system)（Vue 版）。
兩邊 props / 事件 / class 命名 / a11y 語意 / token **逐字一致**，只差語法層。單一 API 真相是 `COMPONENT-SPEC.md`，**改 API 先改規格、再改兩邊**。

## 2. 開工前必讀（依序）

1. `COMPONENT-SPEC.md` — 8 個元件的 props、行為、class、a11y 契約。
2. `src/components/button/` — 五件套的參考實作，新元件照這個形狀。
3. `docs/DEVLOG.md` — 前幾輪做了什麼、哪裡踩坑、哪裡 AI 判斷錯過。**不要重複踩**。
4. `docs/ENGINEERING.md` — 架構決策、測試策略、資安與部署。

## 3. 硬規則（違反 = review 打回）

- **五件套缺一不可**：`Pascal.tsx` / hook `usePascal.ts` / `Pascal.stories.*` / `__tests__/Pascal.test.*` / `index.ts`。用產生器 `npm run new -- <kebab-name>` 生，不要手刻。
- **行為在 hook/composable，畫面只負責渲染**。測試優先測 hook 邏輯，再測 DOM。
- **測試是行為測試，不是 render-only、不是 snapshot**。每元件 ≥ 4 個，測試名稱繁體中文，描述「使用者做什麼 → 看到什麼」。
- **樣式只吃 `var(--cl-*)` token**，禁止硬編碼色碼、禁止 Tailwind 原生色（`bg-green-50` 這種）。樣式在 `pascal.css`，class 走 BEM `cl-<kebab>__part`，與 Vue 版共用同一套選擇器。
- **空值占位由父層負責**：元件不自己渲染 `--`，`description` 沒給就不渲染那個節點。
- **icon 一律 Remix Icon 字型**（`remixicon` dependency，`ri-*` class）：`icon` prop 收 class 名字串，元件渲染 `<i class="cl-icon {icon}" aria-hidden="true">`。禁止 emoji、禁止 ✓ × ! 文字符號（含 story、demo、測試資料）。
- **不動的東西**：（無；此 repo 只有元件庫）。不在 lib build 入口，本輪範圍外，不刪不 export（見 spec §4）。
- **git**：只 `git add <明確路徑>`，禁止 `git add .` / `-A`。`*.bak-*` 已 ignore，備份檔不進 git。commit message 繁體中文、動詞開頭、說 why 不只說 what。

## 4. 驗證閘（commit 前全部要綠）

```bash
npm test          # 全部測試
npm run build     # es + cjs + css + .d.ts
npm run build-storybook
```

`npm run typecheck`（`tsc --noEmit`，build 也會先跑）。CI（`.github/workflows/ci.yml`）跑同一組，PR 紅了不合併。

## 5. 多 agent 並行的分工規則

這個 repo 實際用過「一個主線 + N 個 fork agent」並行開發（見 DEVLOG 第二輪）。規則：

- **按目錄切分所有權**：每個 agent 只擁有自己的 `src/components/<name>/`，**禁止碰 `src/index.ts`**，出口接線由主線最後統一做。
- **agent 跑全套測試看到別人的目錄紅了 → 回報，不修**。並行時另一個 agent 可能正在寫到一半，紅的是進行中不是 bug。
- **agent 必須回報「規格偏差」**：任何與 `COMPONENT-SPEC.md` 不同的決定（多一個 prop、型別收窄）都要列出來給主線審，主線決定接受或打回。
- **fork（繼承上下文）vs 新 agent（乾淨上下文）**：任務需要本 session 已建立的判斷（哪些檔不能動、已知坑）→ fork；任務自足、只需要 spec + 參考實作 → 新 agent 比較省 token。
- **主線不做大量讀取**：預估要讀 > 3 檔或 > 500 行，派 agent 讀完回報結論，主線只拿結論。

## 6. 什麼一定要人來決定（human-in-the-loop）

- 改 `COMPONENT-SPEC.md`（等於改兩個 repo 的公開 API）。
- 刪目錄、刪既有元件、改 package.json 的 `exports` / `peerDependencies`。
- 接受或打回 agent 回報的規格偏差。
- `git push`、發版。
- 任何「看起來像 bug 但可能是刻意的」——先問，不順手改（例如 GeoStatusCard 的 `error → danger` 映射）。

## 7. 給 AI 的提示怎麼下（本 repo 實測有效的形狀）

1. 先給角色與範圍：「實作 spec §2.5 TabBar，只碰 `src/components/tab-bar/`」。
2. 指定參考實作：「照 `button/` 的檔案形狀；照 Vue 版 `tab-bar/` 的行為與測試 1:1 翻譯，只換語法層」。
3. 明列禁區與驗證閘：「不碰 index.ts；結束前 `npm test` 與 `npm run build` 必須綠」。
4. 要求結構化回報：「列出建立/刪除的檔、測試數、build 結果、規格偏差與理由，300 字內」。
5. 不接受「應該可以」：沒跑過的指令不准寫「通過」。
