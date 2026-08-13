# Chelaile Design System — React

行動端設計系統的 **React + TypeScript** 版本。同一套設計 token 與元件規範，我先用 Vue 3 實作過一次（[chelaile-mobile-design-system](https://github.com/HarryFan/chelaile-mobile-design-system)），這個 repo 是把同樣的工程規範搬到 React 生態。

| | Vue 版 | React 版（本 repo） |
|---|---|---|
| 框架 | Vue 3 + Vant 4 | React 19 |
| 樣式 | Tailwind CSS | CSS 變數（零樣式框架依賴） |
| 邏輯拆分 | composable (`useXxx.js`) | hook (`useXxx.ts`) |
| 文件 | Storybook | Storybook 9 |
| 測試 | Vitest + Vue Test Utils | Vitest + Testing Library |
| 腳手架 | `scripts/create-component.js` | `scripts/create-component.mjs` |

---

## 這個 repo 想證明的事

元件庫的價值不在元件數量，在**規範能不能被強制執行**。所以每個元件都是五件套：

```
src/components/search-bar/
├── SearchBar.tsx                    畫面
├── useSearchBar.ts                  行為（可獨立測試、可被其他元件複用）
├── search-bar.css                   樣式（只吃 token，不寫死色碼）
├── SearchBar.stories.tsx            Storybook 文件
├── __tests__/SearchBar.test.tsx     單元測試
└── index.ts                         對外出口
```

少寫任何一個都會在 code review 被看見。而且**規範寫在文件裡沒人照做，寫成生成器就沒有選擇**：

```bash
npm run new -- status-banner
# 產出 StatusBanner.tsx / useStatusBanner.ts / status-banner.css
#      StatusBanner.stories.tsx / __tests__/StatusBanner.test.tsx / index.ts
# 並自動掛進 src/index.ts
```

---

## 快速開始

```bash
npm install
npm run storybook     # 元件文件站 http://localhost:6006
npm test              # 15 個測試
npm run typecheck     # tsc --noEmit
npm run new -- <name> # 依規範生成新元件
```

---

## 元件

### Button
四種變體（primary / secondary / danger / ghost）、三種尺寸、round、block、loading。

**設計決策：`loading` 不設 `disabled` attribute。**
`disabled` 會讓按鈕無法被 Tab 聚焦，螢幕閱讀器直接跳過——使用者按了送出卻什麼都沒聽到，不知道是在處理中還是壞了。這裡改用 `aria-busy` + `aria-disabled`，點擊行為在 hook 裡擋掉，按鈕仍可聚焦。

### SearchBar
受控／非受控皆支援、debounce 查詢、清除鈕。

**設計決策：處理中文輸入法組字。**
注音、拼音在組字過程中會不斷觸發 `change`，此時送查詢會打到一堆沒有意義的半成品字串（打「南京」的過程中會送出「ㄋ」「ㄋㄢ」…）。用 `compositionstart` / `compositionend` 標記狀態，組字期間只更新畫面、不對外送出；`Enter` 在組字中是選字不是送出，也一併擋掉。

這是台灣／中文產品一定會遇到、但英文教學不會教的坑，所以特別寫進測試。

### StatusCard
狀態卡，四種語意色調，可選操作按鈕。

**設計決策：`role` 依 tone 而定。**
`danger` 用 `role="alert"` + `aria-live="assertive"`（螢幕閱讀器立刻打斷朗讀），其餘用 `role="status"` + `aria-live="polite"`（等目前朗讀完再補）。全部設成 alert 會讓使用者被不重要的訊息反覆打斷。

**空值占位由父層負責**：`description` 沒給就不渲染那個節點，元件不自己補 `--`。這條規範來自 Vue 版踩過的坑——共用元件與父層各兜一次空值，最後沒人知道該改哪一層。

---

## 為什麼樣式用 CSS 變數而不是 Tailwind

Vue 版用 Tailwind，這版刻意不用。元件庫要能被任何專案安裝，不該強迫使用端也裝 Tailwind、複製一份 config 才能顯示正常。改用 CSS 變數之後：

- 使用端想換主題色，覆蓋 `--cl-primary` 即可，不必碰元件
- 元件庫本身零樣式框架依賴
- 代價是失去 Tailwind 的原子類開發速度——這是**刻意的取捨**，元件庫的使用者體驗優先於作者的開發速度

---

## 技術棧

React 19 · TypeScript 5.9 · Vite 7 · Storybook 9 · Vitest 3 · Testing Library

---

## 關於作者

范綱栓 Harry Fan — 15 年前端工程師，主力 Vue 3 生態（Vue 2 → Vue 3 全站升級、Element UI → Ant Design Vue 遷移、企業級元件庫從零建置）。

這個 repo 是把同一套元件庫規範在 React 生態重做一次。框架語法可以查，**元件邊界、狀態管理拆分、無障礙語意、空值責任歸屬這些判斷才是共通的**——這是我想在這個 repo 裡展示的東西。

https://github.com/HarryFan
