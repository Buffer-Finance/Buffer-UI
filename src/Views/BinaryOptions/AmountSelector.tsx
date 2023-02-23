import { gt } from '@Utils/NumString/stringArithmatics';
import BufferInput from '@Views/Common/BufferInput';
import { BufferInputUnit } from '@Views/Common/BufferTextInputRoot';
import { Display } from '@Views/Common/Tooltips/Display';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { mobileUpperBound } from '.';
import { ammountAtom } from './PGDrawer';

const AmountSelector: React.FC<any> = ({activeAssetState,amount,setAmount}) => {
  return (
    <BaseInput
      id="amount"
      label={
        <label className="text-2 mr-2 text-f14 font-semibold" htmlFor="amount">
          Ammount
        </label>
      }
      ipClass="w-fit text-right mr-2"
      bgClass="!bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]   "
      className="w-fit"
      val={amount}
      numericValidations={
        window.innerWidth > mobileUpperBound && activeAssetState?.[1] && {
          max: {
            val: activeAssetState[1] + '',
            error: (
              <div className="flex">
                Maximum Amount is :&nbsp;{' '}
                <Display
                  data={activeAssetState[1].toString()}
                  unit={'USD'}
                />
              </div>
            ),
          },
          min: {
            val: '1',
            error: gt(activeAssetState[1].toString(), '1')
              ? 'Bet amount must be atleast 1 iBFR'
              : "Liquidity isn't available.",
          },
        }      }
      setVal={(val) => {
        setAmount(val);
      }}
      unit={
        <BufferInputUnit className="min-h-full grid place-items-center p-2 bg-cross-bg  rounded-tr-sm rounded-br-sm">
          <img src='/public/USDC.png'></img>
        </BufferInputUnit>
      }
    />
  );
};
const DurationSelector: React.FC<any> = ({activeAssetState,amount,setAmount}) => {
  const [balance, allowanceWei, maxTrade, _, routerPermission] =
    activeAssetState;
  return (
    <BaseInput
      id="duration"
      label={
        <label className="text-2 mr-2 text-f14 font-semibold" htmlFor="duration">
          Duration
        </label>
      }
      ipClass="w-fit text-right mr-2"
      bgClass="!bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]   "
      className="w-fit"
      val={amount}
     
      setVal={(val) => {
        setAmount(val);
      }}
  
    />
  );
};


export { AmountSelector,DurationSelector };

const BaseInput = ({val,setVal,id,...props})=>{
  return (
    <BufferInput
      id={id}
     
      ipClass="w-fit text-right mr-2"
      bgClass="!bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]   "
      className="w-fit"
      value={val}
      onChange={(val) => {
        setVal(val);
      }}
      {...props}
    />
  )
}