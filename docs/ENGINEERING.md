# ENGINEERING.md — 架構、測試、資安、部署

> 這份回答「這個元件庫為什麼長這樣」。決策附理由與被推翻的替代方案；沒有理由的決策不寫。

## 1. 架構

### 1.1 五件套：行為與畫面分離

```
src/components/<kebab>/
├── Pascal.*            畫面：只負責把 hook 的結果渲染出來
├── usePascal.ts        行為：所有判斷、class 推導、事件守門都在這
├── Pascal.stories.*    文件：每個狀態一個 story
├── __tests__/          行為測試
└── index.ts            出口：元件、Props 型別、hook、相關型別
```

**為什麼**：規範寫在文件裡沒人照做，寫成產生器就沒有選擇。`loading 期間要擋掉點擊` 這種規則放在元件裡會被複製到下一個元件然後漏掉一條；放在 hook 裡，行為只有一份，測試也只測一份。

**代價**：小元件（EmptyState）的 hook 幾乎只做 class 推導，看起來過度。接受，因為一致性比省三十行重要——下一個人不用判斷「這個元件夠不夠格有 hook」。

### 1.2 雙框架同一份規格

`COMPONENT-SPEC.md` 定 props / 事件 / class / a11y，Vue 與 React 各自實作。**允許不同的只有語法層**：`onAction` vs `@action`、`children` vs slot、hook vs composable、`value` vs `modelValue`。

**為什麼不共用一份程式碼**（例如 Web Components 或 framework-agnostic core）：兩邊的使用端都是既有 app，各自有框架；Web Components 在 SSR、表單整合、a11y 上的坑比維護兩份薄實作還多。規格層統一、實作層分開，是「兩份實作」與「一份抽象」之間成本最低的點。

### 1.3 樣式：CSS 變數 token，不綁樣式框架

- token 只有一份 `src/styles/tokens.css`，兩 repo 逐字相同。
- class 走 BEM：`cl-<kebab>__part`、modifier `cl-<kebab>--<mod>`、狀態 `is-<state>`。
- 顏色 / 間距 / 圓角 / 字級只吃 `var(--cl-*)`。

**為什麼不用 Tailwind 出貨**：元件庫要能被任何專案安裝；出貨 Tailwind class 等於強迫使用端裝 Tailwind、還要把元件目錄加進 content 掃描。Vue 版 app 層仍可用 Tailwind，但 `tailwind.config.js` 的色階全部 map 到 `var(--cl-*)`，設計系統元件本身不用。

**換主題**：使用端覆寫 `--cl-primary` 等變數即可，不需重新 build。

### 1.4 元件不自己「兜底」

- 空值占位由父層負責。`description` 沒給就不渲染 `<p>`，不渲染 `--`。
- `arrivalTime` 缺值顯示「更新中」文字而非 spinner——到站資訊是輪詢來的，缺值是常態不是錯誤；文字可測、可被螢幕閱讀器念出、兩框架 DOM 一致。
- icon 收字串不綁圖庫。

**為什麼**：Vue 版第一輪踩過「共用元件與父層各兜一次空值，最後沒人知道該改哪一層」。責任放在一層，就只會改一層。

### 1.5 a11y 是契約的一部分，不是加分項

寫進 spec、寫進測試：

| 元件 | 語意 |
|---|---|
| Button | `loading` 不設 `disabled` attribute（會失去焦點、螢幕閱讀器跳過），改 `aria-busy` + `aria-disabled`，click 在 hook 擋 |
| StatusCard | `danger` → `role="alert"` + `aria-live="assertive"`；其餘 `role="status"` + `polite` |
| TabBar | `role="tablist"` / `tab` / `aria-selected`，roving tabindex，←/→ 循環並移焦 |
| AppHeader | `<header role="banner">`，標題 `<h1>`，返回鈕 `aria-label` |
| Loading | `role="status"` + `aria-live="polite"`，spinner `aria-hidden`；`prefers-reduced-motion` 放慢不停（停止會像卡死） |

