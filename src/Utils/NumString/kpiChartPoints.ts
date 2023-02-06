import { ICallBooster } from "@Contexts/Pages/CallBoosters/interfaces";
import { denominations, offSet } from "@Utils/chartDataPoints";
import {
  add,
  subtract,
  divide,
  multiply,
  lte,
  gte,
  abs,
  gt,
} from "@Utils/NumString/stringArithmatics";
import { IDot } from "@Views/Common/AreaChart";

type point = {
  price: number;
  roi: number;
};
function kpiChartPoints(
  data: ICallBooster,
  strike: string,
  fee: string,
  decimals: number,
  totalPoints,
  amount: string
) {
  let unitFeeWei = divide(fee, multiply(amount, decimals));
  let points: point[] = [];
  let current = data.current.toString();
  // let distance = multiply("10", 8);
  // let expectedPrice = start;
  let dip = 0;
  let start = multiply(current, ((100 - offSet) / 100).toString());
  let end = multiply(current, ((offSet + 100) / 100).toString());
  let distance = divide(subtract(end, start), denominations.toString());
  let idx = 0;
  while (gt(end, start)) {
    idx++;
    if (idx == denominations) break;

    let roi = gt(strike, start) ? -100 : 100;
    points.push({
      roi: Number(roi),
      price: Number(divide(start, 8)),
    });
    start = add(start, distance);
  }

  // for (let i = 0; i < 17; i++) {
  //   let roi = -100;
  //   points.push({
  //     roi: Number(roi),
  //     price: Number(divide(expectedPrice, 8)),
  //   });
  //   expectedPrice = subtract(expectedPrice, distance);
  // }
  // expectedPrice = add(strike, distance);
  // points = points.reverse();
  // for (let i = 0; i < 60; i++) {
  //   points.push({
  //     roi: 100,
  //     price: Number(divide(expectedPrice, 8)),
  //   });
  //   expectedPrice = add(expectedPrice, distance);
  // }
  // points = points.reverse();
  dip = -1;
  for (let i = 1; i < points.length - 1; i++) {
    if (
      points[i - 1].roi<=0
    ) {
      dip = i;
      // break;
    }

  }
  return [
    [
      { name: "break-even", displayName: "BE", index: dip ,hide:true},
      { name: "strike-price", displayName: "Target TVL", index: dip },
      { name: "current-price", displayName: "Spot", index: denominations / 2 },
    ] as IDot[],
    points,
  ];
}

export default kpiChartPoints;
