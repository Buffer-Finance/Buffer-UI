import { multicallv2 } from '@Utils/Contract/multiContract';
import { add, subtract } from '@Utils/NumString/stringArithmatics';
import { fromWei } from '@Views/Earn/Hooks/useTokenomicsMulticall';
import { HolderContracts, appConfig } from '@Views/TradePage/config';
import { ethers } from 'ethers';
import useSWR from 'swr';
import { erc20ABI } from 'wagmi';

export const useMainnetData = () => {
  const { DashboardConfig, EarnConfig } = appConfig['42161'];
  const { data: mainnetData, error: cirError } = useSWR('circulatingSupply', {
    fetcher: async () => {
      const lpTokensCalls = [
        {
          address: EarnConfig.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [DashboardConfig.uniswap],
        },
        {
          address: EarnConfig.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [DashboardConfig.xcal],
        },
        {
          address: EarnConfig.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [DashboardConfig.camelot],
        },
        {
          address: EarnConfig.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [DashboardConfig.JLPPoolAddress],
        },
        {
          address: EarnConfig.iBFR,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [DashboardConfig.LBTPoolAddress],
        },
      ];
      const calls = HolderContracts.map((c) => {
        return {
          address: '0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D',
          abi: erc20ABI,
          name: 'balanceOf',
          params: [c],
        };
      });
      const contracts = [...calls, ...lpTokensCalls];

      const multicallRes = await multicallv2(
        contracts as any,
        new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'),
        appConfig[42161].multicall,
        'dashoboard-read-calls'
      );
      const lpTokensCallLength = lpTokensCalls.length;
      const formattedRes = multicallRes.slice(0, -lpTokensCallLength);

      const sum = formattedRes.reduce((t: string, num: string) => {
        return add(t, fromWei(num) || '0');
      }, '0');

      const lpTokens = multicallRes
        .slice(-lpTokensCallLength)
        .reduce((t: string, num: string) => {
          return add(t, fromWei(num) || '0');
        }, '0');

      return {
        amountInPools: sum,
        lpTokens,
      };
    },
    refreshInterval: 10000,
  });

  return {
    mainnetData,
  };
};
