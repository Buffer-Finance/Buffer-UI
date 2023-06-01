import { SLIPPAGE_DEFAULTS } from '@Views/TradePage/config';

export const SlippageSelector: React.FC<{
  currentSlippage: number;
  onClick: (newSlippage: number) => void;
}> = ({ currentSlippage, onClick }) => {
  return (
    <div className="flex flex-row gap-3 text-f10 text-3 items-center">
      {SLIPPAGE_DEFAULTS.map((s) => (
        <div
          key={s}
          className={
            (+currentSlippage == s
              ? 'bg-blue text-1 font-semibold'
              : 'bg-[#1C1C28] text-[#c3c2d4]') +
            ' border border-[#2A2A3A] rounded-[5px] hover:border-[#00bbff42] cursor-pointer px-5 py-3'
          }
          role="button"
          onClick={() => onClick(s)}
        >
          {s}%
        </div>
      ))}
    </div>
  );
};
