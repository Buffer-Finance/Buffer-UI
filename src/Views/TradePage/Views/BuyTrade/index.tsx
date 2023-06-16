import styled from '@emotion/styled';
import { TimeSelector } from './TimeSelector';
import { TradeSizeSelector } from './TradeSizeSelector';
import { TradeTypeSelector } from './TradeTypeSelector';
import { CurrentPrice } from './CurrentPrice';
import { PayoutProfit } from './PayoutProfit';
import { BuyButtons } from './BuyButtons';
import { Skeleton } from '@mui/material';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useAtom, useAtomValue } from 'jotai';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { priceAtom, usePrice } from '@Hooks/usePrice';
import { knowTillAtom } from '@Views/BinaryOptions/Hooks/useIsMerketOpen';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { AssetCategory } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import { marketsForChart } from '@Views/TradePage/config';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { ActiveTrades } from './ActiveTrades';
import { TradeCard } from './ActiveTrades/Trade';

const BuyTradeBackground = styled.div`
  max-width: 275px;
  background-color: #1c1c28;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100vh - 75px);
  align-items: stretch;
`;

export const BuyTrade: React.FC = () => {
  usePrice(true);
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();
  const { activeMarket } = useActiveMarket();
  const [amount, setAmount] = useAtom(tradeSizeAtom);
  const marketPrice = useAtomValue(priceAtom);
  const knowTill = useAtomValue(knowTillAtom);

  if (!switchPool || !poolDetails || !readcallData || !activeMarket)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-[275px] !h-[250px] lc !rounded-md mx-2 mt-3 "
      />
    );
  const tradeToken = poolDetails.token;
  const decimals = poolDetails.decimals;
  const allowance = divide(readcallData.allowance, decimals) as string;
  const isForex = activeMarket.category === AssetCategory[0];
  const isMarketOpen = true;
  const marketId = joinStrings(activeMarket.token0, activeMarket.token1, '');
  const activeChartMarket =
    marketsForChart[marketId as keyof typeof marketsForChart];
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeChartMarket);
  return (
    <BuyTradeBackground>
      <TimeSelector />
      <TradeSizeSelector />
      <TradeTypeSelector />
      <CurrentPrice price={activeAssetPrice} />
      <PayoutProfit
        amount={amount.toString()}
        boostedPayout={'92'}
        totalPayout={'80'}
        tradeToken={tradeToken}
      />
      <BuyButtons
        activeAssetPrice={activeAssetPrice}
        allowance={allowance}
        amount={amount.toString()}
        isAssetActive={!switchPool.isPaused}
        isForex={isForex}
        isMarketOpen={isMarketOpen}
      />
      <ActiveTrades />
    </BuyTradeBackground>
  );
};
