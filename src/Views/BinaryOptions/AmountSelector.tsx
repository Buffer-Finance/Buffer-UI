import { divide, gt } from '@Utils/NumString/stringArithmatics';
import BufferInput from '@Views/Common/BufferInput';
import { BufferInputUnit } from '@Views/Common/BufferTextInputRoot';
import { Display } from '@Views/Common/Tooltips/Display';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {  QuickTradeExpiry } from './PGDrawer';
const labelClasses = 'text-2 mr-2 text-f14 font-semibold';
const ipClasses =
  'outline-none w-full text-1 text-f16 font-bold text-right mr-2 bg-transparent';
const ipWrapperClasses =
  'rounded-l-sm w-full flex items-center bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]';
import ShutterDrawer from 'react-bottom-drawer';
import AccountInfo from '@Views/Common/AccountInfo';
import { useActivePoolObj } from './PGDrawer/PoolDropDown';
import { Fade } from '@mui/material';
import ErrorIcon from '@Assets/Elements/ErrorIcon';
import { DurationPicker } from './PGDrawer/DurationPicker';
import { Background } from './PGDrawer/style';
import { useToast } from '@Contexts/Toast';
import { USDCIcon } from '@SVG/Elements/usdc';
const shutterModalAtom = atom<{ open: false | 'amount' | 'duration' }>({
  open: false,
});

