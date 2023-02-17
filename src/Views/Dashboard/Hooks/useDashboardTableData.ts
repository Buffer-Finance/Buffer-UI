import axios from 'axios';
import { baseGraphqlUrl } from 'config';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import MarketConfig from 'public/config.json';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { usdcDecimals } from '@Views/V2-Leaderboard/Incentivised';
import { useActiveChain } from '@Hooks/useActiveChain';

function getHourBefore24Hours() {
  const date = new Date();
  date.setHours(date.getHours() - 24);
  return Math.floor(date.getTime() / (1000 * 3600));
}

export const useDashboardTableData = () => {
  const { data: currentPrices } = useSWR('dashboard-current-prices', {
    fetcher: async () => {
      const response = await axios.get(
        `https://oracle.buffer.finance/price/latest/`
      );

      return response.data?.data;
    },
    // refreshInterval: 300,
  });
  const {configContracts} = useActiveChain();
  const { data } = useSWR('dashboard-table-data', {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
          optionContracts (where: {token: "USDC"}) {
            address
            openDown
            openUp
            currentUtilization
            openInterest
            payoutForDown
            payoutForUp
            volume
            tradeCount
          }
          volumePerContracts(where: {depositToken: "USDC", id_gte: "${getHourBefore24Hours()}"}) {
            optionContract {
              address
            }
            amount
          }
        }`,
      });
      return response.data?.data as {
        optionContracts: {
          address: string;
          openDown: number;
          openUp: number;
          currentUtilization: string;
          openInterest: string;
          payoutForDown: string;
          payoutForUp: string;
          volume: string;
          tradeCount: number;
        }[];
        volumePerContracts: {
          optionContract: {
            address: string;
          };
          amount: string;
        }[];
      };
    },
    refreshInterval: 300,
  });

  const oneDayVolume = useMemo(() => {
    if (!data || !data.volumePerContracts) return [];

    return data.volumePerContracts.reduce((acc, item) => {
      const address = item.optionContract.address.toLowerCase();
      if (acc[address]) {
        acc[address] = add(acc[address], item.amount);
      } else {
        acc[address] = item.amount;
      }
      return acc;
    }, {});
  }, [data]);

  const dashboardData = useMemo(() => {
    if (!data || !data.optionContracts) return [];
    const upatedData = [];
    let pool = null;
    data.optionContracts.forEach((item) => {
      const configPair = configContracts.pairs.find((pair) => {
        let pool;
        pool = pair.pools.find(
          (pool) =>
            pool.options_contracts.current.toLowerCase() ===
            item.address.toLowerCase()
        );
        return !!pool;
      });

      if (!configPair) return;
      // if(configPair.category == 'Forex' || configPair.category == 'Comodity') return;
      const currData = {
        ...item,
        address: pool.options_contracts.current,
        pair: configPair?.pair,
        img: configPair?.img,
        currentPrice: currentPrices?.[configPair.tv_id]?.p,
        '24h_change': currentPrices?.[configPair.tv_id]?.['24h_change'],
        openInterest: Number(fromWei(item.openInterest, usdcDecimals)),
        precision: configPair?.price_precision,
        totalTrades: item.openDown + item.openUp,
        '24h_volume':
          Number(
            fromWei(oneDayVolume?.[item.address.toLowerCase()], usdcDecimals)
          ) || '0',
        currentUtilization: Number(fromWei(item.currentUtilization, 16)),
        payoutForDown: Number(fromWei(item.payoutForDown, 16)),
        payoutForUp: Number(fromWei(item.payoutForUp, 16)),
        // currentPrice: currentPrice?.p,
      };
      upatedData.push(currData);
    });
    return upatedData;
  }, [data, currentPrices]);

  const totalData = useMemo(() => {
    if (!dashboardData) return null;
    return {
      ...dashboardData.reduce(
        (acc, item) => {
          return {
            trades: acc.trades + item.tradeCount,
            volume: add(acc.volume, item.volume),
            openInterest: acc.openInterest + item.openInterest,
          };
        },
        {
          trades: 0,
          volume: '0',
          openInterest: 0,
        }
      ),
    };
  }, [dashboardData]);

  return { dashboardData, totalData };
};
