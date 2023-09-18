export function calculateOptionIV(
  isAbove: boolean,
  optionStrike: number,
  currentPrice: number,
  iv: number,
  ivFactorITM: number,
  ivFactorOTM: number
): number {
  const isITM =
    (isAbove && optionStrike < currentPrice) ||
    (!isAbove && optionStrike > currentPrice);

  return isITM ? (iv * ivFactorITM) / 100 : (iv * ivFactorOTM) / 100;
}
