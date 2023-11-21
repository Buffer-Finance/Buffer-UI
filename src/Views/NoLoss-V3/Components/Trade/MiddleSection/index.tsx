import { ItournamentData } from '@Views/NoLoss-V3/types';
import { MarketChart } from '@Views/TradePage/Views/MarketChart';
import { miscsSettingsAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { PinnedMarkets } from './PinnedMarkets';
import { StatusBar } from './StatusBar';
import { Tables } from './Tables';

export const MiddleSection: React.FC<{
  isMobile: boolean;
  isExpanded: boolean;
  shouldHideExpandBtn: boolean;
  isTournamentClosed: boolean;
  tournament: ItournamentData | undefined;
}> = ({
  isMobile,
  isExpanded,
  shouldHideExpandBtn,
  isTournamentClosed,
  tournament,
}) => {
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);

  return (
    <MiddleSectionBackground>
      {!isTournamentClosed && (
        <>
          {!isMobile && showFavoriteAsset && <PinnedMarkets />}
          <StatusBar isMobile={isMobile} />
          <MarketChart />
        </>
      )}
      {isTournamentClosed && tournament && (
        <div className="text-f15 my-4">{tournament.tournamentMeta.name}</div>
      )}
      {!isMobile && (
        <Tables
          isExpanded={isExpanded}
          shouldHideExpandBtn={shouldHideExpandBtn}
          isTournamentClosed={isTournamentClosed}
        />
      )}
    </MiddleSectionBackground>
  );
};

const MiddleSectionBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  width: 100%;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
`;
