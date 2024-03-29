import NumberTooltip from '@Views/Common/Tooltips';
import { ColumnGap } from '@Views/ABTradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/ABTradePage/Components/Row';
import { White12pxText } from '@Views/ABTradePage/Components/TextWrapper';
import { TradeState } from '@Views/ABTradePage/Hooks/useOngoingTrades';
import { usePoolInfo } from '@Views/ABTradePage/Hooks/usePoolInfo';
import { useSpread } from '@Views/ABTradePage/Hooks/useSpread';
import { PairTokenImage } from '@Views/ABTradePage/Views/PairTokenImage';
import { queuets2priceAtom } from '@Views/ABTradePage/atoms';
import { TradeType } from '@Views/ABTradePage/type';
import { joinStrings } from '@Views/ABTradePage/utils';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { getStrike } from '../../AccordionTable/Common';
import { Visualized } from '../../AccordionTable/Visualized';
import { CountDown } from './CountDown';
import { DirectionChip } from './DirectionChip';
import { OrderExpiry } from './QueuedChip';
import { TradeActionButton } from './TradeActionButton';
import { TradeDataView } from './TradeDataView';
import { TradePoolChip } from './TradePoolChip';
import { TradeTimeElapsed } from './TradeTimeElapsed';
import { TradeTypeChip } from './TradeTypeChip';

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
  const { data: allSpreads } = useSpread();
  const spread = allSpreads?.[trade.market.tv_id].spread ?? 0;

  const { isPriceArrived } = getStrike(trade, cachedPrices, spread);
  // console.log('timerTrade', trade, expiry);
  const isQueued = trade.state === TradeState.Queued && !isPriceArrived;
  if (!tradeMarket) return <>Error</>;

  console.log(`Trade-trade.pool: `, trade);
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
