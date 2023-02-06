import { SVGProps } from 'react';

const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={13}
    height={10}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M.255 4.666 4.459.462l.77.771-3.272 3.273h9.592a.545.545 0 1 1 0 1.09H1.957L5.23 8.87l-.772.77L.255 5.438a.545.545 0 0 1 0-.771Z"
      fill="var(--text-1)"
    />
  </svg>
);

export default BackIcon;
