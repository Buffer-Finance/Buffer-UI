import { gt, lt } from '@Utils/NumString/stringArithmatics';
import { MHdropDown } from './MHdropDown';
import { useState } from 'react';
import { Trans } from '@lingui/macro';

export const MinutesInput: React.FC<{
  onChange: (newSlippage: number) => void;
  setFrame: (newFrame: string) => void;
  minutes: number;
  activeFrame: string;
}> = ({ onChange, minutes, setFrame, activeFrame }) => {
  const [err, setErr] = useState(false);

  const MAX = activeFrame === 'm' ? 60 : 24;

  return (
    <div className="relative flex flex-row gap-x-4 items-center">
      <input
        value={minutes}
        type="number"
        max={MAX}
        min={1}
        className={`border-2 border-[#2A2A3A] bg-[#222234] px-3 py-[10px] rounded-[5px] outline-none focus:border-[#00bbff42] w-[68px] text-f10 text-1`}
        onChange={(e) => {
          if (gt(e.target.value || '0', MAX.toString())) {
            setErr(true);
            return;
          }

          onChange(+e.target.value);
          setErr(false);
        }}
        placeholder="10"
      />
      <span className="absolute right-3">
        <MHdropDown setFrame={setFrame} activeFrame={activeFrame} />
      </span>
      {err && (
        <Trans>
          <span className="absolute top-full left-auto right-auto  text-red whitespace-nowrap">
            {`Max ${activeFrame} : ${MAX} `}
          </span>
        </Trans>
      )}
    </div>
  );
};
