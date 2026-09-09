import { useMemo, useState, type ReactNode } from 'react';
import {
  AppHeader,
  Button,
  EmptyState,
  Loading,
  SearchBar,
  StationCard,
  StatusCard,
  TabBar,
  type BusInfo,
  type TabBarItem,
} from '../src';

/**
 * Demo 頁：與 Vue 版 `src/App.vue` 結構、文案、class 逐字相同，只差語法層。
 * 元件行為全部來自元件庫；這裡只負責組合與展示。
 */

const FRAMEWORK = 'React 19';
const TEST_COUNT = 55;
const REPO_URL = 'https://github.com/HarryFan/chelaile-design-system-react';
const SISTER_URL = 'https://github.com/HarryFan/chelaile-mobile-design-system';

const tabs: TabBarItem[] = [
  { key: 'nearby', label: '附近', icon: 'ri-map-pin-2-line' },
  { key: 'favorites', label: '收藏', icon: 'ri-star-line', badge: 3 },
  { key: 'messages', label: '訊息', icon: 'ri-notification-3-line', badge: 120 },
  { key: 'me', label: '我的', icon: 'ri-user-3-line' },
];

interface Station {
  name: string;
  distance: string;
  buses: BusInfo[];
}

const stations: Station[] = [
  {
    name: '捷運台北車站',
    distance: '250 公尺',
    buses: [
      { routeId: '307', routeName: '307', arrivalTime: '進站中', isArriving: true },
      { routeId: '262', routeName: '262', arrivalTime: '3 分' },
      { routeId: '1', routeName: '1', arrivalTime: '12 分' },
      { routeId: '652', routeName: '652' },
    ],
  },
  {
    name: '忠孝敦化',
    distance: '480 公尺',
    buses: [
      { routeId: '204', routeName: '204', arrivalTime: '5 分' },
      { routeId: '278', routeName: '278', arrivalTime: '8 分', isArriving: false },
    ],
  },
  {
    name: '南京復興',
    distance: '900 公尺',
    buses: [],
  },
];

const colorTokens = [
  ['--cl-primary', '#2d6dff', '品牌主色'],
  ['--cl-primary-dark', '#1a4dcc', '主色按下'],
  ['--cl-primary-light', '#e6eeff', '主色底'],
  ['--cl-success', '#52c41a', '成功'],
  ['--cl-warning', '#faad14', '警告'],
  ['--cl-danger', '#ff4d4f', '危險'],
  ['--cl-info', '#1890ff', '資訊'],
  ['--cl-text', '#1f2329', '主要文字'],
  ['--cl-text-secondary', '#8a8f99', '次要文字'],
  ['--cl-border', '#e5e6eb', '邊框'],
  ['--cl-background', '#f7f8fa', '頁面底'],
  ['--cl-card-background', '#ffffff', '卡片底'],
] as const;

const typeTokens = [
  ['title', '18 / 28', '站牌名稱、頁面標題'],
  ['subtitle', '16 / 24', '卡片標題'],
  ['body', '14 / 22', '內文、按鈕'],
  ['caption', '12 / 18', '輔助說明、時間'],
] as const;

const spacingTokens = [
  ['xs', 4],
  ['sm', 8],
  ['md', 16],
  ['lg', 24],
] as const;

