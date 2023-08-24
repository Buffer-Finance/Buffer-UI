import * as React from 'react';

interface IProp extends React.SVGProps<SVGSVGElement> {
  count: number;
}
function WalletSVG(props: IProp) {
  return (
    <div className="relative">
      {props.count ? (
        <div className="absolute top-[-6px] right-[-8px] bg-[#B50909] text-f12 min-w-[16px] h-[16px] text-center rounded-full">
          <span className="mt-[-2px] block">{props.count}</span>
        </div>
      ) : null}
      <svg width={22} height={22} fill="none" {...props}>
        <mask id="prefix__a" fill="#fff">
          <rect y={5} width={22} height={17} rx={2} />
        </mask>
        <rect
          y={5}
          width={22}
          height={17}
          rx={2}
          stroke="currentColor"
          strokeWidth={5}
          mask="url(#prefix__a)"
        />
        <mask id="prefix__b" fill="#fff">
          <rect x={6} width={11} height={7} rx={2} />
        </mask>
        <rect
          x={6}
          width={11}
          height={7}
          rx={2}
          stroke="currentColor"
          strokeWidth={5}
          mask="url(#prefix__b)"
        />
      </svg>
    </div>
  );
}

const MemoWalletSVG = React.memo(WalletSVG);
export default MemoWalletSVG;
