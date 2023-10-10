import { priceAtom } from '@Hooks/usePrice';
import MemoTimeIcon from '@SVG/Elements/TimeIcon';
import { getLastbar } from '@TV/useDataFeed';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useApprvalAmount } from '@Views/TradePage/Hooks/useApprovalAmount';
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { BuyButtons } from '@Views/TradePage/Views/BuyTrade/BuyButtons';
import { PayoutProfit } from '@Views/TradePage/Views/BuyTrade/PayoutProfit';
import { MultiResolutionChart } from '@Views/TradePage/Views/MarketChart/MultiResolutionChart';
import { useSelectedAssetPayout } from '@Views/TradePage/Views/MarketChart/Payout';
import { tradeSizeAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
import { joinStrings } from '@Views/TradePage/utils';
import { Skeleton } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { MarketPicker } from './MarketPicker/MarketPicker';
import { MobileChartControlls } from './MobileChartControlls';
import { ViewOnlyInputs } from './ViewOnlyInputs';

const TradePageMobile: React.FC<any> = ({}) => {
  const marketConfig = useMarketsConfig();
  const { openLOShutter } = useShutterHandlers();

  const { poolDetails, switchPool } = useSwitchPool();
  const tradeType = useAtomValue(tradeTypeAtom);
  const setTradeType = useSetAtom(tradeTypeAtom);

  const marketPrice = useAtomValue(priceAtom);
  const amount = useAtomValue(tradeSizeAtom);
  const { activeMarket } = useActiveMarket();
  const { data: approvalExpanded } = useApprvalAmount();
  const { calculatePayout } = useSelectedAssetPayout();

  if (!poolDetails || !activeMarket || !switchPool)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[100px] rounded-lg lc"
      />
    );
  const decimals = poolDetails.decimals;

  const activeAssetPrice = getLastbar(marketPrice, {
    tv_id: activeMarket.tv_id,
  });
  const tradeToken = poolDetails.token;

  const allowance = approvalExpanded?.allowance
    ? (divide(approvalExpanded?.allowance, decimals) as string)
    : '0';

  const { payout: totalPayout } = calculatePayout(
    joinStrings(activeMarket.token0, activeMarket.token1, ''),
    switchPool.optionContract
  );

  if (!marketConfig?.length)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[100px] rounded-lg lc"
      />
    );
  return (
    <div className="flex flex-col  h-full w-full m-auto px-3 a600:w-[500px]">
      <div className="flex w-full items-center justify-between gap-x-[5px]">
        <MarketPicker payout={totalPayout} />
        <MobileChartControlls activeMarket={activeMarket.tv_id} />
      </div>
      {/* <MarketStatsBar isMobile /> */}
      <div className="flex-1">
        {[activeMarket.tv_id].map((s) => (
          <MultiResolutionChart key={s} market={s} index={1} isMobile />
        ))}
      </div>
      <ViewOnlyInputs />
      <PayoutProfit
        amount={amount || '0'}
        totalPayout={totalPayout}
        tradeToken={tradeToken}
      />
      <BuyButtons
        isApprovalLocked={approvalExpanded?.is_locked}
        activeAssetPrice={activeAssetPrice}
        allowance={allowance}
        amount={amount.toString()}
        center={
          <button
            className="bg-[#303044] w-[86px] grid place-items-center h-[36px] rounded-sm"
            onClick={() => {
              if (tradeType == 'Market') {
                openLOShutter();
              } else {
                setTradeType('Market');
              }
            }}
          >
            {tradeType == 'Market' ? (
              <MemoTimeIcon />
            ) : (
              <div className="text-f22">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1.30929L11.6907 0L6.5 5.19071L1.30929 0L0 1.30929L5.19071 6.5L0 11.6907L1.30929 13L6.5 7.80929L11.6907 13L13 11.6907L7.80929 6.5L13 1.30929Z"
                    fill="#C3C2D4"
                  />
                </svg>
              </div>
            )}
          </button>
        }
      />
    </div>
  );
};

export { TradePageMobile };
