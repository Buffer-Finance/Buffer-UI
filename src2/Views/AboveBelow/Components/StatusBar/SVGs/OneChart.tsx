import { SVGProps } from 'react';

export const OneChart = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={13}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M9.429 1.625c.434 0 .785.363.785.813v8.124c0 .45-.35.813-.785.813H1.57a.799.799 0 0 1-.785-.813V2.438c0-.45.35-.813.785-.813H9.43ZM1.57.812C.705.813 0 1.542 0 2.438v8.126c0 .896.705 1.624 1.571 1.624H9.43c.866 0 1.571-.728 1.571-1.624V2.437c0-.896-.705-1.624-1.571-1.624H1.57Z"
    />
  </svg>
);
