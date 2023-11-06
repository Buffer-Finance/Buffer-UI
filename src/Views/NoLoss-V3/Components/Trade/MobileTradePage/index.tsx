import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { useTournamentDataFetch } from '@Views/NoLoss-V3/Hooks/useTournamentDataFetch';
import { activeMarketDataAtom } from '@Views/NoLoss-V3/atoms';
import { InoLossMarket } from '@Views/NoLoss-V3/types';
import { MobileChartControlls } from '@Views/TradePage/Components/MobileView/MobileChartControlls';
import { ViewOnlyInputs } from '@Views/TradePage/Components/MobileView/ViewOnlyInputs';
import { MultiResolutionChart } from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { BuyButtons } from '../BuyTradeSection/BuyButtons';
import { PayoutProfit } from '../BuyTradeSection/PayoutProfit';
import { LeaderboardTable } from '../MiddleSection/Tables/LeaderboardTable';
import { MarketPicker } from './MarketPicker';
import { Tabs, mobileTradePageTabs } from './Tabs';
import { TournamentDataMobile } from './TournamentData';

const TradePageMobile: React.FC<any> = ({}) => {
  useTournamentDataFetch();

  const activeMarket = useAtomValue(activeMarketDataAtom);
  const activeTab = useAtomValue(mobileTradePageTabs);

  if (!activeMarket)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[100px] rounded-lg lc"
      />
    );

  return (
    <div className="flex flex-col  h-full w-full m-auto px-3 a600:w-[500px]">
      <Tabs />
      <HorizontalTransition value={activeTab === 'trade' ? 0 : 1}>
        <Trade activeMarket={activeMarket} />
        <LeaderboardTable onlyShow={[0, 1, 3, 4, 5]} isMobile />
      </HorizontalTransition>
      {/* {activeTab === 'trade' ?  : <></>} */}
    </div>
  );
};

export { TradePageMobile };

const Trade: React.FC<{
  activeMarket: InoLossMarket;
}> = ({ activeMarket }) => {
  return (
    <>
      <TournamentDataMobile />
      <div className="flex w-full items-center justify-between gap-x-[5px]">
        <MarketPicker activeMarket={activeMarket} />
        <MobileChartControlls activeMarket={activeMarket.chartData.tv_id} />
      </div>
      <div className="flex-1">
        <MultiResolutionChart
          market={activeMarket.chartData.tv_id as 'BTCUSD'}
          index={1}
          isMobile
        />
      </div>
      <ViewOnlyInputs />
      <PayoutProfit activeMarket={activeMarket} />
      <BuyButtons activeMarket={activeMarket} />
    </>
  );
};
