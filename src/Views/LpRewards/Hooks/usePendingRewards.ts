import { useCall2Data } from '@Utils/useReadCall';
import { Chain } from 'wagmi';
import NFTlockPoolABI from '../abis/NftLockPool.json';
import { getLpConfig } from '../config';
import { lockTxn } from '../types';

export const usePendingRewards = (
  activeChain: Chain,
  lockTxns: lockTxn[] | undefined
) => {
  const contracts = getLpConfig(activeChain.id);

  const calls = lockTxns?.map((lockTxn) => {
    return {
      address: contracts.nftLockPool,
      abi: NFTlockPoolABI,
      name: 'pendingRewards',
      params: [lockTxn.nftId],
      id: lockTxn.nftId,
    };
  });

  return useCall2Data(calls, 'pending-rewards-calls');
};
