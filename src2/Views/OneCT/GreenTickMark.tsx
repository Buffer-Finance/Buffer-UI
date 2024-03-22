import { SVGProps } from 'react';

export const GreenTickMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    fill="none"
    {...props}
  >
    <path
      fill="#3FB68B"
      d="M0 3a3 3 0 0 1 3-3h11.657a3 3 0 0 1 3 3v10.041a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Z"
    />
    <path stroke="#fff" strokeWidth={2} d="m4 9 3 3 6.5-8" />
  </svg>
);
