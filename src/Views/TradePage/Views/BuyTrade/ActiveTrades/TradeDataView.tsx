import styled from '@emotion/styled';
import { DataCol } from './DataCol';
import { OngoingTradeSchema } from '@Views/TradePage/Hooks/ongoingTrades';
import { marketType, poolInfoType, chartDataType } from '@Views/TradePage/type';
import { divide } from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';
import { StrikePrice } from './StrikePrice';
import { CurrentPrice } from './CurrentPrice';

export const TradeDataView: React.FC<{
  trade: OngoingTradeSchema;
  configData: marketType;
  poolInfo: poolInfoType;
  isQueued: boolean;
  className?: string;
}> = ({ trade, configData, poolInfo, isQueued, className = '' }) => {
  let TradeData = [
    {
      head: <span>Strike Price</span>,
      desc: (
        <StrikePrice
          slippage={trade.slippage}
          strike={toFixed(trade.strike / 1e8, 2)}
        />
      ),
    },
    {
      head: <span>Current price</span>,
      desc: (
        <CurrentPrice token0={configData.token0} token1={configData.token1} />
      ),
    },
    {
      head: <span>Trade Size</span>,
      desc: (
        <span>
          {divide(trade.trade_size, poolInfo.decimals)} {poolInfo.token}
        </span>
      ),
    },
    {
      head: <span>Probability</span>,
      desc: <span>-</span>,
    },
  ];
  if (!isQueued)
    TradeData = [
      {
        head: <span>Probability</span>,
        desc: <span>50%</span>,
      },
      {
        head: <span>Current price</span>,
        desc: (
          <CurrentPrice token0={configData.token0} token1={configData.token1} />
        ),
      },
      {
        head: <span>Trade Size</span>,
        desc: (
          <span>
            {divide(trade.trade_size, poolInfo.decimals)} {poolInfo.token}
          </span>
        ),
      },
      {
        head: <span>payout</span>,
        desc: <span>1.2345</span>,
      },
    ];
  if (trade.is_limit_order) {
    TradeData = [
      {
        head: <span>Trigger Price</span>,
        desc: (
          <StrikePrice
            slippage={trade.slippage}
            strike={toFixed(trade.strike / 1e8, 2)}
          />
        ),
      },
      {
        head: <span>Duration</span>,
        desc: <></>,
      },
      {
        head: <span>Trade Size</span>,
        desc: (
          <span>
            {divide(trade.trade_size, poolInfo.decimals)} {poolInfo.token}
          </span>
        ),
      },
      {
        head: <span>Current price</span>,
        desc: (
          <CurrentPrice token0={configData.token0} token1={configData.token1} />
        ),
      },
    ];
  }
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
`;
