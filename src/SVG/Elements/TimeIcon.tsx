import * as React from 'react';

function TimeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} fill="none" {...props}>
      <circle
        cx={10}
        cy={10}
        r={9}
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5v7h5"
        stroke="#fff"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoTimeIcon = React.memo(TimeIcon);
export default MemoTimeIcon;
