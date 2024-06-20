import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';

export const Participants: React.FC<{
  dayId: number;
  graphUrl: string;
  count: number | string;
}> = ({ dayId, graphUrl, count }) => {
  // const { data } = useTotalData(dayId, graphUrl);
  if (count === undefined) return <Skeleton className="w-[50px] !h-6 lc " />;
  const totalparticipents = count;

  return <div>{totalparticipents}</div>;
};

export const TotalTrades: React.FC<{
  dayId: number;
  graphUrl: string;
  count: string | undefined;
}> = ({ graphUrl, dayId, count }) => {
  if (count === undefined) return <Skeleton className="w-[50px] !h-6 lc " />;

  return <div>{count}</div>;
};

export const TotalVolume: React.FC<{
  dayId: number;
  volume: string | undefined;
  graphUrl: string;
}> = ({ dayId, graphUrl, volume }) => {
  const totalVolume = volume;
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
    refreshInterval: 1000 * 60,
  });
};
