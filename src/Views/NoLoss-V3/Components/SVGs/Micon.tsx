import { SVGProps } from 'react';

export const MIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <circle
      cx={8.5}
      cy={8.5}
      r={8.25}
      stroke="currentColor"
      strokeWidth={0.5}
    />
    <path
      fill="currentColor"
      d="M5.176 13c-.08 0-.12-.04-.12-.12V4.72c0-.08.04-.12.12-.12H6.28c.096 0 .16.04.192.12l2.364 5.424L11.2 4.72c.032-.08.096-.12.192-.12h1.104c.08 0 .12.04.12.12v8.16c0 .08-.04.12-.12.12h-.744c-.08 0-.12-.04-.12-.12V6.124l-2.376 5.364c-.032.072-.084.108-.156.108h-.528c-.072 0-.124-.036-.156-.108L6.04 6.124v6.756c0 .08-.04.12-.12.12h-.744Z"
    />
  </svg>
);
