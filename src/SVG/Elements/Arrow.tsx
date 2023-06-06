import * as React from 'react';
import { SVGProps } from 'react';
const DDArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={6}
    height={4}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M5.295 0 3 2.472.705 0 0 .761 3 4l1.5-1.62L6 .762 5.295 0Z"
    />
  </svg>
);
export default DDArrow;
