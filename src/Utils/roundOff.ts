export function roundToTwo(
  num: string | null | undefined,
  roundNumber: number
): string | null {
  if (num === null || num === undefined) {
    return null;
  }
  return Math.round(+(num + `e+${roundNumber}`)) + `e-${roundNumber}`;
}
