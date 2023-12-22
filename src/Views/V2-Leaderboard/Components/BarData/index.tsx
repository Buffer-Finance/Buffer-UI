import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Col } from '@Views/Common/ConfirmationModal';
import { leagueType } from '@Views/V2-Leaderboard/Leagues/atom';
import { leaguesConfig } from '@Views/V2-Leaderboard/Leagues/config';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import { Skeleton } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { descClass, headClass } from '../../Incentivised';
import { ContestFilterDD } from '../ContestFilterDD';
import { useBarData } from './useBarData';

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
  const { data, error, isValidating } = useBarData({
    offset,
    week,
    activeChainId,
    league,
    config,
  });

  if (error) return <div>error</div>;
  const numOfParticipants = data?.weeklyLeaderboards?.length;
  const volume = data?.reward?.[0]?.totalFee;
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
        desc={
          volume ? (
            toFixed(divide(volume, 6) as string, 2)
          ) : (
            <Skeleton className="w-[50px] !h-6 lc " />
          )
        }
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Participants'}
        desc={
          numOfParticipants ? (
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
  return <div>{totalTrades}</div>;
};
