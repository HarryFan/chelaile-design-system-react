import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StationCard } from '../StationCard';
import type { BusInfo } from '../useStationCard';

const busList: BusInfo[] = [
  { routeId: '307', routeName: '307', arrivalTime: '2 分', isArriving: true },
  { routeId: '652', routeName: '652', arrivalTime: '8 分' },
];

describe('StationCard', () => {
  it('渲染站名與距離', () => {
    render(<StationCard stationName="市政府站" distance="250 公尺" busList={busList} />);
    expect(screen.getByRole('heading', { name: '市政府站' })).toBeInTheDocument();
    expect(screen.getByText('250 公尺')).toBeInTheDocument();
  });

  it('距離前置 ri-map-pin-line 圖示，對輔助科技隱藏', () => {
    const { container } = render(<StationCard stationName="市政府站" distance="250 公尺" />);
    const icon = container.querySelector('.cl-station-card__distance .cl-icon');
    expect(icon).toHaveClass('ri-map-pin-line');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('沒給 distance 就不渲染距離區塊', () => {
    const { container } = render(<StationCard stationName="市政府站" busList={busList} />);
    expect(container.querySelector('.cl-station-card__distance')).toBeNull();
  });

  it('渲染班次列表，isArriving 的列帶 is-arriving class', () => {
    const { container } = render(<StationCard stationName="市政府站" busList={busList} />);
    const items = container.querySelectorAll('.cl-station-card__bus');
    expect(items).toHaveLength(2);
    expect(items[0].className).toContain('is-arriving');
    expect(items[1].className).not.toContain('is-arriving');
    expect(screen.getByText('307')).toBeInTheDocument();
    expect(screen.getByText('2 分')).toBeInTheDocument();
  });

  it('arrivalTime 缺值時顯示「更新中」', () => {
    render(<StationCard stationName="市政府站" busList={[{ routeId: '307', routeName: '307' }]} />);
    expect(screen.getByText('更新中')).toBeInTheDocument();
  });

  it('busList 為空時顯示「目前沒有班次資訊」', () => {
    const { container } = render(<StationCard stationName="市政府站" busList={[]} />);
    expect(screen.getByText('目前沒有班次資訊')).toBeInTheDocument();
    expect(container.querySelector('.cl-station-card__list')).toBeNull();
  });

  it('有 actionText 才顯示按鈕，點擊會回呼', async () => {
    const onAction = vi.fn();
    const { rerender } = render(<StationCard stationName="市政府站" busList={busList} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <StationCard stationName="市政府站" busList={busList} actionText="查看站牌" onAction={onAction} />,
    );
    await userEvent.click(screen.getByRole('button', { name: '查看站牌' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