const AmountInput = ({
  onClick,
  value,
  max,
  onChange,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  let ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if ( props.autoFocus) 
      setTimeout(()=>{
      ref.current?.focus();
    },100)
  }, [props.autoFocus]);
  return (
    <div className={ipWrapperClasses} onClick={onClick}>
      <label className={labelClasses} htmlFor={ props.autoFocus?'inner':'outer'}>
        Amount
      </label>
      <input
        ref={ref}
        className={ipClasses}
        value={value}
        id={props.autoFocus?'inner':'outer'}
        type="number"
        max={max}
        onChange={onChange}
        {...props}
      ></input>
      <div className="min-h-full grid place-items-center p-2 bg-cross-bg  rounded-tr-sm rounded-br-sm">
       <USDCIcon className="w-[29px]" />
      </div>
    </div>
  );
};
const AmountSelector: React.FC<any> = ({
  activeAssetState,
  amount,
  setAmount,
}) => {
  const [err, setErr] = useState<ReactNode[]>([]);
  const setShutter = useSetAtom(shutterModalAtom);
  const shutter = useAtomValue(shutterModalAtom);
  const { activePoolObj } = useActivePoolObj();
  const balance = activeAssetState?.[0];
  const isShutterOpen = shutter.open == 'amount';
  const toastify = useToast();
  const { closeShutter } = useShutterHandlers();
  return (
    <>
      <ShutterDrawer
        className="bg-1 "
        isVisible={isShutterOpen}
        onClose={() => {
          closeShutter(err);
        }}
        mountOnEnter
        unmountOnExit
      >
        <div className="flex justify-between items-center">
          <div className="flex text-3 text-f13">
            Max :&nbsp;
            <Display
              data={activeAssetState?.[2]}
              unit={activePoolObj.token.name}
            />{' '}
          </div>
          {balance && (
            <AccountInfo
              shouldDisplayString
              unit={activePoolObj.token.name}
              balance={divide(balance, activePoolObj.token.decimals)}
            />
          )}
        </div>
        <AmountInput
          key="inner-input"
          autoFocus
          value={amount}
          max={activeAssetState?.[2]}
          onKeyDown={(e) => {
            console.log(`e.key: `, e.key);
            console.log('onSubmit called');
            if (e.key != 'Enter') return;
            closeShutter(err);
          }}
          onChange={(e) => {
            console.log(`e: `, e);
            let errors = [];
            let val = e?.target?.value;
            setAmount(e.target.value);
            if (!val) return;

            let bal: string = '';
            let maxTradeSize = '';
            if (balance?.[0]) {
              bal = divide(balance[0], activePoolObj.token.decimals)!;
            }
            if (activeAssetState?.[2]) {
              maxTradeSize = activeAssetState?.[2];
            }
            console.log(`bal: `, bal, maxTradeSize, val);
            if (bal && gt(val, bal)) {
              errors.push(`You don't have enough funds.`);
            }
            if (maxTradeSize && gt(val, maxTradeSize)) {
              errors.push(`Not enough liquidity to fund this trade. Please eneter a smaller amount!`);
            }
            if(gt('5',val)){
              errors.push('Minimum Trade Size is 5!')
            }
            setErr(errors);
          }}
        />

        <Fade in={err.length ? true : false}>
          <div className="flex items-center">
            <ErrorIcon className="error-icon" />
            <span className="text-6">{err[err.length - 1]} </span>
          </div>
        </Fade>
      </ShutterDrawer>
      <AmountInput
        value={amount}
        max={activeAssetState?.[2]}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        key="outer-input"
        onClick={(e) => {
          setShutter({ open: 'amount' });
        }}
      />
    </>
  );
};
const DurationInput = ({ onClick }: any) => {
  const [currentTime, setCurrentTime] = useAtom(QuickTradeExpiry);
 


  const hrsRef = useRef<string | number | null>(null);
  const minRef = useRef<string | number | null>(null);

  const hrsValidations = (value: any) => {
    if (value < 0) hrsRef.current.value = 0;
    if (value > 23) hrsRef.current.value = 23;
    if (value.toString().length > 2)
      hrsRef.current.value = value.toString().slice(0, 2);
    if (
      (hrsRef.current.value === '00' ||
        hrsRef.current.value === '0' ||
        !hrsRef.current.value) &&
      lt(minRef.current.value || '0', '5')
    )
      minRef.current.value = '5';
    // if (
    //   timeToMins(hrsRef.current.value + ":" + minRef.current.value) >
    //   maxTimeInMins
    // ) {
    //   hrsRef.current.value = maxHrs;
    //   minRef.current.value = maxMins;
    //   setCurrentTime(hrsRef.current.value + ":" + minRef.current.value);
    // }
    setCurrentTime(hrsRef.current.value + ':' + minRef.current.value);
  };

  const minValidations = (value) => {
    if (value < 0) minRef.current.value = 0;
    if (value > 59) minRef.current.value = 59;
    if (value.toString().length > 2)
      minRef.current.value = value.toString().slice(0, 2);
    if (
      (hrsRef.current.value === '00' ||
        hrsRef.current.value === '0' ||
        !hrsRef.current.value) &&
      lt(minRef.current.value || '0', '5')
    )
      minRef.current.value = '5';
    // if (
    //   timeToMins(hrsRef.current.value + ":" + minRef.current.value) >
    //   maxTimeInMins
    // ) {
    //   hrsRef.current.value = maxHrs;
    //   minRef.current.value = maxMins;
    //   setCurrentTime(hrsRef.current.value + ":" + minRef.current.value);
    // }
    setCurrentTime(hrsRef.current.value + ':' + minRef.current.value);
  };

  useEffect(() => {
    if (!hrsRef.current || !minRef.current) return;
    // if (currentTimeInMins > maxTimeInMins) {
    //   hrsRef.current.value = maxHrs;
    //   minRef.current.value = maxMins;
    //   setTime(hrsRef.current.value + ":" + minRef.current.value);
    // }
    hrsRef.current.value = currentTime.toString().split(':')[0];
    minRef.current.value = currentTime.toString().split(':')[1];
    const listener = (e) => {
      if (e.key === 'ArrowRight') minRef.current?.focus();
      if (e.key === 'Enter') minRef.current?.focus();
      if (e.key === 'ArrowLeft') hrsRef.current?.focus();
    };
    document.addEventListener('keydown', listener);
    return removeEventListener('keydown', listener);
  }, [currentTime]);
  return (
    <div className={ipWrapperClasses} onClick={onClick}>
      <label className={labelClasses} htmlFor="duration">
        Duration
      </label>
      <div className="flex-center">
        <input
          className={ipClasses + ' mr-[0px]'}
          ref={hrsRef}
          id="duration"
          onFocus={e=>e.target.blur()}
          type="number"
          onChange={(e) => hrsValidations(e.target.value)}
          placeholder="00"
        />
        <div className="text-f16 text-1 mx-1 text-center">:</div>
        <input
          className={ipClasses + ' !w-[22px]'}
          ref={minRef}
          type="number"
          onFocus={e=>e.target.blur()}

          onChange={(e) => minValidations(e.target.value)}
          placeholder="00"
        />
      </div>
    </div>
  );
};
const DurationSelector = () => {
  const setShutter = useSetAtom(shutterModalAtom);
  const shutter = useAtomValue(shutterModalAtom);
  const isShutterOpen = shutter.open == 'duration';
  const { closeShutter } = useShutterHandlers();
  return (
    <>
      <ShutterDrawer
        className="bg-1 "
        isVisible={isShutterOpen}
        onClose={closeShutter}
        mountOnEnter
        unmountOnExit
      >
        <Background>
          <DurationPicker onSelect={closeShutter}/>
          <div className="mb-4"></div>
        </Background>
      </ShutterDrawer>
      <DurationInput
        onClick={() => {
          setShutter({ open: 'duration' });
        }}
        j
      />
    </>
  );
};

export { AmountSelector, DurationSelector };

export function useShutterHandlers() {
  const setShutter = useSetAtom(shutterModalAtom);

  const toastify = useToast();
  const closeShutter = useCallback(
    (err?: ReactNode[]) => {
      if (!err) return setShutter({ open: false });

      if (err.length) {
       toastify({
          msg: err[err.length - 1],
          type: 'error',
          id: err[err.length - 1],
        });
      }
      setShutter({ open: false });
    },
    [setShutter]
  );
  return { closeShutter };
}
