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
    <div className={ipWrapperClasses} onClick={onClick}>
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

const AmountSelector: React.FC<any> = ({
  activeAssetState,
  amount,
  setAmount,
}) => {
  const [err, setErr] = useState<ReactNode[]>([]);
  const setShutter = useSetAtom(shutterModalAtom);
  const shutter = useAtomValue(shutterModalAtom);
  const { activePoolObj } = useActivePoolObj();
  const { configContracts } = useActiveChain();
  const balance = activeAssetState?.[0];
  const minTradeAmount = activePoolObj.token.min_amount;
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
                src={
                  activePoolObj &&
                  configContracts.tokens[activePoolObj.token.name].img
                }
                className="w-[18px] h-[18px]  mr-2 "
              />
              <div>{activePoolObj.token.name}</div>
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
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.82357 0.128829C2.84485 0.986429 -0.686465 5.93524 0.113088 10.9348C0.941485 16.1137 5.8279 19.7004 10.9432 18.8842C18.1372 17.7361 21.4157 9.47043 16.9971 3.62155C15.0078 0.988563 11.2156 -0.455355 7.82357 0.128829ZM11.4788 1.70359C17.581 3.29136 19.6087 10.6885 15.1693 15.1669C11.9903 18.3741 7.08257 18.3694 3.83436 15.1565C-0.625782 10.7449 1.42502 3.37652 7.58405 1.68288C8.89021 1.32366 10.0419 1.32985 11.4788 1.70359ZM9.13316 4.7325C8.93701 4.81169 8.86607 5.64581 8.86607 7.86964V10.8992L10.3137 12.3341C11.7854 13.793 12.2455 14.0105 12.7008 13.4626C13.0442 13.0494 12.7997 12.646 11.3391 11.2151L10.1481 10.0484V7.44937C10.1481 5.27635 10.0927 4.82919 9.81006 4.72076C9.62417 4.64948 9.45601 4.59889 9.43614 4.60807C9.41648 4.61725 9.28016 4.67338 9.13316 4.7325Z"
            fill="#6B728E"
          />
        </svg>
      </label>
      <div className="flex-center">
        <input
          className={ipClasses + ' mr-[0px]'}
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
          <DurationPicker onSelect={closeShutter} />
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
        className="h-fit w-fit m-auto"
      >
        <svg
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.3238 1.06706C10.2377 1.10148 10.1012 1.19139 10.0204 1.26688C9.73321 1.53541 9.69765 1.68751 9.69765 2.64758V3.55242L9.16242 3.71957C8.86804 3.81148 8.41289 3.98446 8.151 4.10396L7.67487 4.32127L6.94337 3.60414C6.15871 2.83498 6.00783 2.75442 5.51861 2.84376C5.32209 2.87968 5.12406 3.04671 4.30284 3.8696C3.50691 4.6671 3.30932 4.90014 3.25542 5.10529C3.13509 5.56322 3.24471 5.77764 3.97747 6.51834L4.63316 7.18104L4.38579 7.61553C4.24975 7.85447 4.04402 8.29616 3.92857 8.59705L3.71865 9.14401L2.76188 9.14564C1.66763 9.14746 1.48307 9.19649 1.20697 9.55868L1.02653 9.79536L1.00738 11.1371C0.989408 12.3988 0.996169 12.4952 1.12138 12.7543C1.35165 13.2305 1.55863 13.3113 2.64387 13.3479L3.57259 13.3792L3.74463 13.9155C3.83923 14.2105 4.01053 14.6559 4.12529 14.9051L4.33389 15.3584L3.60946 16.093C2.49367 17.2243 2.50476 17.3732 3.80336 18.6963C4.69257 19.6022 4.97424 19.8056 5.33987 19.8056C5.71307 19.8056 5.8905 19.6931 6.54619 19.0409L7.18253 18.408L7.75081 18.7019C8.06341 18.8636 8.49547 19.0622 8.71102 19.1432L9.10288 19.2906L9.13419 20.3274C9.16881 21.4738 9.1973 21.561 9.63442 21.8589C9.8337 21.9948 9.89299 22 11.2315 22C12.5701 22 12.6294 21.9948 12.8286 21.8589C13.2634 21.5626 13.2954 21.4671 13.3175 20.4029L13.3375 19.4415L13.881 19.2726C14.18 19.1797 14.6349 19.0067 14.8919 18.8882L15.3594 18.6727L16.0189 19.3607C16.3816 19.7391 16.7577 20.0786 16.8546 20.1152C17.1025 20.2089 17.4993 20.198 17.6989 20.092C17.9531 19.9571 19.6363 18.2331 19.7118 18.0304C19.7957 17.8048 19.7957 17.4794 19.7118 17.2583C19.6756 17.1631 19.3637 16.7979 19.0186 16.4467L18.3913 15.8082L18.6699 15.2834C18.8232 14.9947 19.0262 14.5558 19.1209 14.308L19.2932 13.8575L20.3336 13.8378C21.306 13.8194 21.3873 13.8086 21.5783 13.6721C21.9756 13.3883 22 13.2789 22 11.7805C22 10.5452 21.9895 10.4147 21.8748 10.2196C21.6198 9.78602 21.5058 9.74634 20.4158 9.71148L19.4349 9.68013L19.2399 9.08451C19.1327 8.75692 18.9595 8.30174 18.855 8.07303L18.665 7.65716L19.3195 7.00719C19.6795 6.64969 20.0143 6.28103 20.0636 6.18793C20.1128 6.09476 20.1531 5.88034 20.1531 5.71144C20.1531 5.31588 20.0318 5.15068 18.9868 4.12202C18.3202 3.46583 18.1327 3.31586 17.9017 3.25392C17.4298 3.12746 17.213 3.23568 16.4592 3.97418L15.8019 4.61826L15.3949 4.39149C15.1711 4.26678 14.7344 4.06264 14.4245 3.93794L13.861 3.7111L13.8297 2.65166C13.7948 1.46857 13.7651 1.37954 13.3204 1.12631C13.1096 1.00625 12.9959 0.996969 11.7865 1.00061C11.0681 1.0028 10.4098 1.03271 10.3238 1.06706ZM12.4131 7.42249C12.6497 7.47265 13.0833 7.63008 13.3766 7.77227C14.4095 8.27297 15.2908 9.37624 15.5578 10.503C15.692 11.0692 15.6907 12.0101 15.555 12.5328C15.1662 14.0304 13.9615 15.2281 12.496 15.5742C11.9885 15.694 10.9524 15.6934 10.4777 15.573C8.70426 15.1231 7.43797 13.5681 7.33823 11.7178C7.18966 8.96068 9.6897 6.84468 12.4131 7.42249Z"
            stroke="#808191"
            stroke-width="2"
          />
        </svg>
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
