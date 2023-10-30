import { activeMarketDataAtom } from '@Views/NoLoss-V3/atoms';
import { useAtomValue } from 'jotai';
import { AssetSelector } from './AssetSelector';
import { MarketData } from './MarketData';
import { MultiChartSelectorMenu } from './MultiChartSelectorMenu';
import { TournamentData } from './TournamentData';

export const StatusBar: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const activeMarket = useAtomValue(activeMarketDataAtom);
  return (
    <div className="flex p-3 gap-x-[34px] b1200:gap-x-5 items-center justify-between  b1200:p-[0px] b1200:justify-between">
      {!isMobile && (
        <>
          <AssetSelector
            token0={activeMarket?.chartData.token0}
            token1={activeMarket?.chartData.token1}
          />
          {/* <div className="b1200:flex flex-col items-end">
        <MarketPrice
          token0={activeMarket.token0}
          token1={activeMarket.token1}
        />
        {isMobile ? data[0].data : null}
      </div> */}
        </>
      )}
      <MarketData activeMarket={activeMarket} />
      <TournamentData />
      <MultiChartSelectorMenu isMobile={isMobile} />
    </div>
  );
};
