import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { White12pxText } from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { DirectionChip } from './DirectionChip';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { OrderExpiry, QueuedChip } from './QueuedChip';
import { TradePoolChip } from './TradePoolChip';
import { TradeTypeChip } from './TradeTypeChip';
import { TradeDataView } from './TradeDataView';
import { TradeActionButton } from './TradeActionButton';
import { TradeState } from '@Views/TradePage/Hooks/useOngoingTrades';
import { joinStrings } from '@Views/TradePage/utils';
import { TradeTimeElapsed } from './TradeTimeElapsed';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { CountDown } from './CountDown';
import { TradeType } from '@Views/TradePage/type';
import { getStrike } from '../../AccordionTable/Common';
import { queuets2priceAtom } from '@Views/TradePage/atoms';
import { useAtomValue } from 'jotai';
import { Visualized } from '../../AccordionTable/Visualized';
import NumberTooltip from '@Views/Common/Tooltips';

const TradeCardBackground = styled.div`
  padding: 12px 16px;
  background-color: #141823;
  border-radius: 5px;
  margin-top: 8px;
`;

export const TradeCard = ({ trade }: { trade: TradeType }) => {
  const { getPoolInfo } = usePoolInfo();
  const tradeMarket = trade.market;
  const cachedPrices = useAtomValue(queuets2priceAtom);
  // console.log('timerTrade', trade, expiry);
  const { isPriceArrived } = getStrike(trade, cachedPrices);
  const isQueued = trade.state === TradeState.Queued && !isPriceArrived;
  if (!tradeMarket) return <>Error</>;

  const poolInfo = getPoolInfo(trade.pool.pool);
  const pairName = joinStrings(tradeMarket.token0, tradeMarket.token1, '-');
  const isUp = trade.is_above;
  const tradeType = trade.is_limit_order ? 'Limit order' : 'Market';
  const isLimitorder =
    trade.is_limit_order && trade.state === TradeState.Queued;
  return (
    <TradeCardBackground>
      <ColumnGap gap="15px">
        <RowBetween>
          <RowGap gap="4px">
            <div className="h-[15px] w-[15px]">
              <PairTokenImage pair={pairName} />
            </div>
            <White12pxText>{pairName}</White12pxText>
            <DirectionChip isUp={isUp} shouldShowArrow />
            <Visualized queue_id={trade.queue_id} className="hidden sm:block" />
            {!isLimitorder && (
              <>
                {isQueued ? (
                  <NumberTooltip content={'Fetching latest states...'}>
                    <img
                      src="/Gear.png"
                      className="w-[16px] h-[16px] animate-spin"
                    />
                  </NumberTooltip>
                ) : null}
              </>
            )}
          </RowGap>
          <TradeTypeChip tradeType={tradeType} />
        </RowBetween>
        <TimerChip trade={trade} />
      </ColumnGap>
      <TradeTimeElapsed trade={trade} />
      <div className="mb-3">
        <TradePoolChip assetName={poolInfo.token} />
      </div>

      <TradeDataView
        trade={trade}
        poolInfo={poolInfo}
        configData={tradeMarket}
      />
      <TradeActionButton
        trade={trade}
        tradeMarket={tradeMarket}
        poolInfo={poolInfo}
      />
    </TradeCardBackground>
  );
};

const TimerChip = ({ trade }: { trade: TradeType }) => {
  const isLimitOrder = trade.is_limit_order;
  // const expiry = getExpiry(trade);

  if (isLimitOrder && trade.state === TradeState.Queued) {
    return (
      <RowGap gap="4px">
        <CountDown
          expiration={trade.limit_order_expiration}
          closeTime={trade.close_time}
        />
        <OrderExpiry />
      </RowGap>
    );
  }
  // if (isQueued) {
  //   return <QueuedChip />;
  // }

  const expirationTime = trade.open_timestamp + trade.period;
  return (
    <CountDown
      expiration={expirationTime}
      closeTime={trade.close_time}
      queuedTime={trade.state === 'QUEUED' ? trade.queued_timestamp : null}
    />
  );
};
