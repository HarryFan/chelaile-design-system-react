import { useMemo } from 'react';
import { cn } from '../../utils/cn';

export interface BusInfo {
  routeId: string;
  routeName: string;
  /** 預估到站時間文字，例如「3 分」；沒給就顯示「更新中」 */
  arrivalTime?: string;
  /** 即將進站，會在列上加 `is-arriving` */
  isArriving?: boolean;
}

export interface UseStationCardOptions {
  distance?: string;
  busList: BusInfo[];
  className?: string;
}

/** arrivalTime 缺值時顯示的文字。刻意用文字而非 spinner，Vue / React 兩邊一致好測。 */
export const UPDATING_TEXT = '更新中';
/** busList 為空時顯示的文字 */
export const EMPTY_TEXT = '目前沒有班次資訊';

/**
 * 站牌卡的顯示推導。
 *
 * 「有距離才顯示距離區塊」「沒有班次要顯示空狀態」「到站時間缺值顯示更新中」
 * 這三條規則放在元件裡很容易在改版時漏掉其中一條，抽出來讓行為只有一份。
 */
export function useStationCard(options: UseStationCardOptions) {
  const { distance, busList, className } = options;

  const hasDistance = distance !== undefined && distance !== '';
  const isEmpty = busList.length === 0;

  const rootClassName = useMemo(
    () => cn('cl-station-card', isEmpty && 'is-empty', className),
    [isEmpty, className],
  );

  const buses = useMemo(
    () =>
      busList.map((bus) => ({
        key: bus.routeId,
        routeName: bus.routeName,
        className: cn('cl-station-card__bus', bus.isArriving && 'is-arriving'),
        timeText: bus.arrivalTime ? bus.arrivalTime : UPDATING_TEXT,
        isArriving: Boolean(bus.isArriving),
      })),
    [busList],
  );

  return {
    hasDistance,
    isEmpty,
    rootClassName,
    buses,
    emptyText: EMPTY_TEXT,
  };
}
