import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { Probability } from '@Views/TradePage/Views/AccordionTable/OngoingTradesTable';
import { DataCol } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/DataCol';
import { TradeType } from '@Views/TradePage/type';
import styled from '@emotion/styled';
import { Price } from './Price';

export const Data: React.FC<{
  trade: TradeType;
  className?: string;
}> = ({ trade, className }) => {
  let TradeData = [
    {
      head: <span>Strike Price</span>,
      desc:
        trade.state === 'QUEUED' ? (
          <>-</>
        ) : (
          <Display
            data={divide(trade.strike, 8)}
            precision={trade.market.price_precision.toString().length - 1}
            className="!justify-start"
          />
        ),
    },
    {
      head: <span>Current price</span>,
      desc: <Price tv_id={trade.market.tv_id} />,
    },
    {
      head: <span>Trade Size</span>,
      desc: (
        <div className="flex gap-2 items-center">
          <Display
            data={divide(trade.trade_size, trade.market.poolInfo.decimals)}
            precision={2}
            className="!justify-start"
            unit={trade.market.poolInfo.token}
          />
        </div>
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
