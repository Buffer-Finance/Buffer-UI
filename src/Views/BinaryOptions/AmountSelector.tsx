import { divide, gt } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { QuickTradeExpiry } from './PGDrawer';
const labelClasses = 'text-2 mr-2 text-f14 font-semibold';
const ipClasses =
  'outline-none w-full text-1 text-f16 font-bold text-right mr-2 bg-transparent';
const ipWrapperClasses =
  'rounded-l-sm w-full flex items-center bg-[#232334] !pl-[10px] !py-[0px] !pr-[0px]';
import ShutterDrawer from 'react-bottom-drawer';
import AccountInfo from '@Views/Common/AccountInfo';
import { PoolDropDown, useActivePoolObj } from './PGDrawer/PoolDropDown';
import { Fade } from '@mui/material';
import ErrorIcon from '@Assets/Elements/ErrorIcon';
import { DurationPicker } from './PGDrawer/DurationPicker';
import { Background } from './PGDrawer/style';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { SlippageModalChild } from './Components/SlippageModal';
import { SettingsIcon } from './PGDrawer/SettingsIcon';
import { useTradePolOrBlpPool } from './Hooks/useTradePolOrBlpPool';
import { useSwitchPoolForTrade } from '@Views/V3App/Utils/useSwitchPoolForTrade';
import { getImageUrl } from './PGDrawer/PoolDropDown';
import { useV3AppData } from '@Views/V3App/Utils/useV3AppReadCalls';
import { binaryOptionsAtom } from './PGDrawer/CustomOption';

const shutterModalAtom = atom<{
  open: false | 'amount' | 'duration' | 'settings';
}>({
  open: false,
});

const AmountInput = ({
  onClick,
  value,
  max,
  assetPoolComponent = (
    <div className="min-h-full grid place-items-center p-2 bg-cross-bg  rounded-tr-sm rounded-br-sm w-max">
      {' '}
      <PoolDropDown />{' '}
    </div>
  ),
  onChange,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  let ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (props.autoFocus)
      setTimeout(() => {
        ref.current?.focus();
      }, 100);
  }, [props.autoFocus]);
  return (
    <div className={ipWrapperClasses + ' !w-fit'} onClick={onClick}>
      <label
        className={labelClasses}
        htmlFor={props.autoFocus ? 'inner' : 'outer'}
      >
        Amount
      </label>
      <input
        ref={ref}
        className={ipClasses}
        value={value}
        id={props.autoFocus ? 'inner' : 'outer'}
        type="number"
        max={max}
        onChange={onChange}
        {...props}
      ></input>

      {assetPoolComponent}
    </div>
  );
};

