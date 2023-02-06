import * as React from "react";
import { SVGProps } from "react";

const EnterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={17} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M15.924 16.387H5.98v-1.956h8.838V2.694H3.772v5.868h-2.21V1.715c0-.54.495-.978 1.105-.978h13.257c.61 0 1.105.439 1.105.978V15.41c0 .54-.495.978-1.105.978Z"
      fill="currentColor"
    />
    <path d="M12.61 4.65H5.98l2.533 2.242L0 14.431l1.562 1.383 8.514-7.539 2.534 2.243V4.65Z" fill="currentColor" />
  </svg>
);

export default EnterIcon;
