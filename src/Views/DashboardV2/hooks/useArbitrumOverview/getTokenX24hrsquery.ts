import { poolInfoByAssetType } from '@Views/TradePage/Hooks/usePoolByAsset';

export function getTokenX24hrsquery(
  tokensArray: string[],
  prevDayEpoch: number,
  poolsByToken: poolInfoByAssetType
) {
  return tokensArray
    .map((token) => {
      // console.log('token', token, poolsByToken);
      const tokenName = token.toLocaleLowerCase().includes('_pol')
        ? token.toUpperCase().replace('_POL', '-POL')
        : token.toUpperCase();
      const poolContract =
        token !== 'total' && poolsByToken[tokenName].poolAddress;
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
