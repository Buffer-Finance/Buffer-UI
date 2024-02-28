import * as React from 'react';

function BorderSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={246} height={247} fill="none" {...props}>
      <path
        d="M199.801 31.414a119.881 119.881 0 0141.535 72.152M139.792 4.79a119.328 119.328 0 0136.478 11.28"
        stroke="#A3E3FF"
        strokeWidth={5.39}
        strokeMiterlimit={10}
      />
      <path
        d="M243 123.634a120.003 120.003 0 01-74.082 110.873 120.014 120.014 0 01-130.783-26.015A120.005 120.005 0 0156.32 23.852a120.008 120.008 0 0166.673-20.225"
        stroke="#3772FF"
        strokeWidth={5.39}
        strokeMiterlimit={10}
      />
    </svg>
  );
}

const MemoBorderSVG = React.memo(BorderSVG);
export default MemoBorderSVG;
