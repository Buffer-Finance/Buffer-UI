import InfoIcon from '@SVG/Elements/InfoIcon';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { BetState } from '@Views/AboveBelow/Hooks/useAheadTrades';
import { IGQLHistory } from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { Display } from '@Views/Common/Tooltips/Display';
import { DataCol } from '@Views/TradePage/Views/BuyTrade/ActiveTrades/DataCol';
import styled from '@emotion/styled';
import { Probability } from '../../Tables/Components/Probability';
import { Price } from './Price';

export const Data: React.FC<{
  trade: IGQLHistory;
  className?: string;
}> = ({ trade, className }) => {
  let TradeData = [
    {
      head: <span>Strike Price</span>,
      desc: (
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
      desc:
        trade.state === BetState.queued ? (
          <div className="flex gap-2 items-center">
            <Display
              data={divide(
                multiply(
                  trade.maxFeePerContract as string,
                  trade.numberOfContracts as string
                ) as string,
                trade.market.poolInfo.decimals
              )}
              precision={2}
              className="!justify-start"
              unit={trade.market.poolInfo.token}
              label={'<'}
            />
            <InfoIcon
              tooltip="The max amount of trade considering the slippage"
              sm
            />
          </div>
        ) : (
          <Display
            data={divide(trade.totalFee ?? 0, trade.market.poolInfo.decimals)}
            unit={trade.market.poolInfo.token}
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
