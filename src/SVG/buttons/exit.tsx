import * as React from "react";
import { SVGProps } from "react";

const InIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={17} height={16} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6.3 7h-6v2h6v3l4-4-4-4v3Z" fill="currentColor" />
    <path
      d="M15.3 16h-14a1 1 0 0 1-1-1v-4h2v3h12V2h-12v3h-2V1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1Z"
      fill="currentColor"
    />
  </svg>
);

export default InIcon;
