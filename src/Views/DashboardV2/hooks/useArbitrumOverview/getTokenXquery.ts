export function getTokenXquery(tokensArray: string[]) {
  return tokensArray
    .filter((token) => !token.includes('.e'))
    .map((token) => {
      const tokenName = token.toLowerCase().includes('.e')
        ? token.replace('.', '_')
        : token;
      return `${tokenName}stats:dashboardStat (id : "${token}") {
    totalSettlementFees
    totalTrades
    totalVolume
  }`;
    })
    .join(' ');
}
