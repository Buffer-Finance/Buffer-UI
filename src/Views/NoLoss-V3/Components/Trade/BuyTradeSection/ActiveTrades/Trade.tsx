import { BetState } from '@Views/NoLoss-V3/Hooks/useAheadTrades';
import { IGQLHistory } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { White12pxText } from '@Views/TradePage/Components/TextWrapper';
import { Visualized } from '@Views/TradePage/Views/AccordionTable/Visualized';
import { DirectionChip } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/DirectionChip';
import { TradeTypeChip } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/TradeTypeChip';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import styled from '@emotion/styled';
import { Data } from './Data';
import { Timer } from './Timer';
import { TimerBar } from './TimerBar';

export const Trade: React.FC<{ trade: IGQLHistory }> = ({ trade }) => {
  return (
    <TradeCardBackground>
      <ColumnGap gap="10px">
        <RowBetween>
          <RowGap gap="4px">
            <div className="h-[15px] w-[15px]">
              <PairTokenImage pair={trade.chartData.pair} />
            </div>
            <White12pxText
              className={`${trade.blockNumber ? '!text-red' : ''}`}
            >
              {trade.chartData.pair}
            </White12pxText>
            <DirectionChip isUp={trade.isAbove} shouldShowArrow />
            <Visualized queue_id={trade.queueID} />
          </RowGap>
        </RowBetween>
        {trade.state === BetState.queued ? (
          <TradeTypeChip tradeType={'Queued'} />
        ) : (
          <Timer trade={trade} />
        )}
      </ColumnGap>
      <TimerBar trade={trade} />

      <Data trade={trade} />
    </TradeCardBackground>
  );
};

export const TradeCardBackground = styled.div`
  padding: 12px 16px;
  background-color: #141823;
  border-radius: 5px;
  margin-top: 8px;
`;