const AmountSelector: React.FC<{
  amount: string;
  setAmount: (value: any) => void;
}> = ({ amount, setAmount }) => {
  const [err, setErr] = useState<ReactNode[]>([]);
  const setShutter = useSetAtom(shutterModalAtom);
  const shutter = useAtomValue(shutterModalAtom);
  const readcallData = useV3AppData();
  const isShutterOpen = shutter.open == 'amount';
  const { closeShutter } = useShutterHandlers();
  const { switchPool, poolDetails } = useSwitchPoolForTrade();
  if (!poolDetails || !readcallData || !switchPool) return <></>;

  const tradeToken = poolDetails.token;
  const decimals = poolDetails.decimals;
  const minTradeAmount = divide(switchPool.min_fee, decimals) as string;
  const maxTradeAmount = divide(switchPool.max_fee, decimals) as string;
  const balance = divide(readcallData.balance, decimals) as string;

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
            <Display data={maxTradeAmount} unit={tradeToken} />{' '}
          </div>
          {balance && (
            <AccountInfo
              shouldDisplayString
              unit={tradeToken}
              balance={divide(balance, decimals)}
            />
          )}
        </div>
        <AmountInput
          key="inner-input"
          autoFocus
          value={amount}
          max={maxTradeAmount}
          onKeyDown={(e) => {
            if (e.key != 'Enter') return;
            closeShutter(err);
          }}
          onChange={(e) => {
            let errors = [];
            let val = e?.target?.value;
            setAmount(e.target.value);
            if (!val) return;

            let bal: string = '';
            let maxTradeSize = '';
            if (balance?.[0]) {
              bal = divide(balance[0], decimals)!;
            }
            if (maxTradeAmount) {
              maxTradeSize = maxTradeAmount;
            }
            if (bal && gt(val, bal)) {
              errors.push(`You don't have enough funds.`);
            }
            if (maxTradeSize && gt(val, maxTradeSize)) {
              errors.push(
                `Not enough liquidity to fund this trade. Please eneter a smaller amount!`
              );
            }
            if (gt(minTradeAmount.toString(), val)) {
              errors.push('Minimum Trade Size is ' + minTradeAmount.toString());
            }
            setErr(errors);
          }}
          assetPoolComponent={
            <div className="text-f13 bg-cross-bg  rounded-tr-sm rounded-br-sm min-h-full flex items-center justify-center w-[100px] px-2 py-1 rounded-sm ">
              {' '}
              <img
                src={getImageUrl(tradeToken)}
                className="w-[18px] h-[18px]  mr-2 "
              />
              <div>{tradeToken}</div>
            </div>
          }
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
        max={maxTradeAmount}
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
  const [currentTime, setCurrentTime] = useAtom(binaryOptionsAtom);

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
    <div className={ipWrapperClasses + ' !w-fit'} onClick={onClick}>
      <label className={labelClasses} htmlFor="duration">
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.82357 0.128829C2.84485 0.986429 -0.686465 5.93524 0.113088 10.9348C0.941485 16.1137 5.8279 19.7004 10.9432 18.8842C18.1372 17.7361 21.4157 9.47043 16.9971 3.62155C15.0078 0.988563 11.2156 -0.455355 7.82357 0.128829ZM11.4788 1.70359C17.581 3.29136 19.6087 10.6885 15.1693 15.1669C11.9903 18.3741 7.08257 18.3694 3.83436 15.1565C-0.625782 10.7449 1.42502 3.37652 7.58405 1.68288C8.89021 1.32366 10.0419 1.32985 11.4788 1.70359ZM9.13316 4.7325C8.93701 4.81169 8.86607 5.64581 8.86607 7.86964V10.8992L10.3137 12.3341C11.7854 13.793 12.2455 14.0105 12.7008 13.4626C13.0442 13.0494 12.7997 12.646 11.3391 11.2151L10.1481 10.0484V7.44937C10.1481 5.27635 10.0927 4.82919 9.81006 4.72076C9.62417 4.64948 9.45601 4.59889 9.43614 4.60807C9.41648 4.61725 9.28016 4.67338 9.13316 4.7325Z"
            fill="#6B728E"
          />
        </svg>
      </label>
      <div className="flex items-center justify-end mx-[10px] w-fit">
        <input
          className={ipClasses + ' mr-[0px] !w-[22px]'}
          ref={hrsRef}
          id="duration"
          onFocus={(e) => e.target.blur()}
          type="number"
          onChange={(e) => hrsValidations(e.target.value)}
          placeholder="00"
        />
        <div className="text-f16 text-1 mx-1 text-center">:</div>
        <input
          className={ipClasses + ' !w-[22px]'}
          ref={minRef}
          type="number"
          onFocus={(e) => e.target.blur()}
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
  const [currentTime, setCurrentTime] = useAtom(binaryOptionsAtom);

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
          <DurationPicker
            onSelect={closeShutter}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
          />
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

export const SettingsSelector = () => {
  const setShutter = useSetAtom(shutterModalAtom);
  const shutter = useAtomValue(shutterModalAtom);
  const isShutterOpen = shutter.open == 'settings';
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
          <SlippageModalChild />
          <div className="mb-4"></div>
        </Background>
      </ShutterDrawer>

      <div
        role="button"
        onClick={() => {
          setShutter({ open: 'settings' });
        }}
        className="h-fit w-fit m-auto bg-[#232334] p-[10px] rounded-2"
      >
        <SettingsIcon />
      </div>
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
