import { NoLossSection } from '../TradePageNoLoss';
import { BuyTradeSection } from './BuyTradeSection';
import { MiddleSection } from './MiddleSection';

export const TradePageNoLoss = () => {
  return (
    <div className="flex h-full justify-between w-[100%] bg-[#1C1C28]">
      <NoLossSection />
      <MiddleSection />
      <BuyTradeSection />
    </div>
  );
};
