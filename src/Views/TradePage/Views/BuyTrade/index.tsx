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
import { useAtomValue } from 'jotai';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { priceAtom } from '@Hooks/usePrice';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { AssetCategory } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import { marketsForChart } from '@Views/TradePage/config';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { ActiveTrades } from './ActiveTrades';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { useSelectedAssetPayout } from '../MarketChart/Payout';

const BuyTradeBackground = styled.div`
  position: sticky;
  top: 45px;
  max-width: 275px;
  background-color: #1c1c28;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;

export const BuyTrade: React.FC = () => {
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();
  const { activeMarket } = useActiveMarket();
  const amount = useAtomValue(tradeSizeAtom);
  const marketPrice = useAtomValue(priceAtom);
  const { payout: totalPayout } = useSelectedAssetPayout({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  if (!switchPool || !poolDetails || !readcallData || !activeMarket) {
    console.log(
      `index-allSettlementFees: `,
      activeMarket,
      poolDetails,
      switchPool,
      readcallData
    );
    return (
      <Skeleton
        variant="rectangular"
        className="!w-[275px] !h-[250px] lc !rounded-md mx-2 mt-3 "
      />
    );
  }
  const tradeToken = poolDetails.token;
  const decimals = poolDetails.decimals;
  const allowance = divide(readcallData.allowance, decimals) as string;
  const isForex = activeMarket.category === AssetCategory[0];
  const isMarketOpen = true;
  const marketId = joinStrings(activeMarket.token0, activeMarket.token1, '');
  const activeChartMarket =
    marketsForChart[marketId as keyof typeof marketsForChart];
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeChartMarket);
  // const totalPayout = readcallData.settlementFees[switchPool.optionContract];
  const platformFee = divide(switchPool.platformFee, decimals);
  let userAmount = amount;
  // if (
  //   amount !== undefined &&
  //   amount !== null &&
  //   amount !== '' &&
  //   amount !== '0'
  // ) {
  //   userAmount = subtract(userAmount, platformFee ?? '0');
  // } else {
  //   userAmount = '0';
  // }

  return (
    <BuyTradeBackground>
      <TimeSelector />
      <TradeSizeSelector />
      <TradeTypeSelector />
      <CurrentPrice price={activeAssetPrice} />
      <PayoutProfit
        amount={userAmount}
        totalPayout={totalPayout}
        tradeToken={tradeToken}
      />
      <BuyButtons
        activeAssetPrice={activeAssetPrice}
        allowance={allowance}
        amount={amount.toString()}
        isForex={isForex}
        isMarketOpen={isMarketOpen}
      />
      <ActiveTrades />
    </BuyTradeBackground>
  );
};
