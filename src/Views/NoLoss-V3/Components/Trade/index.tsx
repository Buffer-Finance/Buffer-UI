import { NoLossSection } from '../TradePageNoLoss';
import { WinningPrizeModal } from '../WinningPrizeModal';
import { BuyTradeSection } from './BuyTradeSection';
import { MiddleSection } from './MiddleSection';

export const TradePageNoLoss: React.FC<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  return (
    <div
      className={`flex ${
        !isMobile ? '' : 'flex-col'
      } justify-start h-full w-[100%] bg-[#1C1C28]`}
    >
      {!isMobile && <WinningPrizeModal />}
      {!isMobile && <NoLossSection isMobile={isMobile} />}
      <MiddleSection isMobile={isMobile} />
      {!isMobile && <BuyTradeSection />}
    </div>
  );
};
