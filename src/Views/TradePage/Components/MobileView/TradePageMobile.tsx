import ShutterProvider from '@Views/Common/MobileShutter/MobileShutter';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { MultiResolutionChart } from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';
import { ViewOnlyInputs } from './ViewOnlyInputs';
import { BuyButtons } from '@Views/TradePage/Views/BuyTrade/BuyButtons';
import { useAtomValue } from 'jotai';
import { priceAtom } from '@Hooks/usePrice';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useApprvalAmount } from '@Views/TradePage/Hooks/useApprovalAmount';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';

const TradePageMobile: React.FC<any> = ({}) => {
  const marketConfig = useMarketsConfig();
  const { poolDetails } = useSwitchPool();

  const marketPrice = useAtomValue(priceAtom);
  const amount = useAtomValue(tradeSizeAtom);
  const { activeMarket } = useActiveMarket();
  const approvalExpanded = useApprvalAmount();
  if (!poolDetails) return <div>Loadding...</div>;
  const decimals = poolDetails.decimals;

  console.log(`TradePageMobile-activeMarket: `, activeMarket);
  const activeAssetPrice = getPriceFromKlines(marketPrice, {
    tv_id: activeMarket.tv_id,
  });

  const allowance = approvalExpanded?.allowance
    ? (divide(approvalExpanded?.allowance, decimals) as string)
    : '0';

  if (!marketConfig?.length) return <div>Loading...</div>;
  console.log(`TradePageMobile-marketConfig: `, marketConfig);
  return (
    <div className="flex flex-col ">
      <div className="h-[40vh]">
        <MultiResolutionChart market="BTCUSD" index={1} />
        <ViewOnlyInputs />
        <BuyButtons
          activeAssetPrice={activeAssetPrice}
          allowance={allowance}
          amount={amount.toString()}
        />
        <ShutterProvider />
      </div>
    </div>
  );
};

export { TradePageMobile };
