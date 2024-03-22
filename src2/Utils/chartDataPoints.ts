import { ICallBooster } from "@Contexts/Pages/CallBoosters/interfaces";
import {
  add,
  subtract,
  divide,
  multiply,
  lte,
  gt,
} from "@Utils/NumString/stringArithmatics";
import { IDot } from "@Views/Common/AreaChart";

export type dataPoint = {
  price: number;
  roi: number;
};
export const offSet = 15;
export const denominations = 100;
function generatePoints(data: ICallBooster, unitFeeWei: string) {
  let points: dataPoint[] = [];
  if (!data.current) return null;
  let strike = data.strike.toString();
  let current = data.current.toString();

  let dip = 0;
  let sp = 0;
  let start = multiply(current, ((100 - offSet) / 100).toString());
  let end = multiply(current, ((offSet + 100) / 100).toString());
  let distance = divide(subtract(end, start), denominations.toString());
  let idx = 0;
  while (gt(end, start)) {
    idx++;
    if (idx == denominations) break;
    let payout = getVanillaOptionPayout(start, strike);
    let roi = getRoi(payout, unitFeeWei);
    points.push({
      roi: Number(roi),
      price: Number(divide(start, 8)),
    });
    start = add(start, distance);
  }
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i].roi >= 0) {
      dip = i;
      break;
    }
  }
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i].roi > -100) {
      sp = i;
      break;
    }
  }
  return [
    [
      { name: "break-even", displayName: "BE", index: dip },
      { name: "current-price", displayName: "Spot", index: denominations / 2 },
      { name: "strike-price", displayName: "SP", index: sp },
    ] as IDot[],
    points,
  ];
}

export default generatePoints;

export const getRoi = (payout, unitFeeWei) => {
  let roi = multiply(divide(subtract(payout, unitFeeWei), unitFeeWei), "100");
  roi = gt("-100", roi) ? "-100" : roi;
  return roi;
};

function getVanillaOptionPayout(expectedPrice, strike) {
  return divide(subtract(expectedPrice, strike), 8);
}
