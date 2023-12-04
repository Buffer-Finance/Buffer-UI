export function getTradeTableError(userAddress: string | undefined) {
  if (userAddress === undefined) return 'Wallet not connected.';
  return 'No trades found.';
}
