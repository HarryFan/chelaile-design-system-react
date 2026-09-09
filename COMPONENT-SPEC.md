# 車來了設計系統 — 雙框架趨同規格（Vue / React 共用）
> 本檔在 `chelaile-mobile-design-system` 與 `chelaile-design-system-react` 兩個 repo 各放一份，內容逐字相同；改規格時兩邊同步更新，再改元件。

> 這份是 `chelaile-mobile-design-system`（Vue 3 + Vant 4）與 `chelaile-design-system-react`（React 19）
> 的**單一 API 真相**。兩邊的元件 props / 事件 / 行為 / class 命名 / token 必須一致；
> 只有語法層（`onX` vs `@x`、hook vs composable、`children` vs `slot`）允許不同。

## 0. 共用慣例

| 項目 | React | Vue |
|---|---|---|
| 目錄 | `src/components/<kebab>/` | 同 |
| 檔案 | `Pascal.tsx` / `usePascal.ts` / `pascal.css` / `Pascal.stories.tsx` / `__tests__/Pascal.test.tsx` / `index.ts` | `Pascal.vue` / `usePascal.ts` / `Pascal.stories.ts` / `__tests__/Pascal.test.ts` / `index.ts`（樣式寫在 SFC `<style>`，不用 scoped，class 命名同 React） |
| root class | `cl-<kebab>` | 同 |
| BEM | `cl-<kebab>__part`、modifier `cl-<kebab>--<mod>`、狀態 `is-<state>` | 同 |
| token | 只用 `var(--cl-*)`，禁止硬編碼色碼 | 同（Vue 亦可用 Tailwind class，但 Tailwind 色必須是 map 到 `--cl-*` 的 `primary/success/...`，不用 `bg-green-50` 這種原生色） |
| 空值 | 父層負責擋空值；元件不自己渲染 `--` | 同 |
| 事件 | `onAction` | `emit('action')` |
| 語言 | 註解 / story / 測試名稱繁體中文 | 同 |
| 測試 | 行為測試，不是只 render；每元件 ≥ 4 個 | 同 |
| export | 元件、Props 型別、hook/composable、hook 相關型別 | 同 |

## 1. Design Tokens（兩邊逐字相同，檔名 `src/styles/tokens.css`）

React 現有 `tokens.css` 為準。Vue 端新增同名檔並讓 `tailwind.config.js` 的 color / spacing / radius / fontSize 全部 map 到 `var(--cl-*)`。
舊的 `--color-primary: 45,109,255` RGB 三元組保留為別名（避免現有 Tailwind class 壞掉），但新元件一律用 `--cl-*`。

## 2. 元件清單（8 個，兩邊都要有）

### 2.1 Button
- props: `variant: 'primary'|'secondary'|'danger'|'ghost'` = primary；`size: 'sm'|'md'|'lg'` = md；`round`、`block`、`loading`、`disabled` 布林；`htmlType: 'button'|'submit'|'reset'` = button
- 行為：`loading` 時**不設 disabled 屬性**（保留 Tab 焦點），改用 `aria-busy="true"` + `aria-disabled="true"`，click 在 hook 內擋掉。`disabled` 才真的設 disabled。
- class：`cl-button cl-button--{variant} cl-button--{size} [cl-button--round] [cl-button--block] [is-loading]`；spinner `cl-button__spinner`（`aria-hidden`）；內容 `cl-button__content`
- Vue：內容用 default slot；emit `click`（loading/disabled 時不 emit）。**不要用 van-button**，自己畫（React 也是自畫，樣式才會一致）。

### 2.2 SearchBar
- props：`value`（受控；Vue 用 `modelValue` + `update:modelValue`）、`defaultValue`、`placeholder` = '搜尋站牌或路線'、`label` = '搜尋'（視覺隱藏的 a11y label）、`disabled`、`autoFocus`、`debounceMs` = 300
- 事件：`change(value)` 每次真實值變動；`search(value)` debounce 後；`clear()`
- 行為：中文輸入法 `compositionstart`/`compositionend` 期間不觸發 change/search；組字中按 Enter 視為選字不是送出；Enter 立即觸發 `search`（略過 debounce）；卸載清 timer；有值才顯示清除鈕
- class：`cl-search-bar [is-disabled]`，`__label`、`__input`、`__clear`

### 2.3 StatusCard
- props：`tone: 'success'|'warning'|'danger'|'info'` = info；`title` 必填；`description?`；`actionText?`；事件 `action`
- 行為：`danger` → `role="alert"` + `aria-live="assertive"`；其餘 `role="status"` + `aria-live="polite"`。有 `actionText` 才渲染按鈕（用本庫的 Button，variant secondary、size sm、round）。`description` 為空/undefined 時不渲染 `<p>`。
- class：`cl-status-card cl-status-card--{tone}`，`__icon`（aria-hidden）、`__body`、`__title`、`__desc`
- Vue：現有 `GeoStatusCard` 改成 StatusCard 的薄包裝：`status: success|warning|error|loading` → tone `success|warning|danger|info`，`statusText` → `description`，`showAction && actionText` → `actionText`。GeoStatusCard 既有測試要改成對應新 DOM（`.cl-status-card--danger` 取代 `bg-red-50`），但測試意圖保留。

