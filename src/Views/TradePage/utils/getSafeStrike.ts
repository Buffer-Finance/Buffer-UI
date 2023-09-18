export function getSafeStrike(
  strike: number,
  isAbove: boolean,
  spreadConfig1: number,
  spreadConfig2: number,
  iv: number
): number {
  const m = (spreadConfig2 - spreadConfig1) / 1350;
  const c = (22 * spreadConfig1 - 5 * spreadConfig2) / 27;
  const spread = m * iv + c;

  if (isAbove) {
    return (strike * (1e8 + spread)) / 1e8;
  } else {
    return (strike * (1e8 - spread)) / 1e8;
  }
}
