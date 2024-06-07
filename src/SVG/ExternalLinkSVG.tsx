import * as React from 'react';

function ExternalLinkSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={11} height={11} fill="none" {...props}>
      <path
        d="M7.07 0a.788.788 0 00-.557 1.343l1.016 1.014-3.37 3.374A.787.787 0 005.27 6.843L8.64 3.47l1.017 1.017A.786.786 0 0011 3.929V.786A.785.785 0 0010.214 0H7.07zM1.964.786A1.964 1.964 0 000 2.75v6.286C0 10.12.879 11 1.964 11h6.284a1.964 1.964 0 001.964-1.964V7.07a.785.785 0 10-1.571 0v1.965a.394.394 0 01-.393.393H1.964a.394.394 0 01-.393-.393V2.75c0-.216.177-.393.393-.393h1.964a.785.785 0 100-1.571H1.964z"
        fill="#C3C2D4"
      />
    </svg>
  );
}

const MemoExternalLinkSVG = React.memo(ExternalLinkSVG);
export default MemoExternalLinkSVG;
