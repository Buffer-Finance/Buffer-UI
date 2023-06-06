import { priceAtom, usePrice } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { useAtom, useAtomValue } from 'jotai';
import { ReactNode, useEffect } from 'react';
import {
  AmountSelector,
  DurationSelector,
  SettingsSelector,
} from './AmountSelector';
import { knowTillAtom } from './Hooks/useIsMerketOpen';
import { MarketTimingWarning } from './MarketTimingWarning';
import { ammountAtom, approveModalAtom } from './PGDrawer';
import { useV3AppActiveMarket } from '@Views/V3App/Utils/useV3AppActiveMarket';
import { AssetCategory } from '@Views/V3App/useV3AppConfig';
import { useSwitchPoolForTrade } from '@Views/V3App/Utils/useSwitchPoolForTrade';
import { useV3AppData } from '@Views/V3App/Utils/useV3AppReadCalls';
import { joinStrings } from '@Views/V3App/helperFns';
import { marketsForChart } from '@Views/V3App/config';
import {
  PayoutProfit,
  TradeButton,
} from '@Views/V3App/V3AppComponents/V3CustomOption';

const BuyTrade: React.FC<any> = ({}) => {
  const [amount, setAmount] = useAtom(ammountAtom);
  const { address: account } = useUserAccount();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);

  useEffect(() => {
    if (isApproveModalOpen && account) {
      setIsApproveModalOpen(false);
    }
  }, [account]);

  usePrice(true);
  const knowTill = useAtomValue(knowTillAtom);
  const marketPrice = useAtomValue(priceAtom);
  const { activeMarket } = useV3AppActiveMarket();
  const { switchPool, poolDetails } = useSwitchPoolForTrade();
  const readcallData = useV3AppData();

  if (!activeMarket || !poolDetails || !readcallData || !switchPool)
    return null;
  const isForex = activeMarket.category === AssetCategory[0];
  const isMarketOpen = true;
  const decimals = poolDetails.decimals;
  const allowance = divide(readcallDasta.allowance, decimals) as string;
  const totalPayout = readcallData.totalPayout;
  const basePayout = switchPool.base_settlement_fee;
  const boostedPayout = subtract(totalPayout, basePayout);
  const tradeToken = poolDetails.token;
  const marketId = joinStrings(activeMarket.token0, activeMarket.token1, '');
  const activeChartMarket =
    marketsForChart[marketId as keyof typeof marketsForChart];
  const activeAssetPrice = getPriceFromKlines(marketPrice, activeChartMarket);

  let MarketOpenWarning: ReactNode | null = null;
  if (isForex && knowTill === false) {
    MarketOpenWarning = <MarketTimingWarning />;
  }
  return (
    <div>
      <div className="flex gap-3 my-3">
        <AmountSelector amount={amount} setAmount={setAmount} />
        <DurationSelector />
        <SettingsSelector />
      </div>
      <PayoutProfit
        amount={amount}
        boostedPayout={boostedPayout}
        totalPayout={totalPayout}
        tradeToken={tradeToken}
      />
      <TradeButton
        activeAssetPrice={activeAssetPrice}
        allowance={allowance}
        amount={amount}
        isAssetActive={!switchPool.isPaused}
        isForex={isForex}
        isMarketOpen={isMarketOpen}
      />
      {MarketOpenWarning}
    </div>
  );
};

export { BuyTrade };
