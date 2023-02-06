import * as React from "react";
import NumberTooltip from "@Views/Common/Tooltips";

const YellowWarning = (props) => (
  <NumberTooltip content={props.tooltip}>
    <svg
      width={14}
      height={14}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={7.239} cy={7.239} r={6.761} fill="#EEAA00" />
      <path
        d="m7.914 2.983-.107 6.005h-1.14L6.56 2.983h1.354Zm-.675 8.508a.803.803 0 0 1-.584-.239.783.783 0 0 1-.239-.584.765.765 0 0 1 .239-.577.797.797 0 0 1 .584-.242c.222 0 .415.08.576.242a.793.793 0 0 1 .128.992.852.852 0 0 1-.296.297.777.777 0 0 1-.408.11Z"
        fill="var(--bg-23)"
      />
    </svg>
  </NumberTooltip>
);

export default YellowWarning;
