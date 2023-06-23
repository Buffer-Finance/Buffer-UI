import { toFixed } from '@Utils/NumString';
import { RowGap } from '@Views/TradePage/Components/Row';
import { TradeState } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useCancelTradeFunction } from '@Views/TradePage/Hooks/useCancelTradeFunction';
import {
  closeLoadingAtom,
  queuets2priceAtom,
  selectedOrderToEditAtom,
} from '@Views/TradePage/atoms';
import { TradeType, marketType, poolInfoType } from '@Views/TradePage/type';
import styled from '@emotion/styled';
import { useAtomValue, useSetAtom } from 'jotai';
import ButtonLoader from '@Views/Common/ButtonLoader/ButtonLoader';
import { useEarlyPnl } from './TradeDataView';
import {
  getExpiry,
  getLockedAmount,
  getStrike,
} from '../../AccordionTable/Common';

export const TradeActionButton: React.FC<{
  trade: TradeType;
  tradeMarket: marketType;
  poolInfo: poolInfoType;
}> = ({ trade, tradeMarket, poolInfo }) => {
  const { cancelHandler, earlyCloseHandler } = useCancelTradeFunction();
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { isPriceArrived } = getStrike(trade, cachedPrices);
  const earlyCloseLoading = useAtomValue(closeLoadingAtom);

  const lockedAmmount = getLockedAmount(trade, cachedPrices);

  const { earlycloseAmount, isWin } = useEarlyPnl({
    trade,
    configData: tradeMarket,
    poolInfo,
    lockedAmmount,
  });

  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);

  const isLimitQueued = trade.state === TradeState.Queued;
  const isQueued = isLimitQueued && !isPriceArrived;
  const isLimitOrder = trade.is_limit_order;

  const currentEpoch = Math.round(new Date().getTime() / 1000);
  const expiration = getExpiry(trade);

  const distance = expiration - currentEpoch;
  const isTradeExpired = distance < 0;

  const isCancelLoading = earlyCloseLoading?.[trade.queue_id] === 1;
  const isEarlyCloseLoading = earlyCloseLoading?.[trade.queue_id] === 2;
  function cancelTrade() {
    cancelHandler(trade);
  }

  function earlyClose() {
    earlyCloseHandler(trade, tradeMarket);
  }

  function editLimitOrder() {
    setSelectedTrade({ trade, market: tradeMarket });
  }

  if (isLimitOrder && isLimitQueued) {
    return (
      <RowGap gap="4px">
        {isTradeExpired ? (
          <CancelButton
            disabled={isCancelLoading || isEarlyCloseLoading || isTradeExpired}
          >
            Processing...
          </CancelButton>
        ) : (
          <>
            {' '}
            <CancelButton
              onClick={editLimitOrder}
              disabled={
                isCancelLoading || isEarlyCloseLoading || isTradeExpired
              }
            >
              {isCancelLoading ? <ButtonLoader /> : 'Edit'}
            </CancelButton>
            <CancelButton onClick={cancelTrade}>Cancel</CancelButton>
          </>
        )}
      </RowGap>
    );
  }
  if (isQueued) {
    return (
      <>
        <CancelButton
          onClick={cancelTrade}
          disabled={isCancelLoading || isEarlyCloseLoading || isTradeExpired}
        >
          {isTradeExpired ? (
            'Processing...'
          ) : isCancelLoading ? (
            <ButtonLoader />
          ) : (
            'Cancel'
          )}
        </CancelButton>
      </>
    );
  }
  if (isWin) {
    return (
      <>
        <CloseAtProfitButton
          onClick={earlyClose}
          disabled={
            isCancelLoading ||
            isEarlyCloseLoading ||
            isTradeExpired ||
            trade.option_id === null
          }
        >
          {isTradeExpired ? (
            'Processing...'
          ) : isEarlyCloseLoading ? (
            <ButtonLoader />
          ) : (
            `Close at +${toFixed(earlycloseAmount, 2)}`
          )}
        </CloseAtProfitButton>
      </>
    );
  }

  return (
    <CloseAtLossButton
      onClick={earlyClose}
      disabled={
        isCancelLoading ||
        isEarlyCloseLoading ||
        isTradeExpired ||
        trade.option_id === null
      }
    >
      {isTradeExpired ? (
        'Processing...'
      ) : isEarlyCloseLoading ? (
        <ButtonLoader />
      ) : (
        `Close at ${toFixed(earlycloseAmount, 2)}`
      )}
    </CloseAtLossButton>
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
  min-height: 28px;

  :hover {
    scale: 1.05;
  }

  :disabled {
    scale: 1;
    cursor: not-allowed;
    background-color: #282b39;
    color: rgba(255, 255, 255, 0.6);
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
