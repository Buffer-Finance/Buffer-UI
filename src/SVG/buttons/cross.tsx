import * as React from "react";

const CrossIcon = (props) => (
  <svg
    width={25}
    height={25}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={12.374} cy={12.61} r={12} fill={props.bg} />
    <path
      d="m15.874 9.11-7 7M8.874 9.11l7 7"
      stroke="var(--text-1)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CrossIcon;
