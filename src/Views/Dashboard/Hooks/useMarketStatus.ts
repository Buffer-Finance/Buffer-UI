import { useReadCall } from '@Utils/useReadCall';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import MaxTradeABI from '@Views/BinaryOptions/ABI/MaxTrade.json';
import BinaryOptionsABI from '@Views/BinaryOptions/ABI/optionsABI.json';
import ConfigABI from '@Views/BinaryOptions/ABI/configABI.json';
import { useActiveChain } from '@Hooks/useActiveChain';

export const useAllContracts = () => {
  const { configContracts } = useActiveChain();
  const allAssetContracts = useMemo(
    () =>
      configContracts.pairs
        .map((pair) => pair.pools.map((pool) => pool).flat(1))
        .flat(1),
    [configContracts]
  );
  return { allAssetContracts };
};

export function useMarketStatus() {
  const { address: account } = useUserAccount();
  const { configContracts } = useActiveChain();
  const referralData = useReferralCode();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });

  const { allAssetContracts } = useAllContracts();
  const assetCalls = useMemo(
    () =>
      configContracts.pairs
        .map((pair) =>
          pair.pools
            .map((pool) => [
              {
                address: configContracts.tokens[pool.token].meta,
                abi: MaxTradeABI,
                name: 'calculateMaxAmount',
                params: [
                  pool.options_contracts.current,
                  highestTierNFT?.tokenId || 0,
                  referralData[2],
                  account || '0x0000000000000000000000000000000000000000',
                ],
              },
              {
                address: pool.options_contracts.current,
                abi: BinaryOptionsABI,
                name: 'isInCreationWindow',
                params: [500],
              },
              {
                address: configContracts.tokens[pool.token].meta,
                abi: MaxTradeABI,
                name: 'getPayout',
                params: [
                  pool.options_contracts.current,
                  referralData[2],
                  // 'BJP',
                  account || '0x0000000000000000000000000000000000000000',
                  highestTierNFT?.tokenId || 0,
                  true,
                ],
              },
              {
                address: configContracts.tokens[pool.token].meta,
                abi: MaxTradeABI,
                name: 'getPoolBasedMaxAmount',
                params: [
                  pool.options_contracts.current,
                  0,
                  '',
                  '0x0000000000000000000000000000000000000000',
                ],
              },
              // {
              //   address: pool.options_contracts.config,
              //   abi: ConfigABI,
              //   name: 'assetUtilizationLimit',
              //   params: [],
              // },
              // {
              //   address: pool.options_contracts.current,
              //   abi: BinaryOptionsABI,
              //   name: 'totalLockedAmount',
              //   params: [],
              // },
            ])
            .flat(1)
        )
        .flat(1),

    [account, referralData, highestTierNFT]
  );

  const calls = [...assetCalls];

  let copy = useReadCall({ contracts: calls, swrKey: 'useMarketStatus' })
    .data as unknown as any[];

  type marketStatusType = {
    maxTradeAmount: string | null | undefined;
    isMarketOpen: boolean;
    payout: string | null | undefined;
    maxOpenInterest: string | null | undefined;
    // maxUtilization: string | null | undefined;
    // openInterest: string;
  };
  let response: { [key: string]: marketStatusType } = {};

  function getMaxAmount(
    [maxFeeForAbove, maxFeeForBelow]: [
      maxFeeForAbove: string,
      maxFeeForBelow: string
    ],
    deciamls: number
  ): string | null | undefined {
    return maxFeeForAbove
      ? divide(
          gt(maxFeeForAbove, maxFeeForBelow) ? maxFeeForAbove : maxFeeForBelow,
          deciamls
        )
      : null;
  }
  function getPayout(payout: string) {
    return divide(
      payout,
      // payoutRes.shift()?.[0] ?? '0',
      2
    );
  }
  function getMaxUtilization(maxUtilization: string) {
    return divide(maxUtilization, 2);
  }

  function createObject(
    maxAmountArr: [string, string],
    marketOpenArray: boolean[],
    payout: string,
    maxPoolAmountArr: [string, string],
    // maxUtilization: string,
    // openInterest: string,
    decimals: number
  ): marketStatusType {
    return {
      isMarketOpen: marketOpenArray[0],
      maxTradeAmount: getMaxAmount(maxAmountArr, decimals),
      payout: getPayout(payout),
      maxOpenInterest: getMaxAmount(maxPoolAmountArr, decimals),
      // maxUtilization: getMaxUtilization(maxUtilization),
      // openInterest: openInterest,
    };
  }

  if (copy) {
    const numberofResponseForAnAsset = copy.length / allAssetContracts.length;
    let assetIdx = 0;
    copy.forEach((res, idx) => {
      if (idx % numberofResponseForAnAsset === 0) {
        response[allAssetContracts[assetIdx].options_contracts.current] =
          createObject(
            copy[idx],
            copy[idx + 1],
            copy[idx + 2],
            copy[idx + 3],
            configContracts.tokens[allAssetContracts[assetIdx].token].decimals
          );
        assetIdx++;
      }
    });
  }
  console.log(response, 'response');
  return { assetStatus: response, allAssetContracts };
}
