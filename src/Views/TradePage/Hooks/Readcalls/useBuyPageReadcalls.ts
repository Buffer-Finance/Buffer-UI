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
import OptionContractABI from '../../ABIs/OptionContract.json';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useMarketsConfig } from '../useMarketsConfig';
import { useSettlementFee } from '../useSettlementFee';

export function useBuyTradePageReadcalls() {
  const { address } = useUserAccount();
  const { switchPool, poolDetails } = useSwitchPool();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const referralData = useReferralCode();
  const config = useMarketsConfig();
  const baseSettlementFees = useSettlementFee();

  const calls = useMemo(() => {
    if (!switchPool || !poolDetails) {
      return [];
    }
    // const othercalls = [
    //   {
    //     address: poolDetails.meta,
    //     abi: MetaABI,
    //     name: 'getPayout',
    //     params: [
    //       switchPool.optionContract,
    //       referralData[2],
    //       address || '0x0000000000000000000000000000000000000000',
    //       highestTierNFT?.tokenId || 0,
    //       true,
    //     ],
    //   },
    // ];
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

    const optionCalls = config
      ?.map((market) => {
        return market.pools.map((pool) => {
          return {
            address: pool.optionContract,
            abi: OptionContractABI,
            name: 'getMaxTradeSize',
            params: [],
          };
        });
      })
      .flat(1);

    if (!address) {
      return [];
    }
    if (!optionCalls) {
      return [...userSpecificCalls];
    }
    return [...userSpecificCalls, ...optionCalls];
  }, [switchPool, poolDetails, address, highestTierNFT]);

  return useCall2Data(calls, 'V3-app-read-calls');
}
