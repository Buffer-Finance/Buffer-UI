import {
  add,
  subtract,
  divide,
  multiply,
  lte,
  gte,
  abs,
} from "@Utils/NumString/stringArithmatics";

type point = {
  price: number;
  roi: number;
};
function kpiChartPoints(
  strike: string,
  fee: string,
  decimals: number,
  totalPoints,
  amount: string
) {
  let unitFeeWei = divide(fee, multiply(amount, decimals));
  let points: point[] = [];
  let distance = multiply("10", 8);
  let expectedPrice = strike;
  let dip = 0;
  for (let i = 0; i < 17; i++) {
    let roi = -100;
    points.push({
      roi: Number(roi),
      price: Number(divide(expectedPrice, 8)),
    });
    expectedPrice = subtract(expectedPrice, distance);
  }
  expectedPrice = add(strike, distance);
  points = points.reverse();
  for (let i = 0; i < 60; i++) {
    points.push({
      roi: 100,
      price: Number(divide(expectedPrice, 8)),
    });
    expectedPrice = add(expectedPrice, distance);
  }
  // points = points.reverse();
  // for (let i = 1; i < points.length - 1; i++) {
  //   if (
  //     gte(abs(points[i - 1].roi), abs(points[i].roi)) &&
  //     gte(abs(points[i + 1].roi), abs(points[i].roi))
  //   ) {
  //     dip = i;
  //   }
  dip = -1;
  // }
  return [dip, points];
}

export default kpiChartPoints;
