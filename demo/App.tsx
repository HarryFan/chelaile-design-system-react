import { useState } from 'react';
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

const tabs: TabBarItem[] = [
  { key: 'nearby', label: '附近', icon: '📍' },
  { key: 'favorites', label: '收藏', icon: '⭐', badge: 3 },
  { key: 'messages', label: '訊息', icon: '💬', badge: 120 },
  { key: 'me', label: '我的', icon: '👤' },
];

const buses: BusInfo[] = [
  { routeId: '307', routeName: '307', arrivalTime: '進站中', isArriving: true },
  { routeId: '262', routeName: '262', arrivalTime: '3 分' },
  { routeId: '1', routeName: '1', arrivalTime: '12 分' },
  { routeId: '652', routeName: '652' },
];

export function App() {
  const [tab, setTab] = useState('nearby');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState('');
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);

  const showOverlay = () => {
    setOverlay(true);
    setTimeout(() => setOverlay(false), 1500);
  };

  return (
    <div className="demo-phone">
      <AppHeader
        title="Demo"
        showBack={false}
        right={<Button size="sm" variant="ghost" onClick={() => alert('右側動作')}>更多</Button>}
      />

      <main className="demo-body">
        <section className="demo-section">
          <h2>SearchBar</h2>
          <SearchBar
            placeholder="搜尋站牌或路線"
            value={query}
            onChange={setQuery}
            onSearch={setSearched}
            label="搜尋"
          />
          <p style={{ fontSize: 12, color: 'var(--cl-text-secondary)', margin: '6px 0 0' }}>
            即時值：{query || '（空）'}　debounce 後：{searched || '（空）'}
          </p>
        </section>

        <section className="demo-section">
          <h2>Button</h2>
          <div className="demo-row">
            <Button>primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="danger">danger</Button>
            <Button variant="ghost">ghost</Button>
          </div>
          <div className="demo-row" style={{ marginTop: 8 }}>
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
            <Button round>round</Button>
            <Button disabled>disabled</Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
            >
              {loading ? '載入中' : '點我 loading'}
            </Button>
          </div>
          <div style={{ marginTop: 8 }}>
            <Button block>block</Button>
          </div>
        </section>

        <section className="demo-section">
          <h2>StatusCard</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <StatusCard tone="success" title="已到站" description="307 已進站，請準備上車" />
            <StatusCard tone="warning" title="路線繞駛" description="因施工改道，部分站點暫停停靠" actionText="查看詳情" onAction={() => alert('詳情')} />
            <StatusCard tone="danger" title="服務中斷" description="系統維護中，到站資訊暫時無法取得" actionText="重試" onAction={() => alert('重試')} />
            <StatusCard tone="info" title="提示" description="拉到底可重新整理" />
          </div>
        </section>

        <section className="demo-section">
          <h2>StationCard</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <StationCard stationName="捷運台北車站" distance="250 公尺" busList={buses} actionText="查看全部" onAction={() => alert('全部班次')} />
            <StationCard stationName="忠孝敦化" busList={[]} />
          </div>
        </section>

        <section className="demo-section">
          <h2>Loading</h2>
          <div className="demo-row">
            <Loading size="sm" text="" />
            <Loading size="md" text="載入中" />
            <Loading size="lg" text="請稍候" />
            <Button size="sm" variant="secondary" onClick={showOverlay}>overlay 1.5s</Button>
          </div>
        </section>

        <section className="demo-section">
          <h2>EmptyState</h2>
          <EmptyState icon="🚌" title="附近沒有站牌" description="換個地點或放大搜尋範圍" actionText="重新定位" onAction={() => alert('定位')} />
        </section>
      </main>

      <div style={{ position: 'sticky', bottom: 0 }}>
        <TabBar items={tabs} active={tab} onChange={setTab} label="主導覽" />
      </div>

      {overlay && <Loading overlay text="處理中" />}
    </div>
  );
}
