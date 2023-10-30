import { MarketChart } from '@Views/TradePage/Views/MarketChart';
import { StatusBar } from '../StatusBar';

export const MiddleSection = () => {
  return (
    <div>
      <StatusBar isMobile={false} />
      <MarketChart />
    </div>
  );
};
