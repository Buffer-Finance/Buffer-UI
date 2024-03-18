import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';
import { ILeaderboardQuery } from './useDailyLeaderBoardData';

export const Participants: React.FC<{
  data: ILeaderboardQuery | undefined;
}> = ({ data }) => {
  if (data === undefined) {
    return <Skeleton className="w-[50px] !h-6 lc " />;
  } else {
    let totalParticipants = 0;
    if (typeof data.total_count === 'number')
      totalParticipants = data.total_count;
    else {
      totalParticipants = data.total_count.length;
    }

    if (totalParticipants === undefined) {
      if (data.winners !== undefined && data.loosers !== undefined) {
        totalParticipants = data.winners.length + data.loosers.length;
      } else if (data.winners !== undefined && data.loosers === undefined) {
        totalParticipants = data.winners.length;
      } else if (data.winners === undefined && data.loosers !== undefined) {
        totalParticipants = data.loosers.length;
      }
    }
    return <div>{totalParticipants ?? 0}</div>;
  }
};

export const TotalTrades: React.FC<{
  dayId: number;
  graphUrl: string;
}> = ({ graphUrl, dayId }) => {
  const { data } = useTotalData(dayId, graphUrl);
  const totalTrades = data?.totalDatas?.[0]?.trades;
  if (totalTrades === undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;

  return <div>{totalTrades}</div>;
};

export const TotalVolume: React.FC<{
  dayId: number;
  graphUrl: string;
}> = ({ dayId, graphUrl }) => {
  const { data } = useTotalData(dayId, graphUrl);
  const totalVolume = data?.totalDatas?.[0]?.volume;
  console.log('data', data);
  if (!totalVolume) return <Skeleton className="w-[50px] !h-6 lc " />;
  return <div>{toFixed(divide(totalVolume, 6) as string, 2)} USDC</div>;
};

const useTotalData = (dayId: number, graphUrl: string) => {
  return useSWR(`totalDailyData-${dayId}`, {
    fetcher: async () => {
      const leaderboardQuery = `
        totalDatas(where: {id: "${dayId}"}) {
          id
          trades
          volume
        }
        `;
      const query = `{${leaderboardQuery}}`;
      const response = await axios.post(
        `https://subgraph.satsuma-prod.com/${
          import.meta.env.VITE_SATSUMA_KEY
        }/bufferfinance/arbitrum-mainnet/version/v2.6.9-points-leaderboards/api`,
        {
          query,
        }
      );

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
