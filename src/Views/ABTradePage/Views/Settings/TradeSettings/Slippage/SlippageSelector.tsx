import { SLIPPAGE_DEFAULTS } from '@Views/ABTradePage/config';

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
              ? 'border-[#a3e3ff] text-1 font-semibold'
              : ' border-[#2A2A3A] text-[#c3c2d4]') +
            ' border bg-[#1C1C28] rounded-[5px] hover:border-[#a3e3ff] cursor-pointer px-5 py-3'
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
