import * as React from 'react';

function NotifCross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={10} height={9} fill="none" {...props}>
      <path
        d="M8.443.91l.861.75-7.397 6.805-.86-.75L8.442.91zM1.616.848l8.079 7.029-.89.818-8.079-7.03.89-.817z"
        fill="#C3C2D4"
      />
    </svg>
  );
}

const MemoNotifCross = React.memo(NotifCross);
export default MemoNotifCross;
