export function getTokenXquery(tokensArray: string[]) {
  return tokensArray
    .map(
      (token) => `${token}stats:dashboardStat (id : "${token}") {
    totalSettlementFees
    totalTrades
    totalVolume
  }`
    )
    .join(' ');
}
