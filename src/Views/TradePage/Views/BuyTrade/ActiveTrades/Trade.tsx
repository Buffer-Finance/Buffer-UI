import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { White12pxText } from '@Views/TradePage/Components/TextWrapper';
import styled from '@emotion/styled';
import { DirectionChip } from './DirectionChip';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { QueuedChip } from './QueuedChip';
import { Bar } from '@Views/Common/Toast/style';
import { TradePoolChip } from './TradePoolChip';
import { TradeTypeChip } from './TradeTypeChip';
import { TradeDataView } from './TradeDataView';
import { TradeActionButton } from './TradeActionButton';
import { OngoingTradeSchema } from '@Views/TradePage/Hooks/ongoingTrades';

const TradeCardBackground = styled.div`
  padding: 12px 16px;
  background-color: #141823;
  border-radius: 5px;
`;

export const TradeCard = ({ trade }: { trade: OngoingTradeSchema }) => {
  const pairName = 'BTC-USD';
  const isUp = true;
  const width = 50;
  const assetName = 'USDC';
  const tradeType = 'Limit order';
  const isQueued = true;

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
        <QueuedChip />
      </ColumnGap>
      {/* <div className="relative">
        <Bar width={width + '%'} className={isUp ? 'bg-green' : 'bg-red'} />
      </div> */}
      <TradePoolChip assetName={assetName} />

      <TradeDataView isQueued={isQueued} />
      <TradeActionButton isQueued={isQueued} />
    </TradeCardBackground>
  );
};
