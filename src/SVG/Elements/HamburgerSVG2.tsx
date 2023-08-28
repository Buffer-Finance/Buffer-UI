import * as React from 'react';

function HamburgerSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={22} height={16} fill="none" {...props} role="button">
      <path
        d="M2 2h17.82M2 8h17.82M2 14h17.82"
        stroke="#808191"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

const MemoHamburgerSVG = React.memo(HamburgerSVG);
export default MemoHamburgerSVG;
