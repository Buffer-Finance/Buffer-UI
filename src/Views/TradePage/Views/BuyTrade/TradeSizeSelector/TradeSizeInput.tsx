import { gt } from '@Utils/NumString/stringArithmatics';
import { BuyUSDCLink } from '@Views/BinaryOptions/PGDrawer/BuyUsdcLink';
import { tradeSizeAtom } from '@Views/TradePage/atoms';
import { Trans } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useState } from 'react';

export const TradeSizeInput: React.FC<{
  maxTradeSize: string;
  tokenName: string;
}> = ({ maxTradeSize, tokenName }) => {
  const [err, setErr] = useState(false);
  const [tradeSize, setTradeSize] = useAtom(tradeSizeAtom);

  return (
    <div className="relative flex flex-row gap-x-4 items-center">
      <input
        value={tradeSize}
        type="number"
        max={maxTradeSize}
        className={`relative bg-[#282b39] px-5 py-3 rounded-[5px] outline-none w-full text-f16 text-1`}
        onChange={(e) => {
          if (gt(e.target.value || '0', maxTradeSize)) {
            setErr(true);
          }
          setTradeSize(+e.target.value);
          setErr(false);
        }}
        placeholder="Enter value"
      />
      <button
        className="absolute right-3 bg-[#141823] rounded-[6px] py-2 px-[6px] text-f12"
        onClick={() => {
          setTradeSize(+maxTradeSize);
          setErr(false);
        }}
      >
        Max
      </button>
      {err && (
        <Trans>
          <span className="absolute top-full left-[-20px] text-red whitespace-nowrap">
            You don't have enough {tokenName}.&nbsp;
            <BuyUSDCLink token={tokenName} />{' '}
          </span>
        </Trans>
      )}
    </div>
  );
};
