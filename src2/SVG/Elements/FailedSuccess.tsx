import * as React from "react";
import { SVGProps } from "react";

const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={0.394}
      y={0.394}
      width={23.212}
      height={23.212}
      rx={11.606}
      fill="#ff5353"
      stroke="#ff5353"
      strokeWidth={0.788}
    />
    <path
      d="m17.862 9.284-7.277 6.868h-.007a1.01 1.01 0 0 1-.631.281.978.978 0 0 1-.637-.29l-3.052-2.865a.204.204 0 0 1-.065-.145.193.193 0 0 1 .065-.145l.97-.911a.222.222 0 0 1 .305 0l2.42 2.268 6.64-6.284A.216.216 0 0 1 16.75 8a.209.209 0 0 1 .155.061l.952.926a.202.202 0 0 1 .073.147.192.192 0 0 1-.067.15Z"
      fill="#ffffff"
      stroke="#ffffff"
    />
  </svg>
);

export default SuccessIcon;
