export function getRoundedPrice(price: number, step: number) {
  return Math.round(price / step) * step;
}
