import {
  escapeRegExp,
  inputRegex,
} from '@Views/TradePage/Views/BuyTrade/CurrentPrice';
import { MAX_SLIPPAGE, SLIPPAGE_DEFAULTS } from '@Views/TradePage/config';

export const SlippageInput: React.FC<{
  onChange: (newSlippage: number) => void;
  slippage: number;
}> = ({ onChange, slippage }) => {
  return (
    <div className="relative flex flex-row gap-x-4 items-center">
      <input
        value={slippage}
        type="number"
        max={MAX_SLIPPAGE}
        className={`relative border-2 border-[#2A2A3A] bg-[#222234] px-5 py-3 rounded-[5px] outline-none focus:border-[#00bbff42] w-[150px] text-f10 ${
          SLIPPAGE_DEFAULTS.includes(slippage) ? 'text-[#c3c2d4]' : 'text-1'
        }`}
        onChange={(e) => {
          if (
            e.target.value.split('.')[1] &&
            e.target.value.split('.')[1].length > 4
          )
            return;
          if (inputRegex.test(escapeRegExp(e.target.value))) {
            onChange(+e.target.value);
          }
        }}
        placeholder="Enter value"
      />
      <span className="absolute right-5">%</span>
    </div>
  );
};
