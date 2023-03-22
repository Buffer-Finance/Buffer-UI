import { ExpandMoreRounded } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { toFixed } from '@Utils/NumString';
import { gt, multiply } from '@Utils/NumString/stringArithmatics';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { readEarnData } from '../earnAtom';

export const Sell = ({
  max,
  sellCall,
  validatinosFn,

  tokenToBlpPrice,
  blpToTokenPrice,
  blpTokenName,
  tokenXName,
  blpPrice,
}: {
  max: string;
  sellCall: (amount: string) => void;
  validatinosFn: (amount: any) => true | undefined;
  tokenToBlpPrice: string;
  blpToTokenPrice: string;
  blpTokenName: string;
  tokenXName: string;
  blpPrice: string;
}) => {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const { state } = useGlobal();
  const [pageState] = useAtom(readEarnData);
  const toastify = useToast();

  if (!pageState.earn)
    return (
      <Skeleton
        variant="rectangular"
        className="w-[350px] sm:w-full !h-8 !transform-none"
      />
    );

  const clickHandler = () => {
    if (validatinosFn(payAmount)) return;
    if (gt(payAmount, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });
    sellCall(payAmount);
  };
  return (
    <div className="w-[350px] sm:w-full flex flex-col gap-4">
      <div className="text-f15 font-medium">Sell {blpTokenName}</div>
      <BufferInput
        value={payAmount}
        onChange={(newValue) => {
          setPayAmount(newValue);
          setReceiveAmount(
            toFixed(multiply(newValue || '0', blpToTokenPrice), 6)
          );
        }}
        inputType="number"
        hideSearchBar
        className="!text-f17"
        bgClass="!py-4 !px-5 !bg-1"
        placeholder="0.0"
        header={
          <div className="text-f14 font-medium text-3 flex justify-between w-full mb-4">
            <span className="flex">
              Pay:{' '}
              <Display data={multiply(payAmount || '0', blpPrice)} label="$" />
            </span>
            <span className="flex">
              Max Amount: <Display data={max} unit={blpTokenName} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          max: {
            val: max,
            error: `Not enough funds`,
          },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        unit={
          <div className="text-1 text-f16 font-medium flex items-center">
            <BlueBtn
              isDisabled={!gt(max, '0')}
              onClick={() => {
                setPayAmount(toFixed(max, 6));
                setReceiveAmount(
                  toFixed(multiply(max || '0', blpToTokenPrice), 6)
                );
              }}
              className="!py-1 !px-3 !h-fit text-f13 rounded-sm mr-3"
            >
              Max
            </BlueBtn>
            <div className="text-f15">BLP</div>
          </div>
        }
      />
      <div className="rounded-full p-2 bg-1 w-fit m-auto">
        <ExpandMoreRounded className="!w-7 !h-7" />
      </div>
      <BufferInput
        value={receiveAmount}
        onChange={(newValue) => {
          setReceiveAmount(newValue);
          setPayAmount(toFixed(multiply(newValue || '0', tokenToBlpPrice), 6));
        }}
        inputType="number"
        hideSearchBar
        className="!text-f17"
        bgClass="!py-4 !px-5 !bg-1"
        placeholder="0.0"
        header={
          <div className="text-f14 font-medium text-3 flex justify-between w-full mb-4">
            <span className="flex">
              Receive
              {/* : <Display data={receiveAmount} label="$" /> */}
            </span>
            {/* <span className="flex">
              Balance:
              <Display data={pageState.earn.usdc.wallet_balance} unit="USDC" />
            </span> */}
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          // max: {
          //   val: pageState.earn.usdc.wallet_balance,
          //   error: `Not enough funds`,
          // },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        unit={
          <div className="text-1 text-f15 font-medium flex items-center">
            <div>{tokenXName}</div>
          </div>
        }
      />
      {/* <div className="flex justify-between text-2">
        <div className="text-f14">Fees</div>
        <div className="text-f14">234</div>
      </div> */}

      <BlueBtn
        onClick={clickHandler}
        className="rounded"
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1}
      >
        Withdraw Funds
      </BlueBtn>
    </div>
  );
};
