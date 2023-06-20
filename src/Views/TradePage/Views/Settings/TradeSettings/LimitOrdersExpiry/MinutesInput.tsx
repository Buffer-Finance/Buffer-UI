import { gt, lt } from '@Utils/NumString/stringArithmatics';
import { MHdropDown } from './MHdropDown';
import { useState } from 'react';
import { Trans } from '@lingui/macro';

export const MinutesInput: React.FC<{
  onChange: (newSlippage: string) => void;
  setFrame: (newFrame: string) => void;
  minutes: string;
  activeFrame: string;
  className?: string;
  inputClassName?: string;
}> = ({
  onChange,
  minutes,
  setFrame,
  activeFrame,
  className = '',
  inputClassName = '',
}) => {
  const [err, setErr] = useState(false);

  const MAX = activeFrame === 'm' ? 60 : 24;

  return (
    <div className={`${className} relative flex flex-col items-start`}>
      <div className={`${className} relative flex flex-row gap-4 items-center`}>
        <input
          value={minutes}
          type="number"
          max={MAX}
          min={1}
          className={`${inputClassName} border-2 border-[#2A2A3A] bg-[#222234] px-3 py-[10px] rounded-[5px] outline-none focus:border-[#00bbff42] w-[68px] text-f10 text-1`}
          onChange={(e) => {
            if (e.target.value === '.') return;
            if (e.target.value.length > 2) return;
            if (gt(e.target.value || '0', MAX.toString())) {
              setErr(true);
              onChange(MAX.toString());
            } else {
              setErr(false);
              onChange(e.target.value);
            }
          }}
          placeholder="10"
        />
        <span className="absolute right-3">
          <MHdropDown setFrame={setFrame} activeFrame={activeFrame} />
        </span>
      </div>

      {err && (
        <Trans>
          <span className=" text-red whitespace-nowrap">
            {`Max ${activeFrame} : ${MAX} `}
          </span>
        </Trans>
      )}
    </div>
  );
};
