import {
  add,
  subtract,
  divide,
  multiply,
} from "@Utils/NumString/stringArithmatics";

type point = {
  price: number;
  roi: number;
};
function putChartPoints(strike: string, breakEven: string, unitFeeWei: string) {
  let points: point[] = [];
  let diff = subtract(strike, breakEven);
  let distance = divide(diff, "5");
  let expectedPrice = strike;
  let dip = 0;

  for (let i = 0; i < 25; i++) {
    let payout = divide(subtract(strike, expectedPrice), 8);
    let roi = multiply(divide(subtract(payout, unitFeeWei), unitFeeWei), "100");
    points.push({
      roi: Number(roi),
      price: Number(divide(expectedPrice, 8)),
    });
    expectedPrice = subtract(expectedPrice, distance);
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
  dip = points.length - 13;
  return [dip, points];
}

export default putChartPoints;
