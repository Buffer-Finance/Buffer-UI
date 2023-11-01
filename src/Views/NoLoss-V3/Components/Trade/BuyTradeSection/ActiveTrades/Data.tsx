import { divide, toFixed } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { BetState } from '@Views/NoLoss-V3/Hooks/useAheadTrades';
import { IGQLHistory } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { DataCol } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/DataCol';
import { StrikePrice } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/StrikePrice';
import styled from '@emotion/styled';
import { Price } from './Price';
import { Probability } from './Probability';

export const Data: React.FC<{
  trade: IGQLHistory;
  className?: string;
}> = ({ trade, className }) => {
  let TradeData = [
    {
      head: <span>Strike Price</span>,
      desc: (
        <StrikePrice
          slippage={+trade.slippage! ?? 0}
          strike={toFixed(
            divide(trade.strike, 8) as string,
            trade.chartData.price_precision.toString().length - 1
          )}
          isQueued={trade.state === BetState.queued}
        />
      ),
    },
    {
      head: <span>Current price</span>,
      desc: <Price tv_id={trade.chartData.tv_id} />,
    },
    {
      head: <span>Trade Size</span>,
      desc: (
        <Display
          data={divide(trade.totalFee ?? 0, 18)}
          // unit={poolInfo.token}
          precision={2}
        />
      ),
    },
    {
      head: <span>Probability</span>,
      desc: <Probability trade={trade} />,
    },
  ];

  return (
    <TradeDataViewBackground className={className}>
      {TradeData.map((data, index) => (
        <DataCol {...data} key={index} />
      ))}
    </TradeDataViewBackground>
  );
};

const TradeDataViewBackground = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  row-gap: 8px;
  margin-top: 8px;
`;
