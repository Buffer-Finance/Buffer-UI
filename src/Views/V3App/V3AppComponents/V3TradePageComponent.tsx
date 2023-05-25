import { V3MultiChart } from './V3Multichart';
import { useSwitchPoolForTrade } from '../Utils/useSwitchPoolForTrade';

export const V3AppTradePageComponent = () => {
  useSwitchPoolForTrade();
  return (
    <main className="flex  w-[100vw]">
      <V3MultiChart />
    </main>
  );
};
