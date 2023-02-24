import { divide, gt } from '@Utils/NumString/stringArithmatics';
import BufferInput from '@Views/Common/BufferInput';
import { BufferInputUnit } from '@Views/Common/BufferTextInputRoot';
import { Display } from '@Views/Common/Tooltips/Display';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { mobileUpperBound } from '.';
import { ammountAtom } from './PGDrawer';
const labelClasses = "text-2 mr-2 text-f14 font-semibold";
const ipClasses = "w-full text-1 text-f16 font-bold text-right mr-2 bg-transparent";
const ipWrapperClasses = "flex items-center !bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]";
import ShutterDrawer from 'react-bottom-drawer';
import AccountInfo from '@Views/Common/AccountInfo';
import { useActivePoolObj } from './PGDrawer/PoolDropDown';
const shutterModalAtom = atom<{ open: false | string }>({ open: false });


const AmountInput = ({onClick,value,max,onChange,...props}:React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>)=>{
  console.log(`props: `,props);
let ref = useRef<HTMLInputElement>(null);
  useEffect(()=>{
    if(props.autoFocus)
    ref.current?.focus();
  })
 return <div className={ipWrapperClasses} onClick={onClick}>
  <label className={labelClasses} htmlFor="amount">
    Amount
  </label>
  <input
  ref={ref}
    className={ipClasses}
    value={value}
    id="amount" 
    type="number"
    max={max}
    onChange={onChange}
    {...props}
  ></input>
  <div className="min-h-full grid place-items-center p-2 bg-cross-bg  rounded-tr-sm rounded-br-sm">
    <img
      src="/public/USDC.png"
      className="min-w-[29px] min-h-[29px]"
    ></img>
  </div>
</div>
}
const AmountSelector: React.FC<any> = ({
  activeAssetState,
  amount,
  setAmount,
}) => {
  const setShutter = useSetAtom(shutterModalAtom);
  const shutter = useAtomValue(shutterModalAtom);
  const { activePoolObj } = useActivePoolObj();
const balance = activeAssetState?.[0];
  const isShutterOpen = shutter.open == 'amount';
  return (
    <>
      <ShutterDrawer
        className='bg-1 '
        isVisible={isShutterOpen}
        onClose={() => setShutter({ open: false })}
        mountOnEnter
        unmountOnExit
      >
        <div className='flex justify-between items-center'>
          <div className='flex text-3 text-f13'>Max :&nbsp;<Display data={activeAssetState?.[2]} unit={activePoolObj.token.name}/> </div>
           {balance &&    <AccountInfo
            shouldDisplayString
            unit={activePoolObj.token.name}
            balance={divide(balance, activePoolObj.token.decimals)}
          />}
        </div>
     <AmountInput 
       key="inner-input"
     autoFocus
     value={amount} max={activeAssetState?.[2]} onChange={e=>{
      console.log(`e: `,e);
      setAmount(e.target.value)
     }}/>
      </ShutterDrawer>
     <AmountInput 
      value={amount} max={activeAssetState?.[2]} onChange={e=>{
        setAmount(e.target.value)
       }}
       key="outer-input"
       onClick={
        e=>{
          setShutter({open:'amount'})
        }
       }
     />
    </>
  );
};
const DurationSelector: React.FC<any> = ({
  activeAssetState,
  amount,
  setAmount,
}) => {
  const [balance, allowanceWei, maxTrade, _, routerPermission] =
    activeAssetState;

  const setShutter = useSetAtom(shutterModalAtom);
  return (
    <BaseInput
      id="duration"
      // onClick={() => {
      //   setShutter({ open: 'duration' });
      // }}
      label={
        <label
          className="text-2 mr-2 text-f14 font-semibold"
          htmlFor="duration"
        >
          Duration
        </label>
      }
      ipClass="w-fit text-right mr-2"
      bgClass="!bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]   "
      className="w-fit"
      val={amount}
      autoFocus
      setVal={(val: string) => {
        setAmount(val);
      }}
    />
  );
};

export { AmountSelector, DurationSelector };

const BaseInput = ({ val, setVal, id, ...props }: any) => {
  useEffect(() => {
    if (props.autoFocus) {
      console.log(`document.getElementById(id): `, document.getElementById(id));
      document.getElementById(id)?.focus();
    }
  }, []);
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
      autoFocus={props.autoFocus}
      {...props}
    />
  );
};


