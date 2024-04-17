import { getDHMSFromSeconds } from '@Utils/Dates/displayDateTime';
import { divide, gte, subtract } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { Skeleton } from '@mui/material';
import { Chain } from 'viem';
import { useBlpRate } from '../Hooks/useBlpRate';
import { useCurrentPoolStats } from '../Hooks/useCurrentPoolStats';
import { useUSDCapr } from '../Hooks/useUSDCapr';
import { StatsContainer } from '../Styles';
import { poolsType } from '../types';
import { DataColumn, defaultDataStyle } from './DataColumn';

export const PoolStats: React.FC<{
  activePool: poolsType;
  readCallData: { [callId: string]: string[] };
  activeChain: Chain;
}> = ({ activePool, readCallData, activeChain }) => {
  const { data, error } = useBlpRate(activeChain, activePool);
  const { data: poolStatsData, error: poolStatsError } = useCurrentPoolStats(
    activeChain,
    activePool
  );
  const { usdcApr: apr } = useUSDCapr(activeChain, activePool);
  const isDataLoading = !data && !error;
  const isPoolStatsLoading = !poolStatsData && !poolStatsError;
  const lockPeriod = readCallData[activePool + '-lockupPeriod']?.[0];
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  const decimals = activePool === 'uBLP' ? 6 : 18;

  if (data === undefined)
    return (
      <StatsContainer>
        <Skeleton className="!h-full !w-full lc " />
      </StatsContainer>
    );
  const totalPnl = divide(
    subtract(poolStatsData?.profit ?? '0', poolStatsData?.loss ?? '0'),
    decimals
  ) as string;
  return (
    <StatsContainer>
      <DataColumn
        title="TVL"
        value={
          isDataLoading ? (
            <Skeleton className="w-[50px] !h-5 lc !transform-none " />
          ) : (
            <span className={defaultDataStyle}>
              <Display
                data={divide(data.tokenXamount, decimals) as string}
                unit={unit}
                precision={2}
                className="!justify-start"
              />
            </span>
          )
        }
      />
      <DataColumn
        title="Lock Period"
        value={
          lockPeriod !== undefined ? (
            <span className={defaultDataStyle}>
              {getDHMSFromSeconds(parseInt(lockPeriod))}
            </span>
          ) : (
            <Skeleton className="w-[50px] !h-5 lc !transform-none " />
          )
        }
      />
      <DataColumn
        title="Current APR"
        value={
          apr !== undefined ? (
            <span className={defaultDataStyle}>
              <Display
                data={apr}
                precision={2}
                unit="%"
                className="!justify-start"
              />
            </span>
          ) : (
            <Skeleton className="w-[50px] !h-5 lc !transform-none " />
          )
        }
      />
      <DataColumn
        title="uBLP Price"
        value={
          isDataLoading ? (
            <Skeleton className="w-[50px] !h-5 lc !transform-none " />
          ) : (
            <span className={defaultDataStyle}>
              <Display
                data={divide(data.price, 8)}
                precision={2}
                className="!justify-start"
              />
            </span>
          )
        }
      />
      <DataColumn
        title="Accumulated PnL"
        value={
          isPoolStatsLoading !== undefined ? (
            <span
              className={
                `${gte(totalPnl, '0') ? 'text-green' : 'text-red'}` +
                ' ' +
                defaultDataStyle
              }
            >
              <Display
                data={totalPnl}
                className="!justify-start"
                unit={unit}
                precision={2}
              />
            </span>
          ) : (
            <Skeleton className="w-[50px] !h-5 lc !transform-none " />
          )
        }
      />
    </StatsContainer>
  );
};
