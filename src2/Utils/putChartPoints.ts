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
function putChartPoints(
  strike: string,
  breakEven: string,
  fee: string,
  decimals: number,
  totalPoints,
  amount: string
) {
  let unitFeeWei = divide(fee, multiply(amount, decimals));
  let points: point[] = [];
  let diff = subtract(strike, breakEven);
  let distance = divide(diff, "5");
  let expectedPrice = strike;
  let dip = 0;
  // 25 15
  // breakeven - strikprice -----

  // create strike - maxProfit dataset
  // reverse it maxProfit - strike
  // add 10 strik + diff where roi is 0

  for (let i = 0; i < 25; i++) {
    // for (let i = 0; i < 6; i++) {
    //   let backwardPrice = subtract(
    //     expectedPrice,
    //     multiply(distance, (6 - i).toString())
    //   );
    //   points.push({
    //     roi: "-100",
    //     price: divide(backwardPrice, 8),
    //   });
    // }
    // for (let i = 0; i < 11; i++) {
    let payout = divide(subtract(strike, expectedPrice), 8);
    let roi = multiply(divide(subtract(payout, unitFeeWei), unitFeeWei), "100");
    points.push({
      roi: Number(roi),
      price: Number(divide(expectedPrice, 8)),
    });
    expectedPrice = subtract(expectedPrice, distance);
    // }
  }
  expectedPrice = add(strike, distance);
  points = points.reverse();
  for (let i = 0; i < 7; i++) {
    points.push({
      roi: -Number(100),
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
  dip = points.length - 13;
  // }
  return [dip, points];
}

export default putChartPoints;