function Section({
  index,
  title,
  lede,
  id,
  children,
}: {
  index: string;
  title: string;
  lede: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section className="demo-section demo-container" id={id}>
      <div className="demo-section__head">
        <div>
          <div className="demo-section__index">{index}</div>
          <h2>{title}</h2>
          <p>{lede}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Card({
  title,
  icon,
  tag,
  note,
  span = 6,
  children,
}: {
  title: string;
  icon: string;
  tag?: string;
  note?: ReactNode;
  span?: 4 | 6 | 8 | 12;
  children: ReactNode;
}) {
  return (
    <article className={`demo-card demo-card--${span}`}>
      <div className="demo-card__head">
        <h3 className="demo-card__title">
          <i className={icon} aria-hidden="true" />
          {title}
        </h3>
        {tag && <span className="demo-card__tag">{tag}</span>}
      </div>
      {note && <p className="demo-card__note">{note}</p>}
      <div className="demo-card__body">{children}</div>
    </article>
  );
}

export function App() {
  const [tab, setTab] = useState('nearby');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState('');
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const filtered = useMemo(() => {
    const q = searched.trim();
    if (!q) return stations;
    return stations.filter(
      (s) => s.name.includes(q) || s.buses.some((b) => b.routeName.includes(q)),
    );
  }, [searched]);

  const showOverlay = () => {
    setOverlay(true);
    window.setTimeout(() => setOverlay(false), 1400);
  };

  const fakeSubmit = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1400);
  };

  let screen: ReactNode;
  if (tab === 'nearby') {
    screen = (
      <>
        <SearchBar
          placeholder="搜尋站牌或路線"
          value={query}
          onChange={setQuery}
          onSearch={setSearched}
          label="搜尋"
        />
        {!dismissed && (
          <StatusCard
            tone="success"
            title="定位成功"
            description="已鎖定信義區，顯示 1 公里內站牌"
            actionText="知道了"
            onAction={() => setDismissed(true)}
          />
        )}
        <p className="demo-screen-title">附近站牌</p>
        {filtered.length === 0 ? (
          <EmptyState
            icon="ri-bus-line"
            title="找不到符合的站牌"
            description="換個關鍵字，或清空搜尋"
            actionText="清空搜尋"
            onAction={() => {
              setQuery('');
              setSearched('');
            }}
          />
        ) : (
          filtered.map((s) => (
            <StationCard
              key={s.name}
              stationName={s.name}
              distance={s.distance}
              busList={s.buses}
              actionText={s.buses.length ? '查看全部' : undefined}
            />
          ))
        )}
      </>
    );
  } else if (tab === 'favorites') {
    screen = (
      <EmptyState
        icon="ri-star-line"
        title="還沒有收藏的站牌"
        description="在站牌卡片上點「收藏」，下次打開直接看"
        actionText="去附近看看"
        onAction={() => setTab('nearby')}
      />
    );
  } else if (tab === 'messages') {
    screen = (
      <>
        <StatusCard tone="danger" title="服務中斷" description="系統維護中，到站資訊暫時無法取得" actionText="重試" onAction={showOverlay} />
        <StatusCard tone="warning" title="路線繞駛" description="307 因施工改道，忠孝敦化站暫停停靠" actionText="查看詳情" />
        <StatusCard tone="info" title="票價調整" description="9 月 15 日起，跨區段票價調整為 30 元" />
        <StatusCard tone="success" title="已到站" description="262 已抵達捷運台北車站" />
      </>
    );
  } else {
    screen = (
      <>
        <StatusCard tone="info" title="Harry Fan" description="悠遊卡 · 餘額 NT$ 320" />
        <p className="demo-screen-title">帳號</p>
        <Button block variant="secondary">通知設定</Button>
        <Button block variant="secondary">常用路線</Button>
        <Button block variant="ghost" onClick={showOverlay}>
          同步資料
        </Button>
        <Button block variant="danger" loading={loading} onClick={fakeSubmit}>
          {loading ? '登出中' : '登出'}
        </Button>
      </>
    );
  }

  return (
    <>
      <header className="demo-nav">
        <div className="demo-container demo-nav__inner">
          <a className="demo-brand" href="#top">
            <span className="demo-brand__mark">
              <i className="ri-bus-2-fill" aria-hidden="true" />
            </span>
            車來了 Design System
          </a>
          <nav className="demo-nav__links" aria-label="頁內導覽">
            <a href="#components">元件</a>
            <a href="#tokens">Tokens</a>
            <a href="#principles">規範</a>
          </nav>
          <span className="demo-nav__spacer" />
          <span className="demo-framework">
            <span className="demo-framework__dot" aria-hidden="true" />
            {FRAMEWORK}
          </span>
          <a className="demo-nav__cta" href={REPO_URL} target="_blank" rel="noreferrer">
            <i className="ri-github-fill" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </header>

      <section className="demo-hero demo-container" id="top">
        <div>
          <span className="demo-eyebrow">
            <i className="ri-git-branch-line" aria-hidden="true" />
            同一套規格 · React 與 Vue 逐字對齊
          </span>
          <h1 className="demo-hero__title">
            行動端設計系統，
            <br />
            <span>兩個框架，一份 API</span>
          </h1>
          <p className="demo-hero__lede">
            公車到站 app「車來了」的元件庫。8 個元件、每個都是五件套（畫面、hook、樣式、Storybook、行為測試），
            props、事件、class、無障礙語意在 React 與 Vue 兩邊逐字一致，只差語法層。
          </p>
          <div className="demo-hero__actions">
            <Button size="lg" round onClick={() => document.getElementById('components')?.scrollIntoView()}>
              看元件
            </Button>
            <Button size="lg" round variant="secondary" onClick={() => window.open(SISTER_URL, '_blank')}>
              另一個框架版本
            </Button>
          </div>
          <div className="demo-stats" aria-label="專案數字">
            <div className="demo-stat">
              <div className="demo-stat__value">8</div>
              <div className="demo-stat__label">元件，五件套齊全</div>
            </div>
            <div className="demo-stat">
              <div className="demo-stat__value">{TEST_COUNT}</div>
              <div className="demo-stat__label">行為測試，非 snapshot</div>
            </div>
            <div className="demo-stat">
              <div className="demo-stat__value">100%</div>
              <div className="demo-stat__label">樣式走 token，零硬編碼</div>
            </div>
          </div>
        </div>

        <div className="demo-device-wrap">
          <div className="demo-device" aria-label="互動示範：手機畫面">
            <div className="demo-device__screen">
              <div className="demo-device__island" aria-hidden="true" />
              <div className="demo-device__status" aria-hidden="true">
                <span>9:41</span>
                <span>
                  <i className="ri-signal-wifi-3-fill" />
                  <i className="ri-battery-2-charge-fill" />
                </span>
              </div>
              <AppHeader
                title={tabs.find((t) => t.key === tab)?.label}
                showBack={tab !== 'nearby'}
                onBack={() => setTab('nearby')}
                right={
                  <Button size="sm" variant="ghost" onClick={showOverlay}>
                    <i className="ri-refresh-line" aria-hidden="true" /> 重新整理
                  </Button>
                }
              />
              <div className="demo-device__body">{screen}</div>
              <div className="demo-device__footer">
                <TabBar items={tabs} active={tab} onChange={setTab} label="主導覽" />
                <div className="demo-device__home" aria-hidden="true" />
              </div>
              {overlay && <Loading overlay text="同步中" />}
            </div>
          </div>
        </div>
      </section>

      <Section
        id="components"
        index="01 / COMPONENTS"
        title="8 個元件"
        lede="每張卡片標題旁的一句話，是這個元件最重要的設計決策。細節與測試名稱在 Storybook。"
      >
        <div className="demo-grid">
          <Card
            title="Button"
            icon="ri-cursor-line"
            tag="4 變體 · 3 尺寸"
            note={
              <>
                <strong>loading 不設 disabled。</strong>
                disabled 會讓按鈕失去 Tab 焦點、被螢幕閱讀器跳過；改用 aria-busy + aria-disabled，點擊在 hook 內擋掉。
              </>
            }
          >
            <div className="demo-row">
              <Button>主要</Button>
              <Button variant="secondary">次要</Button>
              <Button variant="danger">危險</Button>
              <Button variant="ghost">幽靈</Button>
            </div>
            <div className="demo-row">
              <Button size="sm">小</Button>
              <Button size="md">中</Button>
              <Button size="lg">大</Button>
              <Button round>膠囊</Button>
              <Button disabled>停用</Button>
              <Button loading={loading} onClick={fakeSubmit}>
                {loading ? '送出中' : '按我 loading'}
              </Button>
            </div>
            <Button block>撐滿寬度</Button>
          </Card>

          <Card
            title="SearchBar"
            icon="ri-search-line"
            tag="IME 組字安全"
            note={
              <>
                <strong>中文輸入法組字期間不送查詢。</strong>
                注音打「南京」會經過「ㄋ」「ㄋㄢ」，用 compositionstart / end 擋掉，Enter 在組字中是選字不是送出。
              </>
            }
          >
            <SearchBar placeholder="試試用注音輸入站名" value={query} onChange={setQuery} onSearch={setSearched} label="搜尋" />
            <p className="demo-hint">
              即時值 <code>{query || '（空）'}</code>　debounce 300ms 後 <code>{searched || '（空）'}</code>
            </p>
          </Card>

          <Card
            title="StatusCard"
            icon="ri-alert-line"
            tag="role 依 tone"
            note={
              <>
                <strong>danger 才用 role=alert。</strong>
                其餘用 role=status + aria-live=polite，避免螢幕閱讀器被不重要的訊息一直打斷。
              </>
            }
          >
            <StatusCard tone="success" title="已到站" description="307 已進站，請準備上車" />
            <StatusCard tone="warning" title="路線繞駛" description="因施工改道，部分站點暫停停靠" actionText="查看詳情" />
            <StatusCard tone="danger" title="服務中斷" description="到站資訊暫時無法取得" actionText="重試" onAction={showOverlay} />
            <StatusCard tone="info" title="提示" description="拉到底可重新整理" />
          </Card>

          <Card
            title="StationCard"
            icon="ri-bus-line"
            tag="空值由父層負責"
            note={
              <>
                <strong>arrivalTime 缺值顯示「更新中」文字，不放 spinner。</strong>
                到站資訊是輪詢來的，缺值是常態不是錯誤；文字念得出來、也測得到。
              </>
            }
          >
            <StationCard stationName="捷運台北車站" distance="250 公尺" busList={stations[0].buses} actionText="查看全部" />
            <StationCard stationName="南京復興" busList={[]} />
          </Card>

          <Card
            title="TabBar"
            icon="ri-layout-bottom-line"
            tag="tablist + roving tabindex"
            note={
              <>
                <strong>只有選中的 tab 可被 Tab 鍵聚焦，←/→ 循環切換。</strong>
                點已選中的 tab 不發 change，父層不用自己 dedupe；badge 超過 99 顯示 99+。
              </>
            }
          >
            <div className="demo-preview">
              <TabBar items={tabs} active={tab} onChange={setTab} label="示範導覽" />
            </div>
            <p className="demo-hint">
              目前 <code>{tab}</code>。聚焦後按 ← → 試試。
            </p>
          </Card>

          <Card
            title="AppHeader"
            icon="ri-layout-top-line"
            tag="role=banner"
            note={
              <>
                <strong>路由跳轉是父層的事。</strong>
                元件只發 onBack；left 給了就取代返回鈕；沒 title 不渲染 h1。
              </>
            }
          >
            <div className="demo-preview">
              <AppHeader title="站牌詳情" onBack={showOverlay} right={<Button size="sm" variant="ghost">收藏</Button>} />
            </div>
            <div className="demo-preview">
              <AppHeader showBack={false} title="首頁" right={<Button size="sm" variant="ghost">設定</Button>} />
            </div>
          </Card>

          <Card
            title="EmptyState"
            icon="ri-inbox-line"
            tag="role=status"
            note={
              <>
                <strong>icon 收字串，不綁圖庫。</strong>
                任何 Remix Icon class 都能用，元件只負責 aria-hidden。
              </>
            }
          >
            <EmptyState icon="ri-bus-line" title="附近沒有站牌" description="換個地點或放大搜尋範圍" actionText="重新定位" onAction={showOverlay} />
          </Card>

          <Card
            title="Loading"
            icon="ri-loader-4-line"
            tag="reduced-motion 放慢不停"
            note={
              <>
                <strong>停止動畫會讓人以為卡死。</strong>
                prefers-reduced-motion 時只放慢轉速；overlay 版本蓋全螢幕。
              </>
            }
          >
            <div className="demo-row">
              <Loading size="sm" text="" />
              <Loading size="md" text="載入中" />
              <Loading size="lg" text="請稍候" />
              <Button size="sm" variant="secondary" onClick={showOverlay}>
                overlay 1.4s
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="tokens"
        index="02 / TOKENS"
        title="Design Tokens"
        lede="全部 CSS 變數、--cl- 前綴，兩個 repo 逐字相同。使用端覆蓋 --cl-primary 就能換主題，不必碰元件。"
      >
        <div className="demo-grid">
          <Card title="顏色" icon="ri-palette-line" span={12}>
            <div className="demo-swatches">
              {colorTokens.map(([name, hex, label]) => (
                <div className="demo-swatch" key={name}>
                  <div className="demo-swatch__chip" style={{ background: `var(${name})`, boxShadow: 'inset 0 0 0 1px rgba(31,35,41,.06)' }} />
                  <div className="demo-swatch__meta">
                    <b>{name}</b>
                    <span>
                      {label} · {hex}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="字級" icon="ri-font-size-2" span={6}>
            <div className="demo-type">
              {typeTokens.map(([name, size, use]) => (
                <div className="demo-type__row" key={name}>
                  <small>{name}</small>
                  <span style={{ fontSize: `var(--cl-font-size-${name})`, lineHeight: `var(--cl-line-height-${name})`, fontWeight: name === 'title' ? 700 : 400 }}>
                    捷運台北車站 307 進站中
                  </span>
                  <small>
                    {size} · {use}
                  </small>
                </div>
              ))}
            </div>
          </Card>

          <Card title="間距與圓角" icon="ri-ruler-line" span={6}>
            <div className="demo-spacing">
              {spacingTokens.map(([name, px]) => (
                <div className="demo-spacing__item" key={name}>
                  <div className="demo-spacing__bar" style={{ height: px * 3, width: 18 + px }} />
                  <span>
                    {name} · {px}px
                  </span>
                </div>
              ))}
            </div>
            <p className="demo-hint">
              4px 基準。圓角 <code>--cl-radius-card 12px</code>、<code>--cl-radius-pill 9999px</code>，陰影 <code>--cl-shadow-card</code>。
            </p>
          </Card>
        </div>
      </Section>

      <Section
        id="principles"
        index="03 / PRINCIPLES"
        title="規範能被強制執行，才叫規範"
        lede="元件庫的價值不在數量，在慣例能不能被工具逼著遵守。"
      >
        <div className="demo-principles">
          <div className="demo-principle">
            <i className="ri-stack-line" aria-hidden="true" />
            <h3>五件套，產生器生成</h3>
            <p>畫面、hook、樣式、Storybook、測試、出口。少一個就是 review 打回；用 CLI 生就沒有「忘了」。</p>
          </div>
          <div className="demo-principle">
            <i className="ri-flask-line" aria-hidden="true" />
            <h3>行為測試，不是 render 測試</h3>
            <p>「使用者做什麼 → 看到什麼」。只 render 等於沒測，改壞了也不會紅。</p>
          </div>
          <div className="demo-principle">
            <i className="ri-eye-line" aria-hidden="true" />
            <h3>無障礙是契約的一部分</h3>
            <p>role、aria-live、roving tabindex 寫進規格，兩個框架逐字相同，不是加分項。</p>
          </div>
          <div className="demo-principle">
            <i className="ri-translate-2" aria-hidden="true" />
            <h3>台灣產品的坑寫進測試</h3>
            <p>中文輸入法組字、到站資訊缺值、空狀態責任歸屬，這些英文教學不會教。</p>
          </div>
        </div>
        <pre className="demo-tree" style={{ marginTop: 16 }}>
          <b>src/components/station-card/</b>
          {'\n'}├── StationCard.tsx           <span>畫面</span>
          {'\n'}├── useStationCard.ts         <span>行為，可獨立測試</span>
          {'\n'}├── station-card.css          <span>只吃 var(--cl-*)</span>
          {'\n'}├── StationCard.stories.tsx   <span>Storybook 文件</span>
          {'\n'}├── __tests__/StationCard.test.tsx
          {'\n'}└── index.ts                  <span>對外出口</span>
        </pre>
      </Section>

      <footer className="demo-footer demo-container">
        <span>
          范綱栓 Harry Fan · {FRAMEWORK} 版 · <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
        </span>
        <span>
          姊妹專案：<a href={SISTER_URL} target="_blank" rel="noreferrer">Vue 3 + Vant 版</a>
        </span>
      </footer>
    </>
  );
}
