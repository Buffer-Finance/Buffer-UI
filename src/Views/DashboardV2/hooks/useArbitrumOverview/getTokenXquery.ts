export function getTokenXquery(tokensArray: string[]) {
  return tokensArray
    .map((token) => {
      const tokenName = token.toLowerCase().includes('.e')
        ? token.replace('.', '_')
        : token;
      return `${tokenName}stats:dashboardStat (id : "${token}") {
    totalSettlementFees
    totalTrades
    totalVolume
    openInterest
  }`;
    })
    .join(' ');
}
