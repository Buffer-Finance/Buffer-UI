import { ICallBooster } from "@Contexts/Pages/CallBoosters/interfaces";
import { dataPoint, getRoi } from "@Utils/chartDataPoints";
import { add, divide, gt, multiply, subtract } from "@Utils/NumString/stringArithmatics";
const offSet = 25;
const denominations = 100;
export const convertibleChartPoints = (data: ICallBooster, unitFee: string) => {
  let points: dataPoint[] = [];
  if(!data.current) return null;
  let current = data.current.toString();

  let dip = 0;
  let start = multiply(current,((100 -offSet)/100).toString())
  let end = multiply(current,((offSet + 100)/100).toString())
  let distance = divide(subtract(end,start),denominations.toString())
  let idx = 0
  while(gt(end,start)){
    idx++;
    if(idx == denominations) break;
    let roi = getPayoutWithROI(start,data,unitFee);
    points.push({
      roi: Number(roi),
      price: Number(divide(start, 8)),
    });
    start = add(start,distance)
  }
  for (let i = 1; i < points.length - 1; i++) {
    if (points[i].roi >= 0) {
      dip = i;
      break;
    }
  }
  return [[{name:'break-even',displayName:'BE',index:dip},{name:'current-price',displayName:'Spot',index:denominations/2},], points];
};

function getPayoutWithROI(price, data: ICallBooster, unitFee) {
  let payout;
  if (price <= data.lower_bound) {
    let tokens = data.face_value / data.lower_bound;
    payout = (tokens * price) / 1e8;
  } else if (price < data.upper_bound) {
    payout = data.face_value / 1e8;
  } else {
    let tokens = data.face_value / data.upper_bound;
    payout = (tokens * price) / 1e8;
  }
  let roi = getRoi(payout.toString(), unitFee);
  return Number(roi);
}
