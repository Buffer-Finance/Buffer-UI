import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import NumberTooltip from '@Views/Common/Tooltips';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import { useCancelTradeFunction } from '@Views/ABTradePage/Hooks/useCancelTradeFunction';
import { TradeState } from '@Views/ABTradePage/Hooks/useOngoingTrades';
import { useSpread } from '@Views/ABTradePage/Hooks/useSpread';
import {
  closeLoadingAtom,
  queuets2priceAtom,
  selectedOrderToEditAtom,
} from '@Views/ABTradePage/atoms';
import { TradeType, marketType, poolInfoType } from '@Views/ABTradePage/type';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  getExpiry,
  getLockedAmount,
  getStrike,
} from '../../AccordionTable/Common';
import { loeditLoadingAtom } from '../../EditModal';
import { useEarlyPnl } from './TradeDataView';

export const TradeActionButton: React.FC<{
  trade: TradeType;
  tradeMarket: marketType;

  poolInfo: poolInfoType;
}> = ({ trade, tradeMarket, poolInfo }) => {
  const { registeredOneCT } = useOneCTWallet();
  if (!registeredOneCT) return <></>;
  return (
    <TradeButton trade={trade} tradeMarket={tradeMarket} poolInfo={poolInfo} />
  );
};

export const TradeButton: React.FC<{
  trade: TradeType;
  tradeMarket: marketType;
  poolInfo: poolInfoType;
}> = ({ trade, tradeMarket, poolInfo }) => {
  const { cancelHandler, earlyCloseHandler } = useCancelTradeFunction();
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { viewOnlyMode } = useUserAccount();
  const { data: allSpreads } = useSpread();
  const spread = allSpreads?.[trade.market.tv_id].spread ?? 0;

  const { isPriceArrived } = getStrike(trade, cachedPrices, spread);
  const earlyCloseLoading = useAtomValue(closeLoadingAtom);

  const lockedAmmount = getLockedAmount(trade, cachedPrices);
  const editLoading = useAtomValue(loeditLoadingAtom);
  const { pnl } = useEarlyPnl({
    trade,
    configData: tradeMarket,
    poolInfo,
    lockedAmmount,
  });
  const { earlycloseAmount, isWin } = pnl;

  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);

  const isLimitQueued = trade.state === TradeState.Queued;
  const isQueued = isLimitQueued && !isPriceArrived;

  const currentEpoch = Math.round(new Date().getTime() / 1000);
  let expiration = getExpiry(trade);

  const distance = expiration - currentEpoch;
  const isTradeExpired = distance < 0;

  const isCancelLoading = earlyCloseLoading?.[trade.queue_id] === 1;
  const isEarlyCloseLoading = earlyCloseLoading?.[trade.queue_id] === 2;

  function cancelTrade() {
    cancelHandler(trade);
  }

  f;

  if (viewOnlyMode) return <></>;

  const [isCloseDisabled, disableTooltip] = getEarlyCloseStatus(trade);

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
          isDisabled={
            isCancelLoading ||
            isEarlyCloseLoading ||
            isTradeExpired ||
            isCloseDisabled
          }
        >
          {isTradeExpired ? (
            'Processing...'
          ) : isEarlyCloseLoading ? (
            <CircularProgress
              className="!w-[15px] !h-[15px] mx-[20px]"
              color="inherit"
            />
          ) : (
            `Close at +${toFixed(earlycloseAmount, 2)}`
          )}
        </CloseAtProfitButton>
      </>
    );
  }
  return (
    <NumberTooltip content={disableTooltip}>
      <span>
        <CloseAtLossButton
          isDisabled={
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
            <CircularProgress
              className="!w-[15px] !h-[15px] mx-[20px]"
              color="inherit"
            />
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
