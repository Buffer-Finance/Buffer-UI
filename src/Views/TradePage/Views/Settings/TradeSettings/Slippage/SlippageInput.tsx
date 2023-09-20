import { gt, lt } from '@Utils/NumString/stringArithmatics';
import {
  escapeRegExp,
  inputRegex,
} from '@Views/TradePage/Views/BuyTrade/CurrentPrice';
import {
  MAX_SLIPPAGE,
  MIN_SLIPPAGE,
  SLIPPAGE_DEFAULTS,
} from '@Views/TradePage/config';
import { Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';

export const SlippageInput: React.FC<{
  onChange: (newSlippage: number) => void;
  slippage: number;
}> = ({ onChange, slippage }) => {
  const [err, setErr] = useState(false);
  const [minErr, setMinErr] = useState(false);
  // console.log('slippageErr', minErr, err);

  useEffect(() => {
    if (gt(slippage.toString(), MAX_SLIPPAGE.toString())) {
      setErr(true);
    }
    if (lt(slippage.toString(), MIN_SLIPPAGE.toString())) {
      setMinErr(true);
    }
  }, []);

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
          } else {
            setErr(false);
          }
          if (lt(e.target.value || '0', MIN_SLIPPAGE.toString())) {
            setMinErr(true);
          } else {
            setMinErr(false);
          }
          if (
            e.target.value.split('.')[1] &&
            e.target.value.split('.')[1].length > 2
          )
            return;
          if (inputRegex.test(escapeRegExp(e.target.value))) {
            onChange(+e.target.value);
          }
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
      {minErr && (
        <Trans>
          <span className="absolute top-full left-[-20px] text-red whitespace-nowrap">
            Slippage rate must be less then {MIN_SLIPPAGE}%
          </span>
        </Trans>
      )}
    </div>
  );
};
