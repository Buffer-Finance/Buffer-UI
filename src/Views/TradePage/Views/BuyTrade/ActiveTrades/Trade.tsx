import NumberTooltip from '@Views/Common/Tooltips';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { White12pxText } from '@Views/TradePage/Components/TextWrapper';
import { TradeState } from '@Views/TradePage/Hooks/useOngoingTrades';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { useSpread } from '@Views/TradePage/Hooks/useSpread';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { queuets2priceAtom } from '@Views/TradePage/atoms';
import { TradeType } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
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
  const tradeMarket = trade.market;
  console.log(`Trade-tradeMarket: `, tradeMarket);
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { data: allSpreads } = useSpread();
  const spread = allSpreads?.[trade.market.tv_id].spread ?? 0;

  const { isPriceArrived } = getStrike(trade, cachedPrices, spread);
  // console.log('timerTrade', trade, expiry);
  const isQueued = trade.state === TradeState.Queued && !isPriceArrived;
  if (!tradeMarket) return <>Error</>;

  const poolInfo = trade.pool;
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
        <TradePoolChip assetName={trade.token} />
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
          key={'limit'}
          expiration={trade.limit_order_expiration}
          closeTime={trade.close_time}
        />
        <OrderExpiry />
      </RowGap>
    );
  }
  const expirationTime = trade.open_timestamp + trade.period;
  return (
    <CountDown
      key={'timer'}
      expiration={expirationTime}
      closeTime={trade.close_time}
      queuedTime={trade.state === 'QUEUED' ? trade.queued_timestamp : null}
    />
  );
};
