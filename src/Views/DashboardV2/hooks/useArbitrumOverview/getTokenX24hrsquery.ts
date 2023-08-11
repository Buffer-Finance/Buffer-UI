import { poolInfoByAssetType } from '@Views/TradePage/Hooks/usePoolByAsset';

export function getTokenX24hrsquery(
  tokensArray: string[],
  prevDayEpoch: number,
  poolsByToken: poolInfoByAssetType
) {
  return tokensArray
    .map((token) => {
      const poolContract = token !== 'total' && poolsByToken[token].poolAddress;
      const condition =
        token === 'total'
          ? `depositToken: "${token}"`
          : `optionContract_: {poolContract: "${poolContract}"}, depositToken_not: "total"`;

      return `${token}24stats:volumePerContracts(
            orderBy: timestamp
            orderDirection: desc
            first: 10000
            where: {${condition}, timestamp_gt: ${prevDayEpoch}}
            ) {
              amount
              settlementFee
            }`;
    })
    .join(' ');
}
