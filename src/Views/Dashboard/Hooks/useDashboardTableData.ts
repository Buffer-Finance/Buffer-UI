import axios from 'axios';
import { useMemo } from 'react';
import useSWR from 'swr';
import { add } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { useActiveChain } from '@Hooks/useActiveChain';
import { timeToMins } from '@Views/BinaryOptions/PGDrawer/TimeSelector';
import { useAllContracts, useMarketStatus } from './useMarketStatus';
import { useAtomValue } from 'jotai';
import { priceAtom, usePrice } from '@Hooks/usePrice';
import { getPriceFromKlines } from '@TV/useDataFeed';

export function getLinuxTimestampBefore24Hours() {
  return Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
}

type dashboardTableData = {
  optionContracts: {
    address: string;
    openDown: string;
    openUp: string;
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
    depositToken: string;
  }[];
};

export const useDashboardTableData = () => {
  usePrice(true);
  const currentPrices = useAtomValue(priceAtom);
  const { assetStatus } = useMarketStatus();
  const { configContracts } = useActiveChain();
  const { allAssetContracts } = useAllContracts();
  const { data } = useSWR('dashboard-table-data', {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{ 
          optionContracts {
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
          volumePerContracts(   
            orderBy: timestamp
            orderDirection: desc
            first: 1000
            where: { timestamp_gt: "${getLinuxTimestampBefore24Hours()}"}) {
            optionContract {
              address
            }
            amount
            settlementFee
            depositToken
          }
        }`,
      });
      return response.data?.data as dashboardTableData;
    },
    refreshInterval: 300,
  });

  const oneDayVolume = useMemo(() => {
    if (!data || !data.volumePerContracts) return {};
    return data.volumePerContracts.reduce((acc, item) => {
      const address = item.optionContract.address.toLowerCase();
      if (item.depositToken !== 'total') {
        if (acc[address]) {
          acc[address] = add(acc[address], item.amount);
        } else {
          acc[address] = item.amount;
        }
      }
      return acc;
    }, {});
  }, [data]);

  // console.log(oneDayVolume, 'oneDayVolume');

  const otherContracts = useMemo(() => {
    if (!data || !data.optionContracts) return [];
    return allAssetContracts
      .filter((contract) => {
        return !data.optionContracts.find(
          (item) =>
            item.address.toLowerCase() ===
            contract.options_contracts.current.toLowerCase()
        );
      })
      .map((item) => {
        return {
          address: item.options_contracts.current,
          openDown: '0',
          openUp: '0',
          currentUtilization: '0',
          openInterest: '0',
          payoutForDown: '0',
          payoutForUp: '0',
          volume: '0',
          tradeCount: '0',
        };
      });
  }, [allAssetContracts, data]);

  const dashboardData = useMemo(() => {
    if (!data || !data.optionContracts) return [];
    const upatedData = [];
    let pool = null;
    data.optionContracts.concat(otherContracts).forEach((item) => {
      const configPair = configContracts.pairs.find((pair) => {
        pool = null;

        pool = pair.pools.find(
          (pool) =>
            pool.options_contracts.current.toLowerCase() ===
            item.address.toLowerCase()
        );
        return !!pool;
      });
      if (!configPair) return;
      // console.log(data.optionContracts.concat(otherContracts), 'configPair');
      const currData = {
        ...item,
        address: pool.options_contracts.current,
        pair: configPair?.pair,
        img: configPair?.img,
        min_duration: configPair?.min_duration,
        max_duration: configPair?.max_duration,
        sort_duration: timeToMins(configPair?.min_duration),
        currentPrice: getPriceFromKlines(currentPrices, configPair),
        '24h_change': currentPrices?.[configPair.tv_id]?.['24h_change'],
        openInterest: Number(
          fromWei(
            item.openInterest,
            configContracts.tokens[pool.token].decimals
          )
        ),
        precision: configPair?.price_precision,
        openUp: fromWei(
          item.openUp,
          configContracts.tokens[pool.token].decimals
        ),
        openDown: fromWei(
          item.openDown,
          configContracts.tokens[pool.token].decimals
        ),
        totalTrades: Number(
          fromWei(
            add(item.openDown, item.openUp),
            configContracts.tokens[pool.token].decimals
          )
        ),
        max_trade_size:
          Number(assetStatus[pool.options_contracts.current]?.maxTradeAmount) ||
          0,
        is_open:
          configPair.category === 'Crypto'
            ? true
            : assetStatus[pool.options_contracts.current]?.isMarketOpen ||
              false,
        '24h_volume':
          Number(
            fromWei(
              oneDayVolume?.[item.address.toLowerCase()],
              configContracts.tokens[pool.token].decimals
            )
          ) || '0',
        // currentUtilization: Number(fromWei(item.currentUtilization, 16)),
        payoutForDown: Number(
          assetStatus[pool.options_contracts.current]?.payout ?? '0'
        ),
        payoutForUp: Number(
          assetStatus[pool.options_contracts.current]?.payout ?? '0'
        ),
        // max_utilization:
        //   assetStatus[pool.options_contracts.current]?.maxUtilization ?? '0',
        pool: pool.token,
        poolUnit: configContracts.tokens[pool.token].name,
        max_open_interest:
          Number(
            assetStatus[pool.options_contracts.current]?.maxOpenInterest
          ) || 0,
      };
      upatedData.push(currData);
    });
    return upatedData;
  }, [data, currentPrices, assetStatus]);

  const totalData: {
    trades: number;
    volume: string;
    openInterest: number;
  } | null = useMemo(() => {
    if (!dashboardData) return null;
    return dashboardData.reduce(
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
    );
  }, [dashboardData]);
  console.log(dashboardData, totalData, 'dashboardData');
  return { dashboardData, totalData };
};
