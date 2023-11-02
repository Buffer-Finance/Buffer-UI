import { NoLossSection } from '../TradePageNoLoss';
import { WinningPrizeModal } from '../WinningPrizeModal';
import { BuyTradeSection } from './BuyTradeSection';
import { MiddleSection } from './MiddleSection';

export const TradePageNoLoss = () => {
  return (
    <div className="flex justify-start h-full w-[100%] bg-[#1C1C28]">
      <WinningPrizeModal />
      <NoLossSection />
      <MiddleSection />
      <BuyTradeSection />
    </div>
  );
};
