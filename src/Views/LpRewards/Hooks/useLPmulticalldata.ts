import { useUserAccount } from '@Hooks/useUserAccount';
import { useCall2Data } from '@Utils/useReadCall';
import { Chain } from 'wagmi';
import { erc20Abi } from 'viem';
import BLPABI from '../abis/BLP.json';
import RewardTrackerABI from '../abis/RewardTracker.json';
import { getLpConfig } from '../config';
import { poolsType } from '../types';

export const useLPmulticalldata = (
  activeChain: Chain,
  activePool: poolsType
) => {
  const contracts = getLpConfig(activeChain.id);
  console.log(`lp-log-contracts: `, contracts);
  const { address } = useUserAccount();
  console.log(`address: `, address);
  const userCalls = address
    ? [
        {
          address: contracts.USDC,
          abi: erc20ABI,
          name: 'allowance',
          params: [address, contracts.uBLP],
          id: activePool + '-allowance',
        },
        {
          address: contracts.USDC,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [address],
          id: activePool + '-balanceof',
        },
        {
          address: contracts.uBLP,
          abi: BLPABI,
          name: 'getUnlockedLiquidity',
          params: [address],
          id: activePool + '-getUnlockedLiquidity',
        },
        {
          address: contracts.feeBLPtracker,
          abi: RewardTrackerABI,
          name: 'depositBalances',
          params: [address, contracts.uBLP],
          id: activePool + '-depositBalances',
        },
        {
          address: '0x82B2208c5F2Ca8D02304b9F1224fE0D8C9e16d5B',
          abi: RewardTrackerABI,
          name: 'balanceOf',
          params: [address],
          id: activePool + '-fsBLPBalance',
        },

        {
          address: contracts.feeBLPtracker,
          abi: RewardTrackerABI,
          name: 'claimable',
          params: [address],
          id: activePool + '-claimable',
        },
      ]
    : [];

  const defaultCalls = [
    {
      address: contracts.uBLP,
      abi: BLPABI,
      name: 'lockupPeriod',
      params: [],
      id: activePool + '-lockupPeriod',
    },
    {
      address: contracts.uBLP,
      abi: BLPABI,
      name: 'availableBalance',
      params: [],
      id: activePool + '-availableBalance',
    },
  ];
  const calls = [...defaultCalls, ...userCalls];
  return useCall2Data(calls, 'lp-page-callls' + address);
};
