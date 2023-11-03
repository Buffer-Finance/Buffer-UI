import { useMedia } from 'react-use';
import { NoLossSection } from '../TradePageNoLoss';
import { WinningPrizeModal } from '../WinningPrizeModal';
import { BuyTradeSection } from './BuyTradeSection';
import { MiddleSection } from './MiddleSection';

export const TradePageNoLoss = () => {
  const isNotMobile = useMedia('(min-width:1200px)');
  return (
    <div className="flex justify-start h-full w-[100%] bg-[#1C1C28]">
      <WinningPrizeModal />
      <NoLossSection isMobile={!isNotMobile} />
      <MiddleSection />
      <BuyTradeSection />
    </div>
  );
};
