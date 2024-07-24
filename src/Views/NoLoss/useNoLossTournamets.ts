import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { noLossConfig } from './NoLossConfig';
import configABI from './ABI/ConfigABI.json';
import { convertBNtoString, useSignerOrPorvider } from '@Utils/useReadCall';
import { multicallv2 } from '@Utils/Contract/multiContract';
import getDeepCopy from '@Utils/getDeepCopy';
import { useNoLossStaticConfig } from './useNoLossConfig';
import tournamentManagerAbi from './ABI/TournamentsManager.json';
import tlAbi from './ABI/TournamentsLeaderboard.json';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import readerAbi from '@Views/NoLoss/ABI/NoLossReaderTournamentAbi.json';
const Calls = ['minPeriod', 'maxPeriod', 'minFee', 'maxFee'];

export const baseFeeMethodName = 'baseSettlementFeePercentageForAbove';

export interface Conditions {
  guaranteedWinningAmount: string;
  maxBuyinsPerWallet: string;
  maxParticipants: string;
  minParticipants: string;
  rakePercent: string;
  startPriceMoney: string;
}

export interface MetaInfo {
  buyinToken: string;
  close: string;
  creator: string;
  isClosed: boolean;
  isVerified: boolean;
  name: string;
  playTokenMintAmount: string;
  rewardToken: string;
  shouldRefundTickets: boolean;
  start: string;
  ticketCost: string;
  tournamentType: number;
  tradingStarted: boolean;
}
export interface ITournament {
  id: string;
  lastUpdated: number;
  state: 'Upcoming' | 'Closed' | 'Live';
}
const useNoLossTournaments = () => {
  const config = useNoLossStaticConfig();
  const sOrP = useSignerOrPorvider();

  const { data } = useSWR<{
    [index in 'Upcoming' | 'Closed' | 'Live']: ITournament[];
  }>(`config-${config.chainId}`, {
    fetcher: async (name) => {
      const basicQuery = `
      tIds: tournaments(
        first: 1000
        ) {
        id
        lastUpdated
        state
        }
        `;
      console.log(`basicQuery: `, basicQuery);
      const response = await axios.post('MAIN-PONDER', {
        query: `{${basicQuery}}`,
      });
      let tids = {};
      console.log(`response.data.data.tIds: `, response.data.data.tIds);
      response.data.data.tIds.forEach((s) => {
        if (tids?.[s.state]) {
          tids?.[s.state].push(s);
        } else {
          tids[s.state] = [s];
        }
      });

      return tids;
    },
    refreshInterval: 1000,
  });
  return data;
};
export interface ITournament {
  tournamentConditions: Conditions;
  tournamentMeta: MetaInfo;
  rewards: string[];
  rewardTokenSymbol: string;
  buyinTokenSymbol: string;
  rewardTokenDecimals: number;
  buyinTokenDecimals: number;
  prizePool: string;
}
const useTournamentData = (id?: number) => {
  const data = useNoLossTournaments();
  const config = useNoLossStaticConfig();
  const sOrP = useSignerOrPorvider();
  console.log(`data?.tids: `, data);
  let ids = [];
  ['Closed', 'Upcoming', 'Live'].forEach((d) => {
    if (data?.[d]) {
      ids = [...ids, ...data?.[d].map((s) => s.id)];
    }
  });
  let ids2Info = {};
  ['Closed', 'Upcoming', 'Live'].forEach((d) => {
    if (data?.[d]) {
      data[d].forEach((a) => {
        ids2Info[a.id] = a;
      });
    }
  });
  console.log(`ids2Info: `, ids2Info);

  return useSWR<{
    [id: string]: ITournament;
  }>(`tournament-data-${JSON.stringify(ids)}`, {
    fetcher: async () => {
      if (!ids.length) return {};
      let tid2Info = {};
      const calls = [
        {
          address: config.tournament.reader,
          name: 'bulkFetchTournaments',
          abi: readerAbi,
          params: [ids],
        },
      ];
      ids.forEach((id) => {
        calls.push({
          address: config.tournament.manager,
          name: 'tournamentRewardPools',
          abi: tournamentManagerAbi,
          params: [id],
        });
        calls.push({
          address: config.tournament.leaderboard,
          name: 'getLeaderboardConfig',
          abi: tlAbi,
          params: [id],
        });
      });
      console.log(`calls: `, calls);
      let returnData = await multicallv2(calls, sOrP, config.multicall, '');
      let copy = getDeepCopy(returnData);
      convertBNtoString(copy);
      console.log(`ddddcopy: `, copy);
      if (copy[0]?.['bulkTournaments']) {
        for (let id in copy[0]?.['bulkTournaments']) {
          console.log(`ids2Info[id]: `, ids2Info[ids[id]]);
          tid2Info[ids[id]] = {
            id: ids[id],
            ...ids2Info?.[ids?.[id]],
            ...copy[0]?.['bulkTournaments'][id],
          };
        }
      }
      let index = 1;
      ids.forEach((id, idx) => {
        tid2Info[id] = {
          ...tid2Info[id],
          prizePool: copy[index][0],
          rewards: copy[index + 1][0][6].map((s) =>
            multiply(copy[index][0] + '', divide(s + '', 2))
          ),
        };
        index += 2;
      });
      console.log(`tid2info: `, tid2Info);

      return tid2Info;
    },
    refreshInterval: 1000000,
  });
};
export { useNoLossTournaments, useTournamentData };
