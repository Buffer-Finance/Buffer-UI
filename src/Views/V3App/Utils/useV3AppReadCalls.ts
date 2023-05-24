import { useCall2Data } from '@Utils/useReadCall';
import { useMemo } from 'react';
import { useSwitchPoolForTrade } from './useSwitchPoolForTrade';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import MetaABI from '../ABIs/meta.json';
import { getCallId } from '@Utils/Contract/multiContract';
import { erc20ABI } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { v3AppConfig } from '../config';
import { getPayout } from '../helperFns';
import { divide } from '@Utils/NumString/stringArithmatics';

function useV3AppReadCalls() {
  const { address } = useUserAccount();
  const { switchPool, poolDetails } = useSwitchPoolForTrade();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const { activeChain } = useActiveChain();
  const configData =
    v3AppConfig[activeChain.id as unknown as keyof typeof v3AppConfig];
  const calls = useMemo(() => {
    if (!switchPool || !poolDetails) {
      return [];
    }
    const othercalls = [
      {
        address: poolDetails.meta,
        abi: MetaABI,
        name: 'getPayout',
        params: [
          switchPool.optionContract,
          //TODO - v3 add referral code here
          '',
          address || '0x0000000000000000000000000000000000000000',
          highestTierNFT?.tokenId || 0,
          true,
        ],
      },
    ];
    const userSpecificCalls = [
      {
        address: poolDetails.tokenAddress,
        abi: erc20ABI,
        name: 'balanceOf',
        params: [address],
      },
      {
        address: poolDetails.tokenAddress,
        abi: erc20ABI,
        name: 'allowance',
        params: [address, configData.router],
      },
    ];

    if (!address) {
      return [...othercalls];
    }
    return [...othercalls, ...userSpecificCalls];
  }, [switchPool, poolDetails, address, highestTierNFT]);

  return useCall2Data(calls, 'V3-app-read-calls');
}

export const useV3AppData = () => {
  const { data: readCallData } = useV3AppReadCalls();
  const { switchPool, poolDetails } = useSwitchPoolForTrade();

  const response = useMemo(() => {
    if (!readCallData || !poolDetails || !switchPool) {
      return null;
    }
    const payout = readCallData[getCallId(poolDetails.meta, 'getPayout')][0];
    const balance =
      readCallData[getCallId(poolDetails.tokenAddress, 'balanceOf')][0];
    const allowance =
      readCallData[getCallId(poolDetails.tokenAddress, 'allowance')][0];
    return {
      totalPayout: divide(payout, 2) as string,
      balance,
      allowance,
    };
  }, [readCallData, poolDetails, switchPool]);

  return response;
};
