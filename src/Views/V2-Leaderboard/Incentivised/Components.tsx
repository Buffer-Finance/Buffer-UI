import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import useSWR from 'swr';

export const Participants: React.FC<{
  dayId: number;
  graphUrl: string;
}> = ({ dayId, graphUrl }) => {
  const { data } = useTotalData(dayId, graphUrl);
  if (data?.totalDatas === undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;
  if (data.totalDatas[0]?.participents === undefined) {
    return <div>0</div>;
  }
  const totalparticipents = data?.totalDatas?.[0]?.participents;

  return <div>{totalparticipents}</div>;
};

export const TotalTrades: React.FC<{
  dayId: number;
  graphUrl: string;
}> = ({ graphUrl, dayId }) => {
  const { data } = useTotalData(dayId, graphUrl);
  if (data?.totalDatas === undefined)
    return <Skeleton className="w-[50px] !h-6 lc " />;
  if (data.totalDatas[0]?.trades === undefined) {
    return <div>0</div>;
  }
  const totalTrades = data?.totalDatas?.[0]?.trades;

  return <div>{totalTrades}</div>;
};

export const TotalVolume: React.FC<{
  dayId: number;
  graphUrl: string;
}> = ({ dayId, graphUrl }) => {
  const { data } = useTotalData(dayId, graphUrl);
  const totalVolume = data?.totalDatas?.[0]?.volume;
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
