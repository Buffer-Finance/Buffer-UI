import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useSwitchPool } from '../useSwitchPool';
import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '@Views/TradePage/config';
import { useMemo } from 'react';
import { erc20ABI } from 'wagmi';
import { useCall2Data } from '@Utils/useReadCall';
import RouterABI from '@Views/BinaryOptions/ABI/routerABI.json';
import MetaABI from '../../ABIs/meta.json';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';

export function useBuyTradePageReadcalls() {
  const { address } = useUserAccount();
  const { switchPool, poolDetails } = useSwitchPool();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const referralData = useReferralCode();

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
          referralData[2],
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
      {
        address: configData.router,
        abi: RouterABI,
        name: 'accountMapping',
        params: [address],
      },
    ];

    if (!address) {
      return [...othercalls];
    }
    return [...othercalls, ...userSpecificCalls];
  }, [switchPool, poolDetails, address, highestTierNFT]);

  return useCall2Data(calls, 'V3-app-read-calls');
}
