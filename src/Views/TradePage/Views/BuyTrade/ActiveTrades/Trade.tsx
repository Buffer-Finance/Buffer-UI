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
import { isABRouter } from '@Views/TradePage/config';
import { JackpotChip } from '@Views/Jackpot/JackpotChip';
import { getJackpotKey, useJackpotManager } from 'src/atoms/JackpotState';

const TradeCardBackground = styled.div`
  padding: 12px 16px;
  background-color: #141823;
  border-radius: 5px;
  margin-top: 8px;
`;

export const TradeCard = ({
  trade,
  sm,
}: {
  trade: TradeType;
  sm?: boolean;
}) => {
  const tradeMarket = trade.market;
  const { getPoolInfo } = usePoolInfo();

  console.log(`Trade-tradeMarket: `, trade);
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { data: allSpreads } = useSpread();
  const spread = allSpreads?.[trade.market.tv_id].spread ?? 0;

  const { isPriceArrived } = getStrike(trade, cachedPrices, spread);
  // console.log('timerTrade', trade, expiry);
  const isQueued = trade.state === TradeState.Queued && !isPriceArrived;
  if (!tradeMarket) return <>Error</>;

  const isAb = isABRouter(trade.router);
  const poolInfo = isAb ? trade.pool : getPoolInfo(trade.pool.pool);
  console.log(`Trade-trade.pool: `, trade);
  const pairName = joinStrings(tradeMarket.token0, tradeMarket.token1, '-');
  const isUp = trade.is_above;
  const tradeType = trade.is_limit_order ? 'Limit order' : 'Market';
  const isLimitorder =
    trade.is_limit_order && trade.state === TradeState.Queued;
  // console.log(`Trade-isAb: `, isAb);
  const jackpotManager = useJackpotManager();
  const jackpote18 =
    jackpotManager.jackpot.jackpots?.[getJackpotKey(trade)]?.jackpot_amount ||
    trade?.jackpot_amount ||
    '0';
  return (
    <TradeCardBackground>
      <ColumnGap gap="15px">
        <RowBetween>
          <RowGap gap="4px">
            <div className="h-[15px] w-[15px]">
              <PairTokenImage pair={pairName} />
            </div>
            <White12pxText>{pairName}</White12pxText>
            <DirectionChip
              isUp={isUp}
              upText={isAb ? 'Above' : 'Up'}
              downText={isAb ? 'Below' : 'Down'}
              shouldShowArrow
            />
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
      <div className="mb-3 flex items-center gap-3">
        <TradePoolChip
          assetName={trade.token}
          className="!px-[4px] !py-[3px] !text-f11  !rounded-[4px]  !font-[500] !text-[#C3C2D4]"
        />
        <JackpotChip jackpote18={'1000000000000000000'} />
      </div>

      <TradeDataView
        trade={trade}
        poolInfo={poolInfo}
        configData={tradeMarket}
      />
      {isAb ? null : (
        <TradeActionButton
          trade={trade}
          tradeMarket={tradeMarket}
          poolInfo={poolInfo}
        />
      )}
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
