import { toFixed } from '@Utils/NumString';
import { add, gt, lt, subtract } from '@Utils/NumString/stringArithmatics';
import { LightToolTipSVG } from '@Views/TradePage/Components/LightToolTipSVG';
import { tradeSettingsAtom, tradeSizeAtom } from '@Views/TradePage/atoms';
import { getMaximumValue, getMinimumValue } from '@Views/TradePage/utils';
import { Trans } from '@lingui/macro';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { BuyUSDCLink } from '../BuyUsdcLink';
import { escapeRegExp, inputRegex } from '../CurrentPrice';

const className = 'text-[#FFE200]';
export const TradeSizeInput: React.FC<{
  maxTradeSize: string;
  tokenName: string;
  balance: string;
  registeredOneCT: boolean;
  minTradeSize: string;
  onSubmit?: () => void;
  platformFee: string;
}> = ({
  maxTradeSize,
  registeredOneCT,
  tokenName,
  balance,
  onSubmit,
  minTradeSize,
  platformFee,
}) => {
  const [minerr, setminErr] = useState(false);
  const [maxerr, setmaxErr] = useState(false);
  const [tradeSize, setTradeSize] = useAtom(tradeSizeAtom);
  // console.log(`TradeSizeInput-tradeSize: `, tradeSize);
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
    <div className="flex flex-col gap-2 w-full">
      <div className="relative flex flex-row gap-x-4 items-center">
        <input
          value={tradeSize}
          max={maxTradeSize}
          min={minTradeSize}
          pattern="^[0-9]*[.,]?[0-9]*$"
          type="text"
          className={`relative h-[40px] bg-[#282b39] px-5 py-3 rounded-l-[5px] outline-none w-full text-f16 text-1 sm:h-[35px]`}
          onChange={(e) => {
            if (inputRegex.test(escapeRegExp(e.target.value))) {
              let newValue = e.target.value;
              // Check if newValue has more than 3 decimal places
              const decimalPart = newValue.split('.')[1];
              if (decimalPart && decimalPart.length > 3) {
                // If yes, limit it to 3 decimal places
                newValue = parseFloat(newValue).toFixed(3);
              }
              setTradeSize(newValue);
            }
          }}
          onKeyDown={(e) => e.key == 'Enter' && onSubmit?.()}
          placeholder="Enter value"
        />
        <button
          className="absolute right-3 bg-[#141823] rounded-[6px] py-2 px-[6px] text-f12"
          onClick={() => {
            setTradeSize(
              getMaximumValue(
                toFixed(
                  subtract(getMinimumValue(maxTradeSize, balance), platformFee),
                  2
                ),
                '0'
              )
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
        isAvailable(tradeSize) &&
        isAvailable(balance) &&
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

const isAvailable = (num: string | null | undefined | number) => {
  console.log(`TradeSizeInput-num: `, num);
  if (num == '') return false;
  if (typeof num == 'undefined') return false;
  if (num == undefined || num == null) {
    return false;
  }
  return true;
};
