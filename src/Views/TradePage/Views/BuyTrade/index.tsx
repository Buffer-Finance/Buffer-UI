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
import { add, divide } from '@Utils/NumString/stringArithmatics';
import { getMaximumValue, joinStrings } from '@Views/TradePage/utils';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { ActiveTrades } from './ActiveTrades';
import { useSelectedAssetPayout } from '../MarketChart/Payout';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { useApprvalAmount } from '@Views/TradePage/Hooks/useApprovalAmount';
import { useAccount } from 'wagmi';
import secureLocalStorage from 'react-secure-storage';
import { getApprovalRequestLocalKey } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useActiveChain } from '@Hooks/useActiveChain';

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
  const { address } = useAccount();
  const { activeMarket } = useActiveMarket();
  const { activeChain } = useActiveChain();
  // triggering rerender
  const _setttlementFee = useSettlementFee();
  const amount = useAtomValue(tradeSizeAtom);
  const marketPrice = useAtomValue(priceAtom);
  const { calculatePayout } = useSelectedAssetPayout();
  const localStoreApprovalRequest = secureLocalStorage.getItem(
    getApprovalRequestLocalKey(address, poolDetails?.token, activeChain.id)
  );

  const approvalExpanded = useApprvalAmount();
  if (
    !switchPool ||
    !poolDetails ||
    !readcallData ||
    !activeMarket ||
    (address
      ? approvalExpanded?.allowance == null ||
        approvalExpanded?.allowance == undefined
      : false)
  ) {
    return (
      <Skeleton
        variant="rectangular"
        className="!w-[275px] !h-[250px] lc !rounded-md mx-2 mt-3 "
      />
    );
  }

  const { payout: totalPayout } = calculatePayout(
    joinStrings(activeMarket.token0, activeMarket.token1, '')
  );
  const tradeToken = poolDetails.token;
  const decimals = poolDetails.decimals;
  const allowance =
    approvalExpanded !== undefined
      ? (divide(
          getMaximumValue(
            add(
              approvalExpanded.allowance.toString(),
              approvalExpanded.base_amount.toString()
            ),
            (localStoreApprovalRequest as any)?.allowance || '0'
          ),
          decimals
        ) as string)
      : '0';

  const activeAssetPrice = getPriceFromKlines(marketPrice, {
    tv_id: activeMarket.tv_id,
  });
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
        amount={userAmount || '0'}
        totalPayout={totalPayout}
        tradeToken={tradeToken}
      />
      <BuyButtons
        activeAssetPrice={activeAssetPrice}
        allowance={allowance}
        amount={add(amount || '0', platformFee ?? '0')}
      />
      <ActiveTrades />
    </BuyTradeBackground>
  );
};
