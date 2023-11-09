import { SVGProps } from 'react';

export const Person = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="11"
    viewBox="0 0 12 11"
    fill="none"
    {...props}
  >
    <path
      d="M8.625 3C8.625 4.45 7.4497 5.625 6 5.625C4.5503 5.625 3.375 4.45 3.375 3C3.375 1.55 4.5503 0.375 6 0.375C7.4497 0.375 8.625 1.55 8.625 3Z"
      stroke="#D9D9D9"
      //   stroke-width="0.75"
    />
    <path
      d="M1.5275 10.5C1.7762 8.25 3.6837 6.5 6 6.5C8.316 6.5 10.224 8.25 10.473 10.5H1.5275Z"
      stroke="#D9D9D9"
    />
  </svg>
);
