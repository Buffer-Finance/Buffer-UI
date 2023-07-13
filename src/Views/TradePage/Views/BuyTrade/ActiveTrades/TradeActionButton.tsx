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
  getEarlyCloseStatus,
  getExpiry,
  getLockedAmount,
  getStrike,
} from '../../AccordionTable/Common';
import NumberTooltip from '@Views/Common/Tooltips';

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
  let expiration = getExpiry(trade);
  if (trade.is_limit_order && isQueued)
    expiration = trade.limit_order_expiration;

  const distance = expiration - currentEpoch;
  const isTradeExpired = distance < 0;
  const isLimitOrderExpired = currentEpoch > trade.limit_order_expiration;

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
        {isLimitOrderExpired ? (
          <CancelButton
            disabled={isCancelLoading || isEarlyCloseLoading || isTradeExpired}
          >
            Processing...
          </CancelButton>
        ) : (
          <>
            <CancelButton
              onClick={editLimitOrder}
              disabled={isCancelLoading || isTradeExpired}
            >
              {'Edit'}
            </CancelButton>
            <CancelButton
              onClick={cancelTrade}
              disabled={isCancelLoading || isTradeExpired}
            >
              {isCancelLoading ? <ButtonLoader /> : 'Cancel'}
            </CancelButton>
          </>
        )}
      </RowGap>
    );
  }

  if (isWin) {
    return (
      <>
        <CloseAtProfitButton
          onClick={() =>
            isCancelLoading ||
            isEarlyCloseLoading ||
            isTradeExpired ||
            isCloseDisabled
              ? console.log()
              : earlyClose()
          }
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
  const [isCloseDisabled, disableTooltip] = getEarlyCloseStatus(trade);
  return (
    <NumberTooltip content={disableTooltip}>
      <span>
        <CloseAtLossButton
          disabled={
            isCancelLoading ||
            isEarlyCloseLoading ||
            isTradeExpired ||
            isCloseDisabled
          }
          onClick={() =>
            isCancelLoading ||
            isEarlyCloseLoading ||
            isTradeExpired ||
            isCloseDisabled
              ? console.log()
              : earlyClose()
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
      </span>
    </NumberTooltip>
  );
};
const getDisabledStyles = (props) => {
  if (props.isDisabled)
    return ` cursor: not-allowed;
  background-color: #282b39;
  color: rgba(255, 255, 255, 0.6);`;
  else return '';
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
`;

const CancelButton = styled(buttonStyle)`
  background-color: #282b39;
  color: #ffffff;
  :hover {
    color: #ffffff;
  }
  ${getDisabledStyles}
`;

const CloseAtProfitButton = styled(buttonStyle)`
  color: #ffffff;
  background-color: #3fb68b;
  ${getDisabledStyles}
`;

const CloseAtLossButton = styled(buttonStyle)`
  color: #ffffff;
  background-color: #ff5353;
  ${getDisabledStyles}
`;
