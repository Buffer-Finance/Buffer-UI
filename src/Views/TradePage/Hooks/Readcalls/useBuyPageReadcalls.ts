import { useUserAccount } from '@Hooks/useUserAccount';
import { useSwitchPool } from '../useSwitchPool';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useMemo } from 'react';
import { erc20ABI } from 'wagmi';
import { useCall2Data } from '@Utils/useReadCall';
import CustomERC20ABI from '@ABIs/CustomErc20ABI.json';
import SignerABI from '@Views/OneCT/signerManagerABI.json';
import OptionContractABI from '../../ABIs/OptionContract.json';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useMarketsConfig } from '../useMarketsConfig';
import { useSettlementFee } from '../useSettlementFee';
import { joinStrings } from '@Views/TradePage/utils';
import CreationWindowABI from '@Views/TradePage/ABIs/CreationWindowABI.json';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { timeToMins } from '@Views/TradePage/utils/timeToMins';
export function useBuyTradePageReadcalls() {
  const { address } = useUserAccount();
  const { switchPool, poolDetails } = useSwitchPool();
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const referralData = useReferralCode();

  const config = useMarketsConfig();
  const { data: baseSettlementFees } = useSettlementFee();

  const calls = useMemo(() => {
    if (!switchPool || !poolDetails) {
      return [];
    }

    const userSpecificCalls = [
      {
        address: poolDetails.tokenAddress,
        abi: erc20ABI,
        name: 'balanceOf',
        params: [address],
      },
      {
        address: poolDetails.tokenAddress,
        abi: CustomERC20ABI,
        name: 'nonces',
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
        const creation_window = market.creation_window_contract;

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
                ] as never,
              });
            }
            if (creation_window !== undefined) {
              calls.push({
                address: creation_window,
                abi: CreationWindowABI,
                name: 'isInCreationWindow',
                params: [timeToMins('00:05') as never],
              });
            }
            return calls;
          })
          .flat(1);
      })
      .flat(1);

    if (!address) {
      return [...optionCalls!];
    }

    return [...userSpecificCalls, ...optionCalls!];
  }, [switchPool, poolDetails, address]);

  return useCall2Data(calls, 'V3-app-read-calls');
}
