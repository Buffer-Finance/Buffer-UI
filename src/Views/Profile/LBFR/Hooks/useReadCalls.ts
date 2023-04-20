import { erc20ABI, useAccount } from 'wagmi';
import { getContract } from '../Config/Addresses';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useMemo } from 'react';
import { useReadCall } from '@Utils/useReadCall';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';

export type stakedType = null | {
  decimals: number;
  userBalance: string;
  userStaked: string;
  totalStakedLBFR: string;
  allowance: string;
  userRewards: string;
  tokensPerInterval: string;
};

export const useLBFRreadCalls = () => {
  const { address: account } = useAccount();
  const { activeChain } = useActiveChain();

  const genericCalls = useMemo(() => {
    let res: null | {
      [key: string]: { address: string; abi: any; name: string; params: any[] };
    } = null;
    if (account) {
      try {
        res = {
          LBFRdecimals: {
            address: getContract(activeChain.id, 'LBFR'),
            abi: erc20ABI,
            name: 'decimals',
            params: [],
          },
          totalStakedLBFR: {
            address: getContract(activeChain.id, 'LBFR'),
            abi: erc20ABI,
            name: 'balanceOf',
            params: [getContract(activeChain.id, 'LBFRrewardTracker')],
          },
          tokensPerInterval: {
            address: getContract(activeChain.id, 'LBFRrewardTracker'),
            abi: RewardTrackerAbi,
            name: 'tokensPerInterval',
            params: [],
          },
        };
      } catch (e) {
        console.log(e, 'LBFR readcalls error');
      }
    }
    if (res !== null) return Object.values(res);
    return res;
  }, [activeChain]);

  const userCalls = useMemo(() => {
    let res: null | {
      [key: string]: { address: string; abi: any; name: string; params: any[] };
    } = null;
    if (account) {
      try {
        res = {
          userLBFRbalance: {
            address: getContract(activeChain.id, 'LBFR'),
            abi: erc20ABI,
            name: 'balanceOf',
            params: [account],
          },
          userStakedLBFR: {
            address: getContract(activeChain.id, 'LBFRrewardTracker'),
            abi: RewardTrackerAbi,
            name: 'depositBalances',
            params: [account, getContract(activeChain.id, 'LBFR')],
          },
          userRewardTrackerAllowance: {
            address: getContract(activeChain.id, 'LBFR'),
            abi: erc20ABI,
            name: 'allowance',
            params: [account, getContract(activeChain.id, 'LBFRrewardTracker')],
          },
          userRewards: {
            address: getContract(activeChain.id, 'LBFRrewardTracker'),
            abi: RewardTrackerAbi,
            name: 'claimable',
            params: [account],
          },
        };
      } catch (e) {
        console.log(e, 'LBFR readcalls error');
      }
    }
    if (res !== null) return Object.values(res);
    return res;
  }, [account, activeChain]);

  const calls = genericCalls?.concat(account ? userCalls ?? [] : []);

  const { data } = useReadCall({
    contracts: calls,
    swrKey: 'useLBFRreadCalls',
  });

  let response: stakedType = null;
  if (data) {
    const [
      decimals,
      totalStakedLBFR,
      tokensPerInterval,
      //user-specific data
      userLBFRbalance,
      userStakedLBFR,
      userRewardTrackerAllowance,
      userRewards,
    ] = account
      ? data.flat()
      : data.concat(new Array(userCalls?.length).fill('0')).flat();
    response = {
      decimals: decimals,
      totalStakedLBFR: totalStakedLBFR,
      tokensPerInterval: tokensPerInterval,

      //user-specific
      userBalance: userLBFRbalance,
      userStaked: userStakedLBFR,
      allowance: userRewardTrackerAllowance,
      userRewards: userRewards,
    };
  }
  // console.log(calls, data, response, 'calls');
  return response;
};
