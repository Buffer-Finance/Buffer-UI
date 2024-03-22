import * as React from 'react';

function HamburgerBack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={25} height={25} fill="none" {...props}>
      <path
        d="M22.259 12.434h-19"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.259 4.26h-9"
        stroke="#808191"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity={0.301}
        d="M22.259 20.608h-9"
        stroke="#808191"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.259 7.325l-5 5.109 5 5.108"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoHamburgerBack = React.memo(HamburgerBack);
export default MemoHamburgerBack;
