import { Circle } from "@mui/icons-material";

import { ICallBooster } from "@Contexts/Pages/CallBoosters/interfaces";
import React, { useEffect, useState, useRef } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataPoint } from "@Utils/chartDataPoints";
import { numberWithCommas } from "@Utils/display";
import { toFixed } from "@Utils/NumString";
import { divide } from "@Utils/NumString/stringArithmatics";
import { toFixedString } from "@Views/AdminPage/CallBoosterBox";
import AlignerMobile from "@Views/Common/Mobile/AlignerMobile";
import { Display } from "../Tooltips/Display";
export interface IDot {
  name: string;
  index: number;
  displayName: string;
  hide?: boolean;
}
interface IROIChart {
  data: dataPoint[];
  dots: IDot[];
  currentProduct: ICallBooster;
}
const ROIChart: React.FC<IROIChart> = ({ data, dots, currentProduct }) => {
  const dotProps = {
    r: 4,
    fill: "var(--bg-19)",
    fillOpacity: 1,
    stroke: "var(--white-blue)",
    strokeWidth: 3,
  };
  const labelProps = {
    fill: "var(--text-1)",
    offset: 10,
    fontSize: "1.2rem",
  };
  const names = {
    BE: `Break-Even ${
      currentProduct.tag.toLowerCase().includes("kpi") ? "TVL" : "Price"
    }`,
    Spot: `Current ${
      currentProduct.tag.toLowerCase().includes("kpi") ? "TVL" : "Price"
    }`,
    SP: `${
      currentProduct.tag.toLowerCase().includes("kpi")
        ? "Target TVL"
        : "Strike Price"
    }`,
  };
  // const strikeIdx =
  const id = currentProduct.contract;
  const isKpi = currentProduct.tag.toLowerCase().includes("kpi");
  const be = dots.filter((d) => d.name.toLowerCase() === "break-even")[0];
  const breakEven = data[be.index];
  const [percentage, setPercentage] = useState<number | null>(isKpi ? 50 : 0);
  useEffect(() => {
    if (isKpi) return;
    let max = -1e29;
    let min = 1e29;
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.roi < min) {
        min = element.roi;
      }
      if (element.roi > max) {
        max = element.roi;
      }
    }
    let secondDot = data[be.index];
    let breakEven = secondDot.roi;
    let range = Math.abs(max - min);
    let point = Math.abs(breakEven - min);
    // rang *x% = point

    let x = (point / range) * 100;
    // setPercentage(80);
    setPercentage(100 - x);
  }, [data, dots, currentProduct.underlying]);
  let margin = 26;

  if (isKpi) margin = 30;
  return percentage !== null ? (
    <ResponsiveContainer width={"100%"} height={260}>
      <AreaChart
        width={400}
        height={200}
        data={data}
        margin={{ top: 13, right: margin, left: margin, bottom: 5 }}
        style={{
          background: "var(--bg-19)",
          borderRadius: 16,
          margin: "1.6rem 0rem",
          // paddingBottom: "1rem",
        }}
      >
        <defs>
          <linearGradient id={`${id}areaColor`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset={`${percentage}%`}
              stopColor="var(--green)"
              stopOpacity={0.2}
            />
            <stop
              offset={`${percentage}%`}
              stopColor={"var(--red)"}
              stopOpacity={0.1}
            />
            <stop offset={`100%`} stopColor={"#fb5260"} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id={`${id}lineColor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset={`${percentage}%`} stopColor="var(--green)" />
            <stop
              offset={`${percentage}%`}
              stopColor={"var(--red)"}
              stopOpacity={0.7}
            />
            <stop offset="100%" stopColor={"var(--red)"} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="price"
          // tickLine={false}
          stroke="var(--text-6)"
          tickCount={3}
          fontSize={12}
          tickFormatter={(number) => {
            let de = 3;
            if (number > 10000)
              return numberWithCommas(toFixed(number + "", 0));
            return toFixed(number + "", 3);
          }}
          interval={13.5}
          axisLine={false}
          overflow={"visible"}
          tickLine={false}
          style={{
            transform: `translateY(-2%)`,
          }}
        >
          <Label
            style={{
              textAnchor: "middle",
              fontSize: "1.2rem",
              fill: "var(--text-6)",
              transform: `translateY(-6%)`,
            }}
            value={
              "<- " +
              (isKpi
                ? currentProduct.underlying.replace("_", " ")
                : currentProduct.underlying + ` ${isKpi ? "" : "Price"} `) +
              " ->"
            }
            position="bottom"
          />
        </XAxis>
        <ReferenceDot
          y={0}
          x={20}
          // shape={CustomReferenceDot}
          isFront
          ifOverflow="extendDomain" // xAxisId={5}
          // yAxisId={5}
        />
        <YAxis type="number" domain={[-20, 20]} hide></YAxis>
        <CartesianGrid
          strokeDasharray="2 1"
          stroke="var(--text-6)"
          strokeOpacity={0.1}
          horizontal={false}
        />
        <Tooltip
          content={
            <CustomTooltip
              names={names}
              dots={dots}
              currentProduct={currentProduct}
              data={data}
              breakEven={breakEven}
              dontShowBreakEven={be.hide}
            />
          }
          label="2h3"
          itemStyle={{
            color: "red",
            fontSize: 23,
            fontWeight: 700,
          }}
        />
        <Area
          type="monotone"
          dataKey="roi"
          stroke={`url(#${id}lineColor)`}
          strokeWidth={2.5}
          fillOpacity={1}
          fill={`url(#${id}areaColor)`}
        />
        <ReferenceLine y={0} stroke="var(--text-6)" />
        {/* {dots[1].index !== -1 && breakEven  && (
          <ReferenceDot x={breakEven.price} y={0} {...dotProps}>
            <Label {...labelProps} position={"top"}>
              BE
            </Label>
          </ReferenceDot>
        )} */}

        {dots.map((d) => {
          if (d.hide) return null;
          if (d.index >= data.length) return;
          if (!data[d.index]?.price) return;
          return (
            <ReferenceDot
              x={data[d.index].price}
              y={0}
              {...dotProps}
              key={d.index}
            >
              <Label {...labelProps} position={"top"}>
                {d.displayName}
              </Label>
            </ReferenceDot>
          );
        })}
        {/* {!dots[0].hide && (
          <ReferenceDot x={strike.price} y={0} {...dotProps}>
            <Label {...labelProps} position={"top"}>
              {isKpi ? 'Target TVL':'SP'}
            </Label>
          </ReferenceDot>
        )} */}
      </AreaChart>
    </ResponsiveContainer>
  ) : (
    <div>fetching data</div>
  );
};
export default ROIChart;
const CustomTooltip: React.FC<any> = ({
  active,
  payload,
  label,
  currentProduct,
  data,
  dots,
  names,
}) => {
  if (active) {
    let roi = toFixedString(payload[0].value, 0, 2);
    let riskToReward = divide(
      toFixedString(payload[0].value + 100, 0, 2),
      "100"
    );

    return (
      <div className="tooltip flex-col items-start content-start">
        <h4
          className="margin-nil text-center full-width tmb xsf text-6"
          style={{ fontWeight: "400" }}
        >
          {dots.map(
            (d) =>
              data &&
              data.length &&
              d.index < data.length &&
              data[d.index]?.price == label &&
              !d.hide && <>{names[d.displayName]}</>
          )}
        </h4>
        <AlignerMobile
          // eachRowStyles="margin-nil"
          keys={[
            `Expected ${
              currentProduct.tag.toLowerCase().includes("kpi") ? "TVL" : "Price"
            } : `,
            "ROI : ",
            "Risk to Reward : ",
          ]}
          values={[
            <Display label={"$"} data={label + ""} />,
            <span
              className={"green-bold"}
              style={{
                color: payload[0].value > 0 ? "var(--green)" : "var(--red)",
              }}
            >
              {roi}%
            </span>,
            <span
              className={"green-bold"}
              style={{
                color: payload[0].value > 0 ? "var(--green)" : "var(--red)",
              }}
            >
              1:{toFixed(riskToReward, 1)}
            </span>,
          ]}
        />
      </div>
    );
  }
  return null;
};