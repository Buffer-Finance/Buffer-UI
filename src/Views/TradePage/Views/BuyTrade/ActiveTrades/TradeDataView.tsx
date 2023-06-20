import styled from '@emotion/styled';
import { DataCol } from './DataCol';
import {
  OngoingTradeSchema,
  marketType,
  poolInfoType,
} from '@Views/TradePage/type';
import { divide, multiply, subtract } from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';
import { StrikePrice } from './StrikePrice';
import { CurrentPrice } from './CurrentPrice';
import { RowGap } from '@Views/TradePage/Components/Row';
import React from 'react';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { getProbability } from '../../AccordionTable/Common';
import { secondsToHHMM } from '@Views/TradePage/utils';

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
        head: (
          <RowGap gap="4px">
            <span>Pnl</span>
            <span>|</span>
            <span className="text-[7px]">probability</span>
          </RowGap>
        ),
        desc: (
          <span>
            <Pnl configData={configData} trade={trade} poolInfo={poolInfo} />
          </span>
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
        head: <span>payout</span>,
        desc: (
          <span>
            {toFixed(
              divide(trade.locked_amount, poolInfo.decimals) as string,
              2
            )}{' '}
            {poolInfo.token}
          </span>
        ),
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
        desc: <>{secondsToHHMM(trade.period)}</>,
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

const Pnl: React.FC<{
  trade: OngoingTradeSchema;
  poolInfo: poolInfoType;
  configData: marketType;
}> = ({ trade, poolInfo, configData }) => {
  const { currentPrice } = useCurrentPrice({
    token0: configData.token0,
    token1: configData.token1,
  });
  const probability = getProbability(trade, +currentPrice);
  if (!probability) return <span>-</span>;
  const isUp = trade.is_above;
  const lockedAmount = divide(trade.locked_amount, poolInfo.decimals) as string;
  const strike = divide(trade.strike, 1e8) as string;
  const isWin = isUp ? currentPrice > strike : currentPrice < strike;
  const tradeSize = divide(trade.trade_size, poolInfo.decimals) as string;
  const lossAmount = divide(
    multiply(
      subtract(lockedAmount ?? '0', tradeSize ?? '0') ?? '0',
      probability?.toString() ?? '0'
    ),
    2
  );
  const winAmount = divide(multiply(lockedAmount, probability.toString()), 2);

  let pnl = <span className="text-red">-{toFixed(lossAmount, 2)}</span>;
  if (isWin) {
    pnl = <span className="text-green">+{toFixed(winAmount, 2)}</span>;
  }
  return (
    <RowGap gap="2px" className="!items-end">
      {pnl}
      <span className="text-[9px] text-[#6F6E84]">
        {probability.toFixed(2)}%
      </span>
    </RowGap>
  );
};
