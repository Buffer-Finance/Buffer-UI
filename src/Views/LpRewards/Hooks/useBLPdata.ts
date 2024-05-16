import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { maxBy, minBy, sortBy } from 'lodash';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Chain } from 'viem';
import { blpPrice, poolsType } from '../types';

export function fillNa(arr) {
  const prevValues = {};
  let keys;
  if (arr.length > 0) {
    keys = Object.keys(arr[0]);
    delete keys.timestamp;
    delete keys.id;
  }

  for (const el of arr) {
    for (const key of keys) {
      if (!el[key]) {
        if (prevValues[key]) {
          el[key] = prevValues[key];
        }
      } else {
        prevValues[key] = el[key];
      }
    }
  }
  return arr;
}
export type blpData = blpPrice & {
  timestamp: string;
};

export function useBlpData(activeChain: Chain, activePool: poolsType) {
  const graphUrl = getConfig(activeChain.id).graph.LP;

  const {
    data,
    isValidating: loading,
    error,
  } = useSWR<blpData[]>(`${activeChain}-${activePool}-blp-data`, {
    fetcher: async () => {
      const poolName = activePool === 'uBLP' ? 'USDC' : 'ARB';
      const query = `{
                    blpPrices(
                        first:10000
                        orderBy: timestamp
                        orderDirection: desc
                        where: {id_not: "current${poolName}"}) {
                        price
                        tokenXamount
                        blpAmount
                        poolName
                        timestamp
                    }
                }`;
      try {
        const { data, status } = await axios.post(graphUrl, { query });
        if (status === 200) {
          return data.data.blpPrices;
        } else {
          throw new Error('Failed to fetch pool transactions');
        }
      } catch (e) {
        console.error(e, 'blpPrice');
      }
    },
    refreshInterval: 10000,
  });
  let stats = null;
  let cumulativeGlpSupply = 0;
  const glpChartData = useMemo(() => {
    if (!data) {
      return null;
    }

    let prevGlpSupply;
    let prevAum;
    let ret = sortBy(data, (item) => item['timestamp'])
      .reduce((memo, item) => {
        const last = memo[memo.length - 1];

        const glpSupply = Number(item.tokenXamount);
        const rate = Number(item.price) / 1e8;

        cumulativeGlpSupply += +glpSupply;
        const timestamp = parseInt(item['timestamp']);

        const newItem = {
          timestamp,
          rate,
          glpSupply: glpSupply / 1e6,
          cumulativeGlpSupply: cumulativeGlpSupply / 1e6,
        };

        if (last && last.timestamp === timestamp) {
          memo[memo.length - 1] = newItem;
        } else {
          memo.push(newItem);
        }

        return memo;
      }, [])
      .map((item) => {
        let { glpSupply, aum } = item;
        if (!glpSupply) {
          glpSupply = prevGlpSupply;
        }
        if (!aum) {
          aum = prevAum;
        }
        item.glpSupplyChange = prevGlpSupply
          ? Number(glpSupply) - Number(prevGlpSupply)
          : 0;
        if (item.glpSupplyChange > 1000) {
          item.glpSupplyChange = 0;
        }
        item.aumChange = prevAum ? ((aum - prevAum) / prevAum) * 100 : 0;
        if (item.aumChange > 1000) {
          item.aumChange = 0;
        }
        prevGlpSupply = glpSupply;
        prevAum = aum;
        return item;
      });

    ret = fillNa(ret);
    return ret;
  }, [data]);

  if (glpChartData) {
    const maxGlpAmount = maxBy(
      glpChartData,
      (item) => item.glpSupply
    )?.glpSupply;
    const minGlpAmount = minBy(
      glpChartData,
      (item) => item.glpSupply
    )?.glpSupply;
    const maxRate = maxBy(glpChartData, (item) => item.rate)?.rate;
    const minRate = minBy(glpChartData, (item) => item.rate)?.rate;
    stats = {
      maxGlpAmount,
      minGlpAmount,
      maxRate,
      minRate,
    };
  }

  return [glpChartData, loading, error, stats];
}
