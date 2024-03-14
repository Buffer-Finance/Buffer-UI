import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Col } from '@Views/Common/ConfirmationModal';
import { IconToolTip } from '@Views/TradePage/Components/IconToolTip';
import { useWinnersByPnlWeekly } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/useWinnersByPnlWeekly';
import { leagueType } from '@Views/V2-Leaderboard/Leagues/atom';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import { ReactNode } from 'react';
import useSWR from 'swr';
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
  graphUrl: string;
  weekId: number;
}> = ({
  RewardPool,
  week,
  resetTimestamp,
  offset,
  setOffset,
  activeChainId,
  league,
  graphUrl,
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

  if (error) return <div>error</div>;
  const numOfParticipants = data?.total_count;
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
        desc={<TotalTrades weekId={weekId} graphUrl={graphUrl} />}
        descClass={descClass}
        headClass={headClass}
        className="winner-card"
      />
      <Col
        head={'Volume'}
        desc={<TotalVolume weekId={weekId} graphUrl={graphUrl} />}
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
      <Col
        head={'Your League'}
        desc={<League graphUrl={graphUrl} weekId={weekId} />}
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

const TotalTrades: React.FC<{
  weekId: number;
  graphUrl: string;
}> = ({ graphUrl, weekId }) => {
  const { data } = useTotalData(weekId, graphUrl);
  const totalTrades = data?.totalDatas?.[0]?.trades;
  if (totalTrades === undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;

  return <div>{totalTrades}</div>;
};

const TotalVolume: React.FC<{
  weekId: number;
  graphUrl: string;
}> = ({ weekId, graphUrl }) => {
  const { data } = useTotalData(weekId, graphUrl);
  const totalVolume = data?.totalDatas?.[0]?.volume;
  console.log('data', data);
  if (!totalVolume) return <Skeleton className="w-[50px] !h-6 lc " />;
  return <div>{toFixed(divide(totalVolume, 6) as string, 2)} USDC</div>;
};

export const League: React.FC<{
  weekId: number;
  graphUrl: string;
}> = ({ weekId, graphUrl }) => {
  const { address: userAddress } = useUserAccount();
  const { data } = useSWR(`league-${weekId}-userAddress-${userAddress}`, {
    fetcher: async () => {
      const leaderboardQuery = `
      weeklyLeaderboards(where: {userAddress: "${userAddress}", weekId: "${weekId}"}) {
        league
      }
      `;
      const query = `{${leaderboardQuery}}`;
      const response = await axios.post(graphUrl, {
        query,
      });

      return response.data?.data as {
        weeklyLeaderboards: {
          league: string;
        }[];
      };
    },
  });

  let league = 'Bronze';
  if (data?.weeklyLeaderboards?.[0]?.league) {
    league = data?.weeklyLeaderboards?.[0]?.league;
  }
  return (
    <div className="flex gap-2 items-center">
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

const useTotalData = (weekId: number, graphUrl: string) => {
  return useSWR(`totalWeeklyData-${weekId}`, {
    fetcher: async () => {
      const leaderboardQuery = `
      totalDatas(where: {id: "${weekId}"}) {
        id
        trades
        volume
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
        }[];
      };
    },
  });
};
