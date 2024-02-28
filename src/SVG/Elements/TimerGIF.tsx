import * as React from 'react';

function TimerGIF(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={17} height={18} fill="none" {...props}>
      <path
        d="M8.794 1.145a7.794 7.794 0 107.794 7.794 7.81 7.81 0 00-7.794-7.794zm0 14.389a6.596 6.596 0 116.595-6.595 6.603 6.603 0 01-6.595 6.595zm4.797-6.595a.6.6 0 01-.6.6H8.794a.6.6 0 01-.6-.6V4.742a.6.6 0 111.2 0v3.597h3.597a.6.6 0 01.6.6z"
        fill="#8F95A4"
        stroke="#8F95A4"
        strokeWidth={0.779}
      />
    </svg>
  );
}

const MemoTimerGIF = React.memo(TimerGIF);
export default MemoTimerGIF;
