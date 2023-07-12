// import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useSwitchPool } from '../useSwitchPool';
import { useActiveChain } from '@Hooks/useActiveChain';
import { appConfig } from '@Views/TradePage/config';
import { useMemo } from 'react';
import { erc20ABI } from 'wagmi';
import { useCall2Data } from '@Utils/useReadCall';
// import RouterABI from '@Views/BinaryOptions/ABI/routerABI.json';
// import MetaABI from '../../ABIs/meta.json';
import SignerABI from '@Views/OneCT/signerManagerABI.json';
import OptionContractABI from '../../ABIs/OptionContract.json';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useMarketsConfig } from '../useMarketsConfig';
import { useSettlementFee } from '../useSettlementFee';
import { joinStrings } from '@Views/TradePage/utils';
import { timeToMins } from '@Views/BinaryOptions/PGDrawer/TimeSelector';
import CreationWindowABI from '@Views/TradePage/ABIs/CreationWindowABI.json';
export function useBuyTradePageReadcalls() {
  const { address } = useUserAccount();
  const { switchPool, poolDetails } = useSwitchPool();
  // const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const referralData = useReferralCode();
  // console.log('referralData', referralData);
  const config = useMarketsConfig();
  const { data: baseSettlementFees } = useSettlementFee();

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
        address: configData.signer_manager,
        abi: SignerABI,
        name: 'accountMapping',
        params: [address],
      },
    ];

    let optionCalls = config
      ?.map((market) => {
        const baseSettlementFee =
          baseSettlementFees?.[joinStrings(market.token0, market.token1, '')]
            ?.settlement_fee;
        return market.pools
          .map((pool) => {
            const calls = [
              {
                address: pool.optionContract,
                abi: OptionContractABI,
                name: 'getMaxTradeSize',
                params: [],
              },
              {
                address: pool.optionContract,
                abi: OptionContractABI,
                name: 'getMaxOI',
                params: [],
              },
              {
                address: pool.optionContract,
                abi: OptionContractABI,
                name: 'totalMarketOI',
                params: [],
              },
            ];
            if (address && baseSettlementFee) {
              calls.push({
                address: pool.optionContract,
                abi: OptionContractABI,
                name: 'getSettlementFeePercentage',
                params: [
                  referralData[3],
                  address,
                  baseSettlementFee?.toString() ?? '1500',
                ],
              });
            }
            return calls;
          })
          .flat(1);
      })
      .flat(1);
    optionCalls?.push({
      address: configData.creation_window,
      abi: CreationWindowABI,
      name: 'isInCreationWindow',
      params: [timeToMins('00:05')],
    });
    // console.log('optionCalls', optionCalls);

    if (!address) {
      return [...optionCalls!];
    }

    return [...userSpecificCalls, ...optionCalls!];
  }, [switchPool, poolDetails, address]);

  return useCall2Data(calls, 'V3-app-read-calls');
}
