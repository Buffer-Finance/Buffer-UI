import {
  activeTournamentDataReadOnlyAtom,
  isTableShownAtom,
} from '@Views/NoLoss-V3/atoms';
import { useAtomValue } from 'jotai';
import { NoLossSection } from '../TradePageNoLoss';
import { BuyTradeSection } from './BuyTradeSection';
import { MiddleSection } from './MiddleSection';

export const TradePageNoLoss: React.FC<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  const activeTournamentData = useAtomValue(activeTournamentDataReadOnlyAtom);
  const expanded = useAtomValue(isTableShownAtom);

  const isTournamentClosed =
    activeTournamentData !== undefined &&
    activeTournamentData.data !== undefined &&
    activeTournamentData.data.state.toLowerCase() === 'closed';

  return (
    <div
      className={`flex ${
        !isMobile ? '' : 'flex-col'
      } justify-start h-full w-[100%] bg-[#1C1C28]`}
    >
      {/* {!isMobile && <WinningPrizeModal />} */}
      {!isMobile && <NoLossSection isMobile={isMobile} />}

      <MiddleSection
        isExpanded={isTournamentClosed ? isTournamentClosed : expanded}
        shouldHideExpandBtn={isTournamentClosed}
        isMobile={isMobile}
        isTournamentClosed={isTournamentClosed}
        tournament={activeTournamentData?.data}
      />
      {!isMobile && !isTournamentClosed && <BuyTradeSection />}
    </div>
  );
};
