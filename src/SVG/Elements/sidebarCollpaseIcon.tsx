import * as React from "react";
import { SVGProps } from "react";

const SidebarCollapseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={25} height={23} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.259 11.558h-19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22.259 3.982h-9" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <path
      // opacity={0.301}
      d="M22.259 19.134h-9"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m7.259 6.823-5 4.735 5 4.735"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SidebarCollapseIcon;
