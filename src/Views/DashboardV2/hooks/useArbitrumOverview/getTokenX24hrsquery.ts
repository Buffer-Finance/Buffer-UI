export function getTokenX24hrsquery(
  tokensArray: string[],
  prevDayEpoch: number
) {
  return tokensArray
    .filter((token) => !token.includes('.e'))
    .map((token) => {
      const tokenName = token.toLowerCase().includes('.e')
        ? token.replace('.', '_')
        : token;

      const condition =
        tokenName === 'total'
          ? `depositToken: "${token}"`
          : `optionContract_: {pool: "${token}"}, depositToken_not: "total"`;

      return `${tokenName}24stats:volumePerContracts(
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
