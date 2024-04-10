import * as React from 'react';

function TVLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={29} height={15} fill="none" {...props}>
      <path
        d="M11.437 15H5.718V5.833H0V0h11.437v15zm11.436 0h-6.535l6.127-15H29l-6.127 15zM16.338 6.667c1.805 0 3.268-1.493 3.268-3.334 0-1.84-1.463-3.333-3.268-3.333-1.805 0-3.268 1.492-3.268 3.333 0 1.841 1.463 3.334 3.268 3.334z"
        fill="currentColor"
      />
    </svg>
  );
}

const MemoTVLogo = React.memo(TVLogo);
export default MemoTVLogo;
