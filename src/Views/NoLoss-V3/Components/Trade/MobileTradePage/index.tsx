import { activeMarketDataAtom } from '@Views/NoLoss-V3/atoms';
import { MobileChartControlls } from '@Views/TradePage/Components/MobileView/MobileChartControlls';
import { ViewOnlyInputs } from '@Views/TradePage/Components/MobileView/ViewOnlyInputs';
import { MultiResolutionChart } from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { BuyButtons } from '../BuyTradeSection/BuyButtons';
import { PayoutProfit } from '../BuyTradeSection/PayoutProfit';
import { MarketPicker } from './MarketPicker';

const TradePageMobile: React.FC<any> = ({}) => {
  const activeMarket = useAtomValue(activeMarketDataAtom);

  if (!activeMarket)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[100px] rounded-lg lc"
      />
    );

  return (
    <div className="flex flex-col  h-full w-full m-auto px-3 a600:w-[500px]">
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
    </div>
  );
};

export { TradePageMobile };
