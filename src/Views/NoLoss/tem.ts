import { useActiveChain } from '@Hooks/useActiveChain';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useNetwork } from 'wagmi';
import { noLossConfig } from './NoLossConfig';
import configABI from './ABI/ConfigABI.json';
import { convertBNtoString, useSignerOrPorvider } from '@Utils/useReadCall';
import { multicallv2 } from '@Utils/Contract/multiContract';
import getDeepCopy from '@Utils/getDeepCopy';
import { useNoLossStaticConfig } from './useNoLossConfig';
import tournamentManagerAbi from './ABI/TournamentsManager.json';
const Calls = ['minPeriod', 'maxPeriod', 'minFee', 'maxFee'];
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

const useNoLossTournaments = () => {
  const config = useNoLossStaticConfig();
  const sOrP = useSignerOrPorvider();

  const { data } = useSWR<{
    tid2Info?: {
      [id: string]: {
        tournamentConditions: Conditions;
        tournamentMeta: MetaInfo;
        lastUpdated: number;
        state: 'Upcoming' | 'Created' | 'Live';
      };
    };
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
      const response = await axios.post(config.graph.MAIN, {
        query: `{${basicQuery}}`,
      });
      let tid2Info = {};
      console.log(`response.data.data.tIds: `, response.data.data.tIds);
      response.data.data.tIds.forEach((s) => {
        tid2Info[s.id] = {
          ...s,
        };
      });
      const calls = [
        {
          address: config.tournament.manager,
          name: 'bulkFetchTournaments',
          abi: tournamentManagerAbi,
          params: [Object.keys(tid2Info)],
        },
      ];
      console.log(`calls: `, calls);
      let returnData = await multicallv2(calls, sOrP, config.multicall, '');

      let copy = getDeepCopy(returnData);
      convertBNtoString(copy);
      console.log(`copy: `);
      if (copy[0]?.['bulkTournaments']) {
        for (let id in copy[0]?.['bulkTournaments']) {
          tid2Info[id] = {
            ...tid2Info[id],
            ...copy[0]?.['bulkTournaments'][id],
          };
        }
        console.log(`tid2info: `, tid2Info);
      }

      return { tid2Info };
    },
    // TODO see if there is retrying machanism on swr than only do this req one time
    refreshInterval: 100000,
  });
  return data;
};

export { useNoLossTournaments };
