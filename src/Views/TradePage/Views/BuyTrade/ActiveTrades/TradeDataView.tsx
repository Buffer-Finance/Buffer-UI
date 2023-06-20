import styled from '@emotion/styled';
import { DataCol } from './DataCol';
import {
  OngoingTradeSchema,
  marketType,
  poolInfoType,
} from '@Views/TradePage/type';
import {
  divide,
  gte,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';
import { StrikePrice } from './StrikePrice';
import { CurrentPrice } from './CurrentPrice';
import { RowGap } from '@Views/TradePage/Components/Row';
import React, { useMemo } from 'react';
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
  if (trade.is_limit_order && isQueued) {
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
  const { earlycloseAmount, isWin, probability } = useEarlyPnl({
    trade,
    poolInfo,
    configData,
  });
  let pnl = <span className="text-red">{toFixed(earlycloseAmount, 2)}</span>;
  if (isWin) {
    pnl = <span className="text-green">+{toFixed(earlycloseAmount, 2)}</span>;
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

export const useEarlyPnl = ({
  trade,
  poolInfo,
  configData,
}: {
  trade: OngoingTradeSchema;
  poolInfo: poolInfoType;
  configData: marketType;
}) => {
  const { currentPrice } = useCurrentPrice({
    token0: configData.token0,
    token1: configData.token1,
  });
  let probability = useMemo(
    () => getProbability(trade, +currentPrice),
    [trade, currentPrice]
  );
  if (!probability) probability = 0;
  const lockedAmount = trade.locked_amount;
  const tradeSize = trade.trade_size;

  const earlycloseAmount = divide(
    subtract(
      multiply(lockedAmount?.toString() ?? '0', (probability / 100).toString()),
      tradeSize.toString()
    ),
    poolInfo.decimals
  ) as string;

  const isWin = gte(earlycloseAmount, '0');
  return { earlycloseAmount, isWin, probability };
};
