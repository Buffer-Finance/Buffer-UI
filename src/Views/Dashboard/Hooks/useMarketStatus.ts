import { useReadCall } from '@Utils/useReadCall';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import MaxTradeABI from '@Views/BinaryOptions/ABI/MaxTrade.json';
import BinaryOptionsABI from '@Views/BinaryOptions/ABI/optionsABI.json';
import { useActiveChain } from '@Hooks/useActiveChain';

export function useMarketStatus() {
  const { address: account } = useUserAccount();
  const { activeChain, configContracts } = useActiveChain();
  const referralData = useReferralCode();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });

  const allAssetContracts = useMemo(
    () =>
      configContracts.pairs
        .map((pair) =>
          pair.pools.map((pool) => [pool.options_contracts.current]).flat(1)
        )
        .flat(1),
    [configContracts]
  );

  const assetCalls = useMemo(
    () =>
      configContracts.pairs
        .map((pair) =>
          pair.pools
            .map((pool) => [
              {
                address: configContracts.meta,
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
  };
  let response: { [key: string]: marketStatusType } = {};

  function getMaxAmount([maxFeeForAbove, maxFeeForBelow]: [
    maxFeeForAbove: string,
    maxFeeForBelow: string
  ]): string | null | undefined {
    return maxFeeForAbove
      ? divide(
          gt(maxFeeForAbove, maxFeeForBelow) ? maxFeeForAbove : maxFeeForBelow,
          configContracts.tokens['USDC'].decimals
        )
      : null;
  }

  function createObject(
    maxAmountArr: [string, string],
    marketOpenArray: boolean[]
  ): marketStatusType {
    return {
      isMarketOpen: marketOpenArray[0],
      maxTradeAmount: getMaxAmount(maxAmountArr),
    };
  }

  if (copy) {
    const numberofResponseForAnAsset = copy.length / allAssetContracts.length;
    let assetIdx = 0;
    copy.forEach((res, idx) => {
      if (idx % numberofResponseForAnAsset === 0) {
        response[allAssetContracts[assetIdx]] = createObject(
          copy[idx],
          copy[idx + 1]
        );
        assetIdx++;
      }
    });
  }
  console.log(response, 'response');
  return response;
}
