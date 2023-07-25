import { add, gt, gte, lt, subtract } from '@Utils/NumString/stringArithmatics';
import { BuyUSDCLink } from '@Views/BinaryOptions/PGDrawer/BuyUsdcLink';
import { LightToolTipSVG } from '@Views/TradePage/Components/LightToolTipSVG';
import { tradeSettingsAtom, tradeSizeAtom } from '@Views/TradePage/atoms';
import { getMinimumValue } from '@Views/V3App/helperFns';
import { Trans } from '@lingui/macro';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
const className = 'text-[#FFE200]';
export const TradeSizeInput: React.FC<{
  maxTradeSize: string;
  tokenName: string;
  balance: string;
  registeredOneCT: boolean;
  minTradeSize: string;
  platformFee: string;
}> = ({
  maxTradeSize,
  registeredOneCT,
  tokenName,
  balance,
  minTradeSize,
  platformFee,
}) => {
  const [minerr, setminErr] = useState(false);
  const [maxerr, setmaxErr] = useState(false);
  const [tradeSize, setTradeSize] = useAtom(tradeSizeAtom);
  const { address } = useAccount();
  useEffect(() => {
    if (lt(tradeSize || '0', minTradeSize)) {
      setminErr(true);
    } else {
      setminErr(false);
    }
    if (gt(tradeSize || '0', maxTradeSize)) {
      setmaxErr(true);
    } else {
      setmaxErr(false);
    }
  }, [tradeSize]);
  const settings = useAtomValue(tradeSettingsAtom);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex flex-row gap-x-4 items-center">
        <input
          value={tradeSize}
          // max={maxTradeSize}
          // min={minTradeSize}
          type="number"
          className={`relative bg-[#282b39] px-5 py-3 rounded-l-[5px] outline-none w-full text-f16 text-1`}
          onChange={(e) => {
            setTradeSize(e.target.value);
          }}
          placeholder="Enter value"
        />
        <button
          className="absolute right-3 bg-[#141823] rounded-[6px] py-2 px-[6px] text-f12"
          onClick={() => {
            setTradeSize(
              subtract(getMinimumValue(maxTradeSize, balance), platformFee)
            );
            // setmaxErr(false);
            // setminErr(false);
          }}
        >
          Max
        </button>
      </div>

      {registeredOneCT && minerr && (
        <Trans>
          <span className="text-red whitespace-nowrap">
            Min trade size is {minTradeSize} {tokenName}
          </span>
        </Trans>
      )}

      {registeredOneCT && maxerr && (
        <Trans>
          <span
            className={`${
              settings.partialFill ? className : 'text-red'
            } whitespace-nowrap flex gap-x-2 items-center`}
          >
            <span>
              <LightToolTipSVG />
            </span>
            Max trade size is {maxTradeSize} {tokenName}
          </span>
        </Trans>
      )}

      {registeredOneCT &&
        tradeSize &&
        gt(tradeSize ?? '0', balance ?? '0') &&
        gt(add(tradeSize ?? '0', platformFee), balance ?? '0') && (
          <Trans>
            <span className="text-red whitespace-nowrap flex items-end">
              You don't have enough {tokenName}.&nbsp;
              <BuyUSDCLink token={tokenName} />{' '}
            </span>
          </Trans>
        )}
    </div>
  );
};
