import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Col } from '@Views/Common/ConfirmationModal';
import { Display } from '@Views/Common/Tooltips/Display';
import { IconToolTip } from '@Views/TradePage/Components/IconToolTip';
import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import { useWinnersByPnlWeekly } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/useWinnersByPnlWeekly';
import { leagueType } from '@Views/V2-Leaderboard/Leagues/atom';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import { descClass, headClass } from '../../Incentivised';
import { ContestFilterDD } from '../ContestFilterDD';
import { WEEKLY_WIN_REWARDS_ALLOCATION_BY_LEAGUE } from '@Views/V2-Leaderboard/config';
import { useDailyLeaderboardData } from '@Views/V2-Leaderboard/Incentivised/useDailyLeaderBoardData';
import { useMemo } from 'react';

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const BarData: React.FC<{
  week: number;
  resetTimestamp: number;
  offset: string | null;
  setOffset: (day: string) => void;
  activeChainId: number;
  league: leagueType;
  graphUrl: string;
  weekId: number;
}> = ({
  week,
  resetTimestamp,
  offset,
  setOffset,
  activeChainId,
  league,
  weekId,
}) => {
  const { address: account } = useUserAccount();
  const { data, error, isValidating } = useWinnersByPnlWeekly({
    activeChainId,
    league,
    offset,
    week,
    account,
  });

  // const { totalVolume, totalNumberOfTrades, participants } = useMemo(() => {
  //   let totalVolume = 0;
  //   let totalNumberOfTrades = 0;
  //   let participants = 0;
  //   if (data) {
  //     (data.loosers || []).concat(data.winners || []).forEach((league) => {
  //       totalVolume += Number(league.totalVolume);
  //       totalNumberOfTrades += Number(league.totalTrades);

  //       participants += 1;
  //     });
  //   }
  //   return { totalVolume, totalNumberOfTrades, participants };
  // }, [data]);
  if (error) return <div>error</div>;

  return (
    <div className="flex items-center justify-start my-6 sm:!w-full sm:flex-wrap sm:gap-y-5 whitespace-nowrap">
      <Col
        head={'Reward Pool'}
        desc={<RewardPool league={league} />}
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
        desc={<TotalTrades count={data?.stats.total_trades} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Volume'}
        desc={<TotalVolume volume={data?.stats.total_volume} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Participants'}
        desc={<Participants count={data?.stats.participants} />}
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
      <Col
        head={'Your League'}
        desc={<League weekId={weekId} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
    </div>
  );
};

const RewardPool: React.FC<{ league: leagueType }> = ({ league }) => {
  const WEEKLY_LOSS_REWARDS_ALLOCATION_BY_LEAGUE = {
    diamond: 800,
    platinum: 500,
    silver: 400,
    gold: 200,
    bronze: 100,
  };
  return (
    <Display
      data={WEEKLY_WIN_REWARDS_ALLOCATION_BY_LEAGUE[league]}
      unit="ARB"
      precision={0}
    />
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
export const Participants: React.FC<{
  count: number | string;
}> = ({ count }) => {
  // const { data } = useTotalData(dayId, graphUrl);
  if (count === undefined) return <Skeleton className="w-[50px] !h-6 lc " />;
  const totalparticipents = count;

  return <div>{totalparticipents}</div>;
};

export const TotalTrades: React.FC<{
  count: number | undefined;
}> = ({ count }) => {
  if (count === undefined) return <Skeleton className="w-[50px] !h-6 lc " />;

  return <div>{count}</div>;
};

export const TotalVolume: React.FC<{
  volume: number | undefined;
}> = ({ volume }) => {
  const totalVolume = volume;
  if (totalVolume == undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;
  return <div>{toFixed(divide(totalVolume, 6) as string, 2)} USDC</div>;
};

export const League: React.FC<{
  weekId: number;
}> = ({ weekId }) => {
  const { address: userAddress } = useUserAccount();
  const { data } = useDailyLeaderboardData('Bronze');

  let league = 'Bronze';
  if (data?.userLeague) {
    league = data?.userLeague;
  }
  return (
    <div className="flex gap-2 items-center sm:justify-center">
      <div className="mb-1"> {league}</div>
      <IconToolTip
        content={
          <span>
            Leagues are locked at the start of the week.
            <br />
            Criteria for leagues:
          </span>
        }
      />
    </div>
  );
};

const useTotalData = (weekId: number, graphUrl: string, league: string) => {
  return useSWR(`totalWeeklyData-${weekId}-${league}`, {
    fetcher: async () => {
      const leaderboardQuery = `
      totalDatas(where: {id: "${weekId}${league}"}) {
        id
        trades
        volume
        participents
      }
      `;
      const query = `{${leaderboardQuery}}`;
      const response = await axios.post(graphUrl, {
        query,
      });
      return response.data?.data as {
        totalDatas: {
          id: string;
          trades: string;
          volume: string;
          participents: string;
        }[];
      };
    },
  });
};
