import { toFixed } from '@Utils/NumString';
import {
  divide,
  gte,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { TradeState } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useSpread } from '@Views/TradePage/Hooks/useSpread';
import { queuets2priceAtom } from '@Views/TradePage/atoms';
import { TradeType, marketType, poolInfoType } from '@Views/TradePage/type';
import { secondsToHHMM } from '@Views/TradePage/utils';
import { calculateOptionIV } from '@Views/TradePage/utils/calculateOptionIV';
import styled from '@emotion/styled';
import { useAtom, useAtomValue } from 'jotai';
import React, { useMemo } from 'react';
import {
  getExpiry,
  getLockedAmount,
  getProbability,
  getStrike,
} from '../../AccordionTable/Common';
import { CurrentPrice } from './CurrentPrice';
import { DataCol } from './DataCol';
import { StrikePrice } from './StrikePrice';
import { getJackpotKey, useJackpotManager } from 'src/atoms/JackpotState';
import { JackpotChip } from '@Views/Jackpot/JackpotChip';
import { isABRouter } from '@Views/TradePage/config';
import { priceAtom } from '@Hooks/usePrice';
import { Probability } from '@Views/ABTradePage/Views/AccordionTable/OngoingTradesTable';

export const TradeDataView: React.FC<{
  trade: TradeType;
  configData: marketType;
  poolInfo: poolInfoType;
  className?: string;
}> = ({ trade, configData, poolInfo, className = '' }) => {
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const { data: allSpreads } = useSpread();
  const spread = allSpreads?.[trade.market.tv_id].spread ?? 0;
  const [marketPrice] = useAtom(priceAtom);

  const { isPriceArrived } = getStrike(trade, cachedPrices, spread);
  const lockedAmmount = getLockedAmount(trade, cachedPrices);
  console.log(`TradeDataView-trade: `, trade, poolInfo);
  const isAb = isABRouter(trade.router);
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
        <Display
          data={divide(trade.trade_size, poolInfo.decimals)}
          unit={poolInfo.token}
          precision={2}
        />
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
          <RowGap gap="4px mr-5">
            <span>PnL</span>&nbsp;
            <span>|</span>&nbsp;
            <span className="text-[10px]">probability</span>
          </RowGap>
        ),
        desc: (
          <span>
            {isAb ? null : (
              <Pnl
                configData={trade.market}
                trade={trade}
                poolInfo={poolInfo}
              />
            )}
            <Probability isColored trade={trade} marketPrice={marketPrice} />{' '}
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
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            unit={poolInfo.token}
            precision={2}
          />
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
        desc: <span>{secondsToHHMM(trade.period)}</span>,
      },
      {
        head: <span>Trade Size</span>,
        desc: (
          <Display
            data={divide(trade.trade_size, poolInfo.decimals)}
            unit={poolInfo.token}
            precision={2}
          />
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
  if (trade.is_above === undefined) return <span>-</span>;
  return <PnlData trade={trade} poolInfo={poolInfo} configData={configData} />;
};

const PnlData: React.FC<{
  trade: TradeType;
  poolInfo: poolInfoType;
  configData: marketType;
}> = ({ trade, poolInfo, configData }) => {
  const cachedPrices = useAtomValue(queuets2priceAtom);
  const currentEpoch = Math.round(new Date().getTime() / 1000);
  const expiration = getExpiry(trade);
  const isExpired = currentEpoch > expiration;
  const lockedAmmount = getLockedAmount(trade, cachedPrices);
  const { pnl: earlyPnl } = useEarlyPnl({
    trade,
    poolInfo,
    configData,
    lockedAmmount,
  });
  const { earlycloseAmount, isWin, probability } = earlyPnl;
  if (!probability) return <span key={'calculating'}>Calculating...</span>;
  let pnl = (
    <span className="text-red" key={'lose-pnl'}>
      {toFixed(earlycloseAmount, 2)}
    </span>
  );
  if (isWin) {
    pnl = (
      <span className="text-green" key={'win-pnl'}>
        +{toFixed(earlycloseAmount, 2)}
      </span>
    );
  }
  if (isExpired) return <span key={'expired'}>Calculating...</span>;
  return (
    <RowGap gap="2px" className="!items-end" key={'pnl'}>
      <span>{pnl}</span>
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
    () =>
      getProbability(
        trade,
        +currentPrice,
        calculateOptionIV(
          trade.is_above ?? false,
          trade.strike / 1e8,
          +currentPrice,
          trade.pool.IV,
          trade.pool.IVFactorITM,
          trade.pool.IVFactorOTM
        ) / 1e4
      ),
    [trade, currentPrice]
  );
  if (!probability) probability = 0;
  return {
    pnl: calculatePnlForProbability({
      trade,
      probability,
      decimals: poolInfo.decimals,
      lockedAmmount,
    }),
    probability,
  };
};

export const getPnlForTrade = ({
  trade,
  poolInfo,
  probability,
  lockedAmmount,
}: {
  trade: TradeType;
  poolInfo: poolInfoType;
  probability: number;
  lockedAmmount?: string;
}) => {
  return calculatePnlForProbability({
    trade,
    probability,
    decimals: poolInfo.decimals,
    lockedAmmount,
  });
};

export const calculatePnlForProbability = ({
  trade,
  probability,
  lockedAmmount,
  decimals,
}: {
  trade: TradeType;
  probability: number;
  decimals: number;
  lockedAmmount?: string;
}) => {
  const lockedAmount = trade.locked_amount || lockedAmmount;
  const tradeSize = trade.trade_size;

  const earlycloseAmount = divide(
    subtract(
      multiply(lockedAmount?.toString() ?? '0', (probability / 100).toString()),
      tradeSize.toString()
    ),
    decimals
  ) as string;

  const isWin = gte(earlycloseAmount, '0');
  return { earlycloseAmount, isWin, probability };
};
