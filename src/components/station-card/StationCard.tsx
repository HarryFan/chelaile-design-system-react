import { Button } from '../button';
import { useStationCard, type BusInfo } from './useStationCard';
import './station-card.css';

export interface StationCardProps {
  /** 站牌名稱 */
  stationName: string;
  /** 距離文字，例如「250 公尺」；有值才渲染距離區塊 */
  distance?: string;
  /** 班次列表；空陣列會顯示「目前沒有班次資訊」 */
  busList?: BusInfo[];
  /** 有給 actionText 才會顯示按鈕 */
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function StationCard({
  stationName,
  distance,
  busList = [],
  actionText,
  onAction,
  className,
}: StationCardProps) {
  const { hasDistance, isEmpty, rootClassName, buses, emptyText } = useStationCard({
    distance,
    busList,
    className,
  });

  return (
    <div className={rootClassName}>
      <div className="cl-station-card__header">
        <h3 className="cl-station-card__name">{stationName}</h3>
        {hasDistance && (
          <span className="cl-station-card__distance">
            <i className="cl-icon ri-map-pin-line" aria-hidden="true" />
            {distance}
          </span>
        )}
      </div>

      {isEmpty ? (
        <p className="cl-station-card__empty">{emptyText}</p>
      ) : (
        <ul className="cl-station-card__list">
          {buses.map((bus) => (
            <li key={bus.key} className={bus.className}>
              <span className="cl-station-card__route">{bus.routeName}</span>
              <span className="cl-station-card__time">{bus.timeText}</span>
            </li>
          ))}
        </ul>
      )}

      {actionText && (
        <div className="cl-station-card__footer">
          <Button variant="secondary" size="sm" round onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
