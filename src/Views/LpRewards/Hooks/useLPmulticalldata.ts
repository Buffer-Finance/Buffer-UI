import { useUserAccount } from '@Hooks/useUserAccount';
import { useCall2Data } from '@Utils/useReadCall';
import { Chain, erc20ABI } from 'wagmi';
import { getLpConfig } from '../config';
import { poolsType } from '../types';

export const useLPmulticalldata = (
  activeChain: Chain,
  activePool: poolsType
) => {
  const contracts = getLpConfig(activeChain.id);
  const { address } = useUserAccount();
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
          address: contracts.uBLP,
          abi: erc20ABI,
          name: 'balanceOf',
          params: [address],
          id: activePool + '-balanceof',
        },
      ]
    : [];

  return useCall2Data(userCalls, 'lp-page-callls' + address);
};
