import { useToast } from '@Contexts/Toast';
import { capitalize } from '@mui/material';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { leagueType, leagueUsersAtom, setLeagueUsersAtom } from './atom';

const diamondQuery = `nfts(
  first:10000 
  where: {tier: "Diamond"}
  ) {
  owner
}`;

function getLeagueQuery(league: leagueType, accounts: string[]) {
  return `nfts(
    first:10000 
    where: {owner_not_in: [${accounts.map(
      (address) => `"${address}"`
    )}],tier: "${capitalize(league)}"}
    ) {
      owner
    }`;
}

export const useLeagueNFTusers = () => {
  const leagueUsers = useAtomValue(leagueUsersAtom);
  const setLeagueUsers = useSetAtom(setLeagueUsersAtom);
  const toastify = useToast();

  async function fetchLeagueNFTusers(query: string, league: leagueType) {
    try {
      const response = axios.post<{
        data: {
          nfts: {
            owner: string;
          }[];
        };
      }>(
        'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/version/v2.9.1-ud-ab-nfts-leagues-stats-defillama-merge/api',
        { query: `{${query}}` }
      );

      return response;
    } catch (e) {
      toastify({
        msg: `Error fetching users ` + (e as Error).message,
        type: 'error',
        id: 'useLeagueNFTusers',
      });
    }
  }

  useEffect(() => {
    if (leagueUsers.diamond.length === 0) {
      fetchLeagueNFTusers(diamondQuery, 'diamond').then((response) => {
        if (response === undefined || response?.data?.data === undefined) {
          toastify({
            msg: `Error fetching users `,
            type: 'error',
            id: 'useLeagueNFTusers',
          });
          return;
        }
        const diamondUniqueUsers = [
          ...new Set(response.data.data.nfts.map((nft) => nft.owner)),
        ];
        setLeagueUsers({ league: 'diamond', users: diamondUniqueUsers });
        fetchLeagueNFTusers(
          getLeagueQuery('platinum', diamondUniqueUsers),
          'platinum'
        ).then((response) => {
          if (response === undefined || response?.data?.data === undefined) {
            toastify({
              msg: `Error fetching users `,
              type: 'error',
              id: 'useLeagueNFTusers',
            });
            return;
          }
          const platinumUniqueUsers = [
            ...new Set(response.data.data.nfts.map((nft) => nft.owner)),
          ];
          setLeagueUsers({ league: 'platinum', users: platinumUniqueUsers });
          fetchLeagueNFTusers(
            getLeagueQuery(
              'gold',
              platinumUniqueUsers.concat(diamondUniqueUsers)
            ),
            'gold'
          ).then((response) => {
            if (response === undefined || response?.data?.data === undefined) {
              toastify({
                msg: `Error fetching users `,
                type: 'error',
                id: 'useLeagueNFTusers',
              });
              return;
            }
            const goldUniqueUsers = [
              ...new Set(response.data.data.nfts.map((nft) => nft.owner)),
            ];
            setLeagueUsers({ league: 'gold', users: goldUniqueUsers });
            fetchLeagueNFTusers(
              getLeagueQuery(
                'silver',
                goldUniqueUsers.concat(platinumUniqueUsers, diamondUniqueUsers)
              ),
              'silver'
            ).then((response) => {
              if (
                response === undefined ||
                response?.data?.data === undefined
              ) {
                toastify({
                  msg: `Error fetching users `,
                  type: 'error',
                  id: 'useLeagueNFTusers',
                });
                return;
              }
              const silverUniqueUsers = [
                ...new Set(response.data.data.nfts.map((nft) => nft.owner)),
              ];
              setLeagueUsers({ league: 'silver', users: silverUniqueUsers });
            });
          });
        });
      });
    }
  }, []);
};
