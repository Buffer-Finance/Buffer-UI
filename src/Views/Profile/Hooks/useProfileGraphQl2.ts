import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { add } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Products } from '../Components/ProductDropDown';

export const useProfileGraphQl2 = (product: Products) => {
  const { address: account } = useUserAccount();
  const { activeChain } = useActiveChain();
  const graphUrl = `https://subgraph.satsuma-prod.com/${
    import.meta.env.VITE_SATSUMA_KEY
  }/bufferfinance/v2.5-arbitrum-mainnet/version/v2.9.3-ab-profile-user-cumulative-optionwise-new-schema/api`;
  const queryName = product === 'Up/Down' ? 'optionStats' : 'aboptionStats';
  async function fetchData(account: string | undefined) {
    if (!account) return null;
    const basequery = `
    userData:${queryName}(
      first: 10000
      where: {user: "${account.toLowerCase()}" }
    ){
    user
    optionContract {
      asset
    }
    token
    tradeCount
    openInterest
    volume
    volume_usd
    payout
    payout_usd
    netPnl
    netPnl_usd
    tradesWon
    tradesOpen
    }
    `;

    const query = `
    {
      ${basequery}
    }
    `;
    const response = await axios.post(graphUrl, {
      query,
    });

    let responseData = response.data?.data?.userData;

    return responseData as Response[];
  }

  const { data } = useSWR(
    `profile-query-2-account-${account}-lastSavedTimestamp-activeChain-${activeChain}-product-${product}`,
    {
      fetcher: () => fetchData(account),
      refreshInterval: 5000,
    }
  );

  const ProfileData = useMemo<ProfileData | null>(() => {
    if (!data) return null;
    const initialData = {
      totalNonActiveTrades: 0,
      totalTradesWon: 0,
      tradesByasset: {},
      USDC: {
        payout: '0',
        openInterest: '0',
        netPnl: '0',
        volume: '0',
      },
      ARB: {
        payout: '0',
        openInterest: '0',
        netPnl: '0',
        volume: '0',
      },
      BFR: {
        payout: '0',
        openInterest: '0',
        netPnl: '0',
        volume: '0',
      },
    };
    const response = data.reduce((acc, curr) => {
      const {
        token,
        payout,
        openInterest,
        netPnl,
        volume,
        tradeCount,
        tradesOpen,
        tradesWon,
        optionContract: { asset },
      } = curr;
      acc.totalNonActiveTrades += tradeCount - tradesOpen;
      acc.totalTradesWon += tradesWon;
      if (acc.tradesByasset[asset] !== undefined) {
        acc.tradesByasset[asset] += tradeCount;
      } else {
        acc.tradesByasset[asset] = tradeCount;
      }
      if (acc[token]) {
        acc[token].payout = add(acc[token].payout, payout);
        acc[token].openInterest = add(acc[token].openInterest, openInterest);
        acc[token].netPnl = add(acc[token].netPnl, netPnl);
        acc[token].volume = add(acc[token].volume, volume);
      } else {
        acc[token] = {
          payout,
          openInterest,
          netPnl,
          volume,
        };
      }

      return acc;
    }, initialData as unknown as ProfileData);

    return response;
  }, [data]);
  return ProfileData;
};

interface Response {
  user: string;
  optionContract: OptionContract;
  token: string;
  tradeCount: number;
  openInterest: string;
  volume: string;
  volume_usd: string;
  payout: string;
  payout_usd: string;
  netPnl: string;
  netPnl_usd: string;
  tradesWon: number;
  tradesOpen: number;
}

interface OptionContract {
  asset: string;
}

export type ProfileData = {
  totalNonActiveTrades: number;
  totalTradesWon: number;
  tradesByasset: { [key: string]: number };
} & Metrics;

interface Metrics {
  [key: string]: TokenWiseData;
}

export interface TokenWiseData {
  payout: string;
  openInterest: string;
  netPnl: string;
  volume: string;
}
