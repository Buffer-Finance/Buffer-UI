import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
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
import { useMarketsConfig } from '@Views/TradePage/Hooks/useMarketsConfig';
import { joinStrings } from '@Views/TradePage/utils';
import { TradeTimeElapsed } from './TradeTimeElapsed';
import { usePoolInfo } from '@Views/TradePage/Hooks/usePoolInfo';
import { CountDown } from './CountDown';
import { OngoingTradeSchema } from '@Views/TradePage/type';

const TradeCardBackground = styled.div`
  padding: 12px 16px;
  background-color: #141823;
  border-radius: 5px;
  margin-top: 8px;
`;

export const TradeCard = ({
  trade,
  cancelLoading,
  setCancelLoading,
}: {
  trade: OngoingTradeSchema;
  cancelLoading: number | null;
  setCancelLoading: (newValue: number | null) => void;
}) => {
  const markets = useMarketsConfig();
  const { getPoolInfo } = usePoolInfo();
  const tradeMarket = markets?.find((pair) => {
    const pool = pair.pools.find(
      (pool) =>
        pool.optionContract.toLowerCase() ===
        trade?.target_contract.toLowerCase()
    );
    return !!pool;
  });

  if (!tradeMarket) return <>Error</>;
  const poolContract = tradeMarket.pools.find(
    (pool) =>
      pool.optionContract.toLowerCase() === trade?.target_contract.toLowerCase()
  )?.pool;
  const poolInfo = getPoolInfo(poolContract);
  const pairName = joinStrings(tradeMarket.token0, tradeMarket.token1, '-');
  const isUp = trade.is_above;
  const assetName = tradeMarket.token1;
  const tradeType = trade.is_limit_order ? 'Limit order' : 'Market';
  const isQueued = trade.state === TradeState.Queued;
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
          </RowGap>
          <TradeTypeChip tradeType={tradeType} />
        </RowBetween>
        <TimerChip trade={trade} />
      </ColumnGap>
      <TradeTimeElapsed trade={trade} />
      <div className="mb-3">
        <TradePoolChip assetName={assetName} />
      </div>

      <TradeDataView
        isQueued={isQueued}
        trade={trade}
        poolInfo={poolInfo}
        configData={tradeMarket}
      />
      <TradeActionButton
        trade={trade}
        tradeMarket={tradeMarket}
        cancelLoading={cancelLoading}
        setCancelLoading={setCancelLoading}
      />
    </TradeCardBackground>
  );
};

const TimerChip = ({ trade }: { trade: OngoingTradeSchema }) => {
  const isQueued = trade.state === TradeState.Queued;
  const isLimitOrder = trade.is_limit_order;
  if (isLimitOrder && isQueued) {
    return (
      <RowGap gap="4px">
        <CountDown expiration={trade.limit_order_expiration} /> <OrderExpiry />
      </RowGap>
    );
  }
  if (isQueued) {
    return <QueuedChip />;
  }
  return <CountDown expiration={trade.expiration_time} />;
};
