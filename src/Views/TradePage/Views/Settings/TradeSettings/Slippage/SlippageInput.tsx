import { gt } from '@Utils/NumString/stringArithmatics';
import { MAX_SLIPPAGE, SLIPPAGE_DEFAULTS } from '@Views/TradePage/config';
import { Trans } from '@lingui/macro';
import { useState } from 'react';

export const SlippageInput: React.FC<{
  onChange: (newSlippage: number) => void;
  slippage: number;
}> = ({ onChange, slippage }) => {
  const [err, setErr] = useState(false);

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
          if (gt(e.target.value || '0', MAX_SLIPPAGE.toString())) {
            setErr(true);
            return;
          }
          if (
            e.target.value.split('.')[1] &&
            e.target.value.split('.')[1].length > 2
          )
            return;
          onChange(+e.target.value);
          setErr(false);
        }}
        placeholder="Enter value"
      />
      <span className="absolute right-5">%</span>
      {err && (
        <Trans>
          <span className="absolute top-full left-[-20px] text-red whitespace-nowrap">
            Slippage rate must be less then {MAX_SLIPPAGE}%
          </span>
        </Trans>
      )}
    </div>
  );
};
