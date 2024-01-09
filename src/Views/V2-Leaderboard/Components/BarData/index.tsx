import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { add, divide } from '@Utils/NumString/stringArithmatics';
import { Col } from '@Views/Common/ConfirmationModal';
import { useWinnersByPnlWeekly } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/useWinnersByPnlWeekly';
import { leagueType } from '@Views/V2-Leaderboard/Leagues/atom';
import { leaguesConfig } from '@Views/V2-Leaderboard/Leagues/config';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import { Skeleton } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { descClass, headClass } from '../../Incentivised';
import { ContestFilterDD } from '../ContestFilterDD';

export const BarData: React.FC<{
  RewardPool: ReactNode;
  week: number;
  resetTimestamp: number;
  offset: string | null;
  setOffset: (day: string) => void;
  activeChainId: number;
  league: leagueType;
  config: leaguesConfig;
}> = ({
  RewardPool,
  week,
  resetTimestamp,
  offset,
  setOffset,
  activeChainId,
  config,
  league,
}) => {
  const { address: account } = useUserAccount();
  const { data, error, isValidating } = useWinnersByPnlWeekly({
    activeChainId,
    config,
    league,
    offset,
    week,
    account,
  });

  if (error) return <div>error</div>;
  const numOfParticipants = data?.weeklyLeaderboards?.length;
  return (
    <div className="flex items-center justify-start my-6 sm:!w-full sm:flex-wrap sm:gap-y-5 whitespace-nowrap">
      <Col
        head={'Reward Pool'}
        desc={RewardPool}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={`Countdown ${week ? `(#${week})` : ''}`}
        desc={<RestCountdown resetTimestamp={resetTimestamp} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Trades'}
        desc={<TotalTrades weeklyLeaderboards={data?.weeklyLeaderboards} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Volume'}
        desc={<TotalVolume weeklyLeaderboards={data?.weeklyLeaderboards} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Participants'}
        desc={
          numOfParticipants !== undefined ? (
            numOfParticipants
          ) : (
            <Skeleton className="w-[50px] !h-6 lc " />
          )
        }
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />{' '}
      <Col
        head={'Week'}
        desc={
          <ContestFilterDD
            count={week ?? 0}
            offset={offset}
            setOffset={setOffset}
          />
        }
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
    </div>
  );
};

const RestCountdown: React.FC<{ resetTimestamp: number }> = ({
  resetTimestamp,
}) => {
  const midnightTimeStamp = resetTimestamp / 1000;

  const stopwatch = useStopWatch(midnightTimeStamp);
  if (stopwatch === null)
    return <Skeleton variant="text" width={100} height={20} />;
  return <>{stopwatch}</>;
};

const TotalTrades: React.FC<{ weeklyLeaderboards: ILeague[] | undefined }> = ({
  weeklyLeaderboards,
}) => {
  const totalTrades = useMemo(() => {
    if (weeklyLeaderboards === undefined) return undefined;
    return weeklyLeaderboards.reduce((acc, curr) => acc + curr.totalTrades, 0);
  }, [weeklyLeaderboards]);
  if (totalTrades === undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;
  console.log(totalTrades);
  return <div>{totalTrades}</div>;
};

const TotalVolume: React.FC<{ weeklyLeaderboards: ILeague[] | undefined }> = ({
  weeklyLeaderboards,
}) => {
  const totalVolume = useMemo(() => {
    if (weeklyLeaderboards === undefined) return undefined;
    return weeklyLeaderboards.reduce((acc, curr) => add(acc, curr.volume), '0');
  }, [weeklyLeaderboards]);
  if (totalVolume === undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;
  return <div>{toFixed(divide(totalVolume, 6) as string, 2)} USDC</div>;
};
