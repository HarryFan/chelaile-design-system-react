# DEVLOG — chelaile-design-system-react

> 開發脈絡紀錄。每一輪寫：起點是什麼狀態、做了什麼決定、哪裡卡、**AI 哪裡判斷錯、怎麼發現、怎麼修**。
> 這份不是 changelog（那看 git log），是「為什麼這樣走」。時間倒序。

## 第二輪 · 2026-09-09 下午 — 發布、規格入庫、文件（Claude Code / Claude Fable 5.1）

### 起點

第一輪已經把 8 個元件、46 個測試、lib build、d.ts 全做完，**但一行都沒 commit**——GitHub 上只看得到初版 3 個元件。這是 AI session 中斷常見的狀態：工作做完、沒收尾。

### 做了什麼

- 先驗證再 commit：`vitest run` 46/46、`tsc --noEmit`、`vite build`、`tsc -p tsconfig.build.json` 全綠才 `git add <明確路徑>`。
- `COMPONENT-SPEC.md` 原本只在兩 repo 的母目錄，GitHub 上點不到 → 各放一份逐字相同副本，檔頭註明須同步。
- README「同目錄的 chelaile-mobile-design-system」在 GitHub 上沒有「同目錄」這回事 → 改成連結。
- 加 `AGENTS.md` / `docs/` / CI / Storybook Pages（本檔所在的這個 commit）。
- Vue 版同日完成趨同（見該 repo DEVLOG），本 repo 是行為基準，Vue agent 拿這裡的 `src/components/*` 1:1 翻譯。

### Vue 版對齊時發現、與本 repo 有關的事

- Vue 版 `StatusCard.description` 只收 `string`，本 repo 收 `ReactNode`。接受不一致，因為 Vue 沒有對應物；spec 只承諾「description 為空不渲染」這個行為，型別寬窄是語法層。
- Vue 版沒有 `className` prop（attr fallthrough 天生會做）。本 repo 保留 `className`，同理是語法層。

---

## 第一輪 · 2026-09-09 上午 — 雙框架趨同（另一個 Claude Code session，模型未記錄）

> 以下由當時的 `開發手札.html` 轉成 markdown，內容照原樣，只改格式。原 HTML 已刪，避免兩份來源。

### 起點診斷

| 項目 | 狀態 | 說明 |
|---|---|---|
| 元件 | 3 完成 | Button / SearchBar / StatusCard，六件套齊全（.tsx、hook、css、story、test、index） |
| 測試 | 15 通過 | 行為測試，非 render-only；含中文輸入法組字、loading 保留焦點、danger→role=alert |
| Token | 單一來源 | `src/styles/tokens.css`，`--cl-*` CSS 變數，零樣式框架依賴 |
| Storybook | v9 已設 | `.storybook/main.ts` + `preview.ts`，無 addon |
| 發布面 | 缺 | 無 main/module/exports/types、無 lib build、`npm run build` 不可用；React 是 dependency 不是 peer |
| 元件廣度 | 落後 Vue | Vue 端有 StationCard / TabBar / AppHeader / EmptyState / Loading，這裡沒有 |

### 趨同決策

- **React 為慣例基準**：Vue 端向 React 的五件套、BEM class、`--cl-*` token、a11y 語意靠攏。理由：React 版是後寫的，README 已記錄從 Vue 版學到的教訓（空值由父層負責、loading 不設 disabled）。
- 共用元件清單 8 個：Button、SearchBar、StatusCard、StationCard、TabBar、AppHeader、EmptyState、Loading。地圖類、RoutePlanner、NewsFeedCard、Toast/Dialog **明列為本輪不做**——先寫下不做什麼，才不會被 AI 順手長出來。
- API 統一規則：「有 `actionText` 才顯示按鈕」取代 `showAction` 布林；`arrivalTime` 缺值顯示「更新中」文字而非 spinner（兩邊可測、一致）。
- icon 不綁圖庫：TabBar / EmptyState 的 icon 收字串，避免 React 端被迫裝 iconify。

### 派工

| 批次 | 內容 | 狀態 |
|---|---|---|
| A | StationCard、TabBar、AppHeader（五件套 + 行為測試） | 完成 |
| B | EmptyState、Loading（五件套 + 行為測試） | 完成 |
| C | `src/index.ts` 接上 8 個元件 export；`vite build.lib`；`package.json` 加 exports / peerDependencies / files | 完成 |

A、B 並行時互不碰 `src/index.ts`，避免同檔衝突；由主線最後統一接線。

### 完成明細

| 元件 | 測試數 | 關鍵行為 |
|---|---|---|
| Button | 5 | loading 不設 disabled，aria-busy + aria-disabled |
| SearchBar | 5 | 中文組字期間不送查詢；Enter 組字中是選字 |
| StatusCard | 5 | danger→role=alert，其餘 role=status |
| StationCard | 6 | arrivalTime 缺值顯示「更新中」；空清單顯示「目前沒有班次資訊」；actionText 才出按鈕 |
| TabBar | 8 | tablist / tab / aria-selected；roving tabindex；←/→ 循環並移焦；點已選中不發 change；badge 99+ |
| AppHeader | 7 | role=banner；h1 只在 title 非空白時渲染；left 覆蓋返回鈕 |
| EmptyState | 5 | role=status；icon aria-hidden；actionText 才出按鈕 |
| Loading | 5 | role=status + aria-live=polite；三尺寸；overlay；reduced-motion 放慢不停 |

合計 46 測試、`tsc --noEmit` 乾淨、Storybook build 成功。

- 套件化：`vite build.lib` 輸出 `dist/chelaile-design-system.{js,cjs,css}` + sourcemap；`tsconfig.build.json` 只出 `.d.ts`；React / ReactDOM 改為 peerDependencies（^18 || ^19）。
- 產生器：`create-component.mjs` 的 `index.ts` 樣板補上 `UseXxxOptions` 型別 export，並在 `src/index.ts` 自動掛 hook；用 `zz-probe` 驗證過後清掉。

### 踩坑記錄

- 兩 repo 起始都沒 `node_modules`。本 repo `npm install` 一次過；Vue 端撞 storybook 版本錯配與損壞的 npm cache（見該 repo DEVLOG）。

### 待辦（留給下一輪）

- Dark mode token 區塊。
- Storybook 加 a11y addon，讓 role / aria 規則有自動檢查。
- ESLint / Prettier 進 CI。

---

## 更早 · 2026-08-14 `0065a03` — 初版

從 Vue 版把「元件規範」而不是程式碼移植過來。commit body 直接寫了五條設計決策（loading 不設 disabled、IME 組字、tone→role、空值由父層、CSS 變數不用 Tailwind），這幾條後來全部進了 `COMPONENT-SPEC.md`。