## 2. 測試策略

- **只寫行為測試**：「使用者做 X → 看到 Y / emit Z」。不寫 snapshot（改一個 class 全紅，沒人會看 diff）、不寫「render 不炸」這種零資訊測試。
- **每元件 ≥ 4 個**，優先覆蓋：預設值、條件渲染（有值才出）、a11y 屬性、事件守門（什麼情況**不**發事件）。
- **邊界一定測**：中文輸入法組字期間不觸發搜尋、組字中按 Enter 是選字不是送出、debounce 用 fake timer、unmount 清 timer、badge `> 99` 顯示 `99+`、點已選中的 tab 不發 change。
- **兩框架測試對稱**：同一個行為兩邊都有對應測試，spec 改了兩邊一起紅。
- 目前：Vue 版與本 repo 合計 105 個測試（本 repo 46）。

**沒做的**：視覺回歸（Chromatic 之類）、a11y 自動掃描（Storybook a11y addon）。列在 DEVLOG 待辦，理由是先把契約寫成可執行的測試，再上工具；工具先上會變成「綠了就好」。

## 3. 資安

元件庫的攻擊面小，但不是零：

- **XSS**：所有 props 都以文字節點渲染，沒有 `v-html` / `dangerouslySetInnerHTML`、沒有 `eval` / `new Function`。icon 收字串也是文字節點。使用端傳什麼進來都不會變成 HTML。
- **CSP 友善**：不注入 inline `<script>`；樣式走 class 與 CSS 變數，不靠 `style` 屬性拼接使用端輸入。
- **相依**：框架是 `peerDependencies`，元件庫本身零 runtime dependency，不會把第三方套件夾帶進使用端。CI 跑 `npm audit --audit-level=high --omit=dev`。
- **供應鏈**：`package-lock.json` 進 git、CI 用 `npm ci`。
- **不處理的**：權限、認證、API 呼叫——元件庫不碰，那是 app 層的事，元件只發事件。

## 4. 效能

- 出貨 es + cjs，`sideEffects` 只標 CSS，具名 export → 使用端 tree-shake 得掉沒用的元件。
- 零 runtime dependency、零樣式框架；整包 gzip 約 4 KB。
- 沒有 runtime style injection（cssinjs），首屏不等 JS 算樣式。
- 動畫尊重 `prefers-reduced-motion`。

## 5. 部署與流程

| 項目 | 做法 |
|---|---|
| 套件 | `npm run build` → `dist/` es + cjs + css + `.d.ts`；`package.json` `exports` 定義 `.`、`./style.css`（Vue 另有 `./tokens.css`） |
| 文件站 | Storybook build → GitHub Actions 發到 GitHub Pages：https://harryfan.github.io/chelaile-design-system-react/ |
| CI | `.github/workflows/ci.yml`：test → build → build-storybook → audit；main 才部署 Pages |
| 版本 | semver；改 spec 的 breaking change 兩 repo 同時升 major |
| 分支 | main 直推（單人專案）；多人時 PR + CI 綠才合併 |

### 哪些自動、哪些一定要人

| 自動化 | 必須人來 |
|---|---|
| 測試、型別、打包、Storybook build、audit（CI） | 改 `COMPONENT-SPEC.md`（= 改公開 API） |
| 產生器生五件套骨架 | 刪元件、刪目錄、改 `exports` / `peerDependencies` |
| agent 依 spec 實作元件、寫測試 | 審 agent 回報的規格偏差 |
| Storybook 部署 | push、發版、升 major |
| | 「看起來像 bug 但可能是刻意的」：先問再改 |

## 6. 已知限制 / 待辦

- Dark mode token 未做（spec §4 明列本輪不做）。
- 沒有 ESLint / Prettier 在 CI（本地有設定）。
- Storybook a11y addon、視覺回歸未上。
- Vue 版與本 repo 的 `COMPONENT-SPEC.md` 靠人工同步，沒有 CI diff 檢查（可加一個 job 拉另一個 repo 的 raw 檔比對）。
