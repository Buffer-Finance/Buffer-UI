export function getSafeStrike(
  strike: number,
  isAbove: boolean,
  spreadConfig1: number,
  spreadConfig2: number,
  spreadFactor: number,
  totalMarketOI: number,
  getMaxOI: number,
  iv: number
): number {
  const m = Math.floor((spreadConfig2 - spreadConfig1) / 1350);
  const c = Math.floor((22 * spreadConfig1 - 5 * spreadConfig2) / 27);
  let spread = m * iv + c;

  spread =
    spread *
    spreadFactor *
    Math.floor(totalMarketOI / (1e3 * getMaxOI + spread));

  if (isAbove) {
    return (strike * (1e8 + spread)) / 1e8;
  } else {
    return (strike * (1e8 - spread)) / 1e8;
  }
}
