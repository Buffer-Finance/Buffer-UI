import { useUserAccount } from '@Hooks/useUserAccount';
import { DailyWebTable } from '@Views/V2-Leaderboard/Daily/DailyWebTable';
import { Winners } from '@Views/V2-Leaderboard/Leagues/Winners';
import { ROWINAPAGE } from '@Views/V2-Leaderboard/Weekly';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import axios from 'axios';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

const queryFields =
  'user totalTrades netPnL volume winRate tradesWon usdcNetPnL usdcTotalTrades usdcTradesWon usdcVolume usdcWinRate arbNetPnL arbTotalTrades arbTradesWon arbVolume arbWinRate bfrNetPnL bfrTotalTrades bfrTradesWon bfrVolume bfrWinRate';

interface IleaderboardQueryResponse {
  leaderboards: ILeague[];
  userData: ILeague[];
}

export const TableByPNL: React.FC<{ activeChainId: number }> = ({
  activeChainId,
}) => {
  const [activePage, setActivePage] = useState(1);
  const skip = (activePage - 1) * ROWINAPAGE;
  const { address: account } = useUserAccount();

  const { data } = useSWR<IleaderboardQueryResponse>(
    `all-time-arbi-account-${account}-weekly-chainId-${activeChainId}}`,
    {
      fetcher: async () => {
        const leaderboardQuery = `
              leaderboards(
                orderBy: netPnL
                orderDirection: desc
                first: 1000
                where: {timestamp:"allTime"}
              ) {
                ${queryFields}
              }
            `;

        const userQuery = account
          ? `userData: leaderboards(
            where: {user: "${account}", timestamp:"allTime"}
          ) {
              ${queryFields}
            }`
          : '';
        const query = `{${leaderboardQuery}${userQuery}}`;
        const response = await axios.post(
          'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/version/v2.7.8-merge-9-nfts-merge/api',
          {
            query,
          }
        );

        return response.data?.data;
      },
      refreshInterval: 60000,
    }
  );

  const winnerUserRank = useMemo(() => {
    if (!data || !data.leaderboards || !account) return '-';
    const rank = data.leaderboards.findIndex(
      (data) => data.user.toLowerCase() == account.toLowerCase()
    );

    if (rank === -1) return '-';
    else return (rank + 1).toString();
  }, [data?.userData, account]);

  const participants = useMemo(() => {
    if (!data?.leaderboards)
      return {
        winners: undefined,
        others: undefined,
      };

    return {
      winners: data?.leaderboards.slice(0, 3),
      others:
        activePage === 1
          ? data?.leaderboards.slice(3, skip + ROWINAPAGE)
          : data.leaderboards.slice(skip, skip + ROWINAPAGE),
    };
  }, [data?.leaderboards, skip]);

  return (
    <>
      <Winners winners={participants.winners} />
      <DailyWebTable
        standings={participants.others}
        count={100}
        onpageChange={setActivePage}
        activePage={activePage}
        userData={data?.userData}
        skip={skip}
        nftWinners={0}
        userRank={winnerUserRank}
      />
    </>
  );
};
