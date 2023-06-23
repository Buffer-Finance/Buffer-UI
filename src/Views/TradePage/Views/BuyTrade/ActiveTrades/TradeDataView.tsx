import styled from '@emotion/styled';
import { DataCol } from './DataCol';
import {
  OngoingTradeSchema,
  TradeType,
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
import {
  getExpiry,
  getLockedAmount,
  getProbability,
  getStrike,
} from '../../AccordionTable/Common';
import { secondsToHHMM } from '@Views/TradePage/utils';
import { useAtomValue } from 'jotai';
import { queuets2priceAtom } from '@Views/TradePage/atoms';
import { TradeState } from '@Views/TradePage/Hooks/useOngoingTrades';

export const TradeDataView: React.FC<{
  trade: TradeType;
  configData: marketType;
  poolInfo: poolInfoType;
  className?: string;
}> = ({ trade, configData, poolInfo, className = '' }) => {
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { isPriceArrived } = getStrike(trade, cachedPrices);
  const lockedAmmount = getLockedAmount(trade, cachedPrices);

  const isQueued = trade.state === TradeState.Queued && !isPriceArrived;

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
            <span className="text-[10px]">probability</span>
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
        head: <span>Max Payout</span>,
        desc: (
          <span>
            {toFixed(divide(lockedAmmount, poolInfo.decimals) as string, 2)}{' '}
            {poolInfo.token}
          </span>
        ),
      },
    ];
  if (trade.is_limit_order && trade.state === TradeState.Queued) {
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
  trade: TradeType;
  poolInfo: poolInfoType;
  configData: marketType;
}> = ({ trade, poolInfo, configData }) => {
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const currentEpoch = Math.round(new Date().getTime() / 1000);
  const expiration = getExpiry(trade);
  const isExpired = currentEpoch > expiration;
  const lockedAmmount = getLockedAmount(trade, cachedPrices);
  const { earlycloseAmount, isWin, probability } = useEarlyPnl({
    trade,
    poolInfo,
    configData,
    lockedAmmount,
  });
  let pnl = <span className="text-red">{toFixed(earlycloseAmount, 2)}</span>;
  if (isWin) {
    pnl = <span className="text-green">+{toFixed(earlycloseAmount, 2)}</span>;
  }
  if (isExpired) return <>Calculating...</>;
  return (
    <RowGap gap="2px" className="!items-end">
      {pnl}
      <span className="text-[10px] text-[#6F6E84]">
        {probability.toFixed(2)}%
      </span>
    </RowGap>
  );
};

export const useEarlyPnl = ({
  trade,
  poolInfo,
  configData,
  lockedAmmount,
}: {
  trade: TradeType;
  poolInfo: poolInfoType;
  configData: marketType;
  lockedAmmount?: string;
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
  const lockedAmount = trade.locked_amount || lockedAmmount;
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
