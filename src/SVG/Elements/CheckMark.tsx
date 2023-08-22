import * as React from 'react';

function CheckMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={11} height={8} fill="none" {...props}>
      <path
        d="M3.856 6.215L1.94 4.435a.579.579 0 00-.778 0 .486.486 0 000 .723L3.47 7.303c.215.2.563.2.778 0l5.838-5.43a.486.486 0 000-.723.579.579 0 00-.778 0L3.855 6.215z"
        fill="currentColor"
        stroke="currentColor"
      />
    </svg>
  );
}

const MemoCheckMark = React.memo(CheckMark);
export default MemoCheckMark;
