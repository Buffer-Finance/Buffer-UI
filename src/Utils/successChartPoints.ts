import { ICallBooster } from "@Contexts/Pages/CallBoosters/interfaces";
import {
  add,
  subtract,
  divide,
  multiply,
  lte,
  gt,
  lt,
} from "@Utils/NumString/stringArithmatics";
import { getRoi } from "./chartDataPoints";
import { eToWide } from "./NumString";

type point = {
  price: number;
  roi: number;
};
const offSet = 25;
const denominations = 100;

function generatePoints(data: ICallBooster, unitFeeWei: string) {
  let points: point[] = [];
  let current = data.current.toString();

  let strike = data.strike.toString();
  let start = lt(multiply(current, ((100 - offSet) / 100).toString()), "0")
    ? "0"
    : multiply(current, ((100 - offSet) / 100).toString());
  let end = multiply(current, ((offSet + 100) / 100).toString());
  let distance = divide(subtract(end, start), denominations.toString());
  let idx = 0;
  while (gt(end, start)) {
    // idx++;
    if (idx == denominations) break;
    const roi = getRoi(getSuccessPayout(start, strike), unitFeeWei);

    points.push({
      roi: Number(roi),
      price: Number(divide(start, 8)),
    });
    start = add(start, distance);
  }
  let dip = 0;
  for (let i = 1; i < points.length - 1; i++) {
    if (
      Math.abs(points[i - 1].roi) >= Math.abs(points[i].roi) &&
      Math.abs(points[i + 1].roi) > Math.abs(points[i].roi)
    ) {
      dip = i;
    }
  }
  let sp = 0;
  let minDist = 1e18;
  for (let i = 0; i < points.length - 1; i++) {
    const strikePrice= divide(strike,8);
    let calcDist = Math.abs(points[i].price - +strikePrice)
    if (
      calcDist < minDist
    ) {
     minDist = calcDist;
     sp = i;
    }
  }
  return [
    [
      { name: "break-even", displayName: "BE", index: dip, hide: true },
      { name: "current-price", displayName: "Spot", index: Math.round(points.length / 2) ,},
      { name: "strike-price", displayName: "SP", index: sp},
    ],
    points,
  ];
}

export default generatePoints;

function getSuccessPayout(expectedPrice, strike) {
  const callOptionPayout = lt(subtract(expectedPrice, strike), "0")
    ? "0"
    : subtract(expectedPrice, strike);
  return divide(add(callOptionPayout, expectedPrice), 8);
}
