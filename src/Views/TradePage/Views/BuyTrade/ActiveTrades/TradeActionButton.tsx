import { toFixed } from '@Utils/NumString';
import { subtract } from '@Utils/NumString/stringArithmatics';
import { RowGap } from '@Views/TradePage/Components/Row';
import {
  OngoingTradeSchema,
  TradeState,
} from '@Views/TradePage/Hooks/useOngoingTrades';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { selectedOrderToEditAtom } from '@Views/TradePage/atoms';
import { marketType } from '@Views/TradePage/type';
import styled from '@emotion/styled';
import { useSetAtom } from 'jotai';

export const TradeActionButton: React.FC<{
  trade: OngoingTradeSchema;
  tradeMarket: marketType;
  cancelLoading: number | null;
  setCancelLoading: (newValue: number | null) => void;
}> = ({ trade, tradeMarket, cancelLoading, setCancelLoading }) => {
  const { cancelHandler } = useCancelTradeFunction();
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const { currentPrice, precision } = useCurrentPrice({
    token0: tradeMarket.token0,
    token1: tradeMarket.token1,
  });
  const isQueued = trade.state === TradeState.Queued;
  const isLimitOrder = trade.is_limit_order;
  const isUp = trade.is_above;
  const strikePrice = toFixed(trade.strike / 1e8, precision);
  const profitOrLoss = subtract(currentPrice, strikePrice);
  const isProfit = isUp ? +profitOrLoss > 0 : +profitOrLoss < 0;

  function cancelTrade() {
    cancelHandler(trade.queue_id, cancelLoading, setCancelLoading);
  }

  function closeAtProfit() {
    console.log('close at profit');
  }

  function closeAtLoss() {
    console.log('close at loss');
  }

  function editLimitOrder() {
    setSelectedTrade({ trade, market: tradeMarket });
  }
  function cancelLimitOrder() {
    console.log('cancel limit order');
  }
  if (isLimitOrder) {
    return (
      <RowGap gap="4px">
        <CancelButton onClick={editLimitOrder}>Edit</CancelButton>
        <CancelButton onClick={cancelLimitOrder}>Cancel</CancelButton>
      </RowGap>
    );
  }
  if (isQueued) {
    return (
      <>
        <CancelButton onClick={cancelTrade}>Cancel</CancelButton>
      </>
    );
  }
  if (isProfit) {
    return (
      <>
        <CloseAtProfitButton onClick={closeAtProfit}>
          Close at profit
        </CloseAtProfitButton>
      </>
    );
  }

  return (
    <CloseAtLossButton onClick={closeAtLoss}>Close at loss</CloseAtLossButton>
  );
};

const buttonStyle = styled.button`
  font-weight: 500;
  font-size: 12px;
  width: 100%;
  border-radius: 5px;
  padding: 5px 0;
  transition: 0.2s;
  margin-top: 12px;

  :hover {
    scale: 1.05;
  }
`;

const CancelButton = styled(buttonStyle)`
  background-color: #282b39;
  color: #7f87a7;
  :hover {
    color: #ffffff;
  }
`;

const CloseAtProfitButton = styled(buttonStyle)`
  color: #ffffff;
  background-color: #3fb68b;
`;

const CloseAtLossButton = styled(buttonStyle)`
  color: #ffffff;
  background-color: #ff5353;
`;
