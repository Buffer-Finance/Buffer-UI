import { useReadCall } from '@Utils/useReadCall';
import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useMemo } from 'react';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useQTinfo } from '@Views/BinaryOptions';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import MaxTradeABI from '@Views/BinaryOptions/ABI/MaxTrade.json';
import { usdcDecimals } from '@Views/V2-Leaderboard/Incentivised';

export function useMarketStatus() {
  const { address: account } = useUserAccount();
  const qtInfo = useQTinfo();
  const referralData = useReferralCode(qtInfo.activeChain);
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });

  const assetCalls = useMemo(
    () =>
      qtInfo.pairs
        .map((pair) =>
          pair.pools
            .map((pool) => [
              {
                address: qtInfo.optionMeta,
                abi: MaxTradeABI,
                name: 'calculateMaxAmount',
                params: [
                  pool.options_contracts.current,
                  highestTierNFT?.tokenId || 0,
                  referralData[2],
                  account || '0x0000000000000000000000000000000000000000',
                ],
              },
            ])
            .flat(1)
        )
        .flat(1),

    [account, referralData, highestTierNFT]
  );

  console.log(assetCalls, 'assetCalls');

  const calls = [...assetCalls];

  let copy = useReadCall({ contracts: calls }).data as unknown as string[];
  let response = [null, null, null, null];

  if (copy) {
    let [maxAmounts] = copy.slice(0, assetCalls.length);

    //calculate maxTradeValue
    const maxTrade = maxAmounts?.[0]
      ? divide(
          gt(maxAmounts[0], maxAmounts[1]) ? maxAmounts[0] : maxAmounts[1],
          usdcDecimals
        )
      : null;
  }

  return response;
}
