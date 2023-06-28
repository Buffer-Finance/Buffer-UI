import axios from 'axios';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import useSWR from 'swr';
import { rewardTotalPageAtom } from './atoms';
import { ROWS_PER_PAGE } from '.';

async function fetchRewardData(
  startTimestamp: number,
  endTimestamp: number,
  poolToken: string,
  category: string,
  sort: string,
  offset: number,
  first: number
) {
  const res = await axios.get(
    `https://backend.buffer-finance-api.link/leaderboard/?start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&pool_token=${poolToken}&category=${category}&sort=${sort}&page_offset=${offset}&page_size=${first}`
  );
  return res.data.response as rewardApiResponseType[];
}

export type rewardApiResponseType = {
  user_address: string;
  absolute_net_pnl: number;
  total_volume: number;
  total_trades: number;
  total_payout: number;
};

export const useRewardData = (
  startTimestamp: number,
  endTimestamp: number,
  poolToken: string,
  category: string,
  sort: string,
  offset: number,
  first: number
) => {
  const { data, error } = useSWR(
    [
      startTimestamp,
      endTimestamp,
      poolToken?.toUpperCase(),
      category?.toUpperCase(),
      sort?.toUpperCase(),
      offset,
      first,
      'reward-fetch',
    ],
    {
      fetcher: fetchRewardData,
      refreshInterval: 300,
    }
  );

  const setTotalPages = useSetAtom(rewardTotalPageAtom);

  useEffect(() => {
    if (data && data.length) {
      setTotalPages(Math.ceil(data.length / ROWS_PER_PAGE));
    }
  }, [data]);

  return { data, error };
};