### 2.4 StationCard
- 型別：`BusInfo { routeId: string; routeName: string; arrivalTime?: string; isArriving?: boolean }`
- props：`stationName` 必填；`distance?`；`busList: BusInfo[]` = []；`actionText?`；事件 `action`
- 行為：`distance` 有值才渲染距離區塊；每筆 bus 渲染 `cl-station-card__bus`，`isArriving` 加 `is-arriving`；`arrivalTime` 有值顯示，否則顯示「更新中」文字（不用 spinner，兩邊一致好測）；`busList` 空 → 顯示「目前沒有班次資訊」；`actionText` 有值才顯示 Button（secondary/sm/round）。**移除舊 `showAction` prop**，Vue 測試同步改。
- class：`cl-station-card`，`__header`、`__name`、`__distance`、`__list`、`__bus [is-arriving]`、`__route`、`__time`、`__empty`、`__footer`

### 2.5 TabBar
- 型別：`TabBarItem { key: string; label: string; icon?: string /* emoji 或文字，先不綁 icon 庫 */; badge?: number }`
- props：`items: TabBarItem[]` 必填；`active: string`（Vue：`modelValue` + `update:modelValue`）；事件 `change(key)`
- 行為：`role="tablist"`，每個 tab `role="tab"` + `aria-selected`；點擊已選中的 tab 不發 change；鍵盤 ←/→ 循環切換（在 hook 內處理）；`badge > 99` 顯示 `99+`
- class：`cl-tab-bar`，`__item [is-active]`、`__icon`、`__label`、`__badge`
- Vue：取代 `common-app-tab-bar`（目錄改名 `tab-bar`，硬編碼五個 tab 移除）。

### 2.6 AppHeader
- props：`title?`；`showBack` = true；`backLabel` = '返回'；事件 `back`
- slot/children：`left`（覆蓋返回鈕）、`right`（動作區）；React 用 `left?: ReactNode`、`right?: ReactNode`
- 行為：`<header role="banner">`；返回鈕 `aria-label={backLabel}`；title 用 `<h1>`；沒 title 不渲染 h1
- class：`cl-app-header`，`__left`、`__back`、`__title`、`__right`
- Vue：取代 `common-app-header`（目錄改名 `app-header`），移除 `showSearch`/`backUrl`（路由跳轉是父層的事）。

### 2.7 EmptyState
- props：`title` = '暫無資料'；`description?`；`icon?`（字串，預設 '📭'，`aria-hidden`）；`actionText?`；事件 `action`
- 行為：`role="status"`；`actionText` 有值才顯示 Button（primary/sm/round）
- class：`cl-empty-state`，`__icon`、`__title`、`__desc`
- Vue：從 `components/EmptyState.vue` 搬到 `components/empty-state/` 五件套；改 `<script setup lang="ts">`；移除 `@iconify/vue` 依賴。

### 2.8 Loading
- props：`text` = '載入中…'；`size: 'sm'|'md'|'lg'` = md；`overlay` = false
- 行為：`role="status"` + `aria-live="polite"`；spinner `aria-hidden`；`overlay` 時 root 加 `is-overlay`（fixed 全螢幕半透明）
- class：`cl-loading [cl-loading--{size}] [is-overlay]`，`__spinner`、`__text`
- Vue：從 `components/Loading.vue` 搬到 `components/loading/` 五件套，`<script setup lang="ts">`，不用 van-loading。

## 3. 各 repo 入口

- React `src/index.ts`：import tokens.css，export 8 個元件 + Props 型別 + hook + `BusInfo` / `TabBarItem` / `StatusTone` / `ButtonVariant` / `ButtonSize`
- Vue `src/components/index.ts`：同上 + 保留 `install(app)` 全域註冊；另補 `src/index.ts` re-export
- 兩邊 package.json：`main`/`module`/`types`/`exports`、`peerDependencies`（react / vue）、`files: ["dist"]`；vite `build.lib` 輸出 es + cjs

## 4. 不在本輪範圍

- 地圖類（MapOverlayPOI / MapControl / MapMarker）、RoutePlanner、NewsFeedCard、Toast/Dialog（暫時用 Vant / 自家 app 層）
- Dark mode token
- Vue 端 `AudioPlayer.vue`、`services/bookService.ts`、`styles/variables.scss`：非本設計系統範圍，不動也不 export
