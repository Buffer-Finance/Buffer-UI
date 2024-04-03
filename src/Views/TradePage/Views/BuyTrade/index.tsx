import { priceAtom } from '@Hooks/usePrice';
import { getLastbar } from '@TV/useDataFeed';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useApprvalAmount } from '@Views/TradePage/Hooks/useApprovalAmount';
import { buyTradeDataAtom } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import {
  LimitOrderPayoutAtom,
  tradeSizeAtom,
  tradeTypeAtom,
} from '@Views/TradePage/atoms';
import { joinStrings } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import { useSelectedAssetPayout } from '../MarketChart/Payout';
import { ActiveTrades } from './ActiveTrades';
import { BuyButtons } from './BuyButtons';
import { CurrentPrice } from './CurrentPrice';
import { PayoutProfit } from './PayoutProfit';
import { TimeSelector } from './TimeSelector';
import { TradeSizeSelector } from './TradeSizeSelector';
import { TradeTypeSelector } from './TradeTypeSelector';
import { zeroify } from '@Utils/NumberUtils';

const BuyTradeBackground = styled.div`
  position: sticky;
  top: 45px;
  max-width: 275px;
  background-color: #1c1c28;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: calc(100vh - 80px);
`;

export const BuyTrade: React.FC = () => {
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useAtomValue(buyTradeDataAtom);
  const { address } = useAccount();
  const { activeMarket } = useActiveMarket();
  // triggering rerender
  const _setttlementFee = useSettlementFee();
  const amount = useAtomValue(tradeSizeAtom);
  const { calculatePayout } = useSelectedAssetPayout();
  const limitprderPayout = useAtomValue(LimitOrderPayoutAtom);
  const tradeTypeTab = useAtomValue(tradeTypeAtom);
  const isLimitOrderTab = tradeTypeTab == 'Limit';
  const { data: approvalExpanded } = useApprvalAmount();
  if (
    !switchPool ||
    !poolDetails ||
    !readcallData ||
    !activeMarket ||
    (address ? approvalExpanded == undefined : false)
  ) {
    return (
      <Skeleton
        variant="rectangular"
        className="!w-[310px] !h-[380px] lc !rounded-md mx-2 mt-3 "
      />
    );
  }

  let payout: string | null = '';
  if (isLimitOrderTab) {
    payout = limitprderPayout;
  } else {
    const { payout: totalPayout } = calculatePayout(
      joinStrings(activeMarket.token0, activeMarket.token1, ''),
      switchPool.optionContract
    );
    payout = totalPayout;
  }
  const { payout: totalPayout } = calculatePayout(
    joinStrings(activeMarket.token0, activeMarket.token1, ''),
    switchPool.optionContract
  );
  // console.log(`index-totalPayout: `, totalPayout);
  const tradeToken = poolDetails.token;
  const decimals = poolDetails.decimals;
  const allowance = approvalExpanded?.allowance
    ? (divide(approvalExpanded?.allowance, decimals) as string)
    : '0';

  // const platformFee = divide(switchPool.platformFee, decimals);
  let userAmount = amount;
  // const buyLink = () => {
  //   particle.openBuy({
  //     fiatCoin: 'USD',
  //     cryptoCoin: 'USDC',
  //     network: 'Arbitrum One',
  //     walletAddress: address,
  //   });
  // };
  // const openWallet = () => {
  //   particle.openWallet();
  // };

  return (
    <BuyTradeBackground>
      <TimeSelector />
      <TradeSizeSelector />
      <TradeTypeSelector />
      <CurrentPrice />
      <PayoutProfit
        amount={zeroify(amount)}
        totalPayout={payout}
        tradeToken={tradeToken}
      />
      <BuyButtons
        allowance={allowance}
        amount={amount.toString()}
        isApprovalLocked={approvalExpanded?.is_locked}
      />
      <ActiveTrades sm />
    </BuyTradeBackground>
  );
};
