import styled from '@emotion/styled';
import { Add, Remove } from '@mui/icons-material';
import React, { ReactNode, useEffect, useRef } from 'react';
import ErrorIcon from 'src/SVG/Elements/ErrorIcon';
import BN from 'bn.js';
import Big from 'big.js';
import { useToast } from '@Contexts/Toast';
import { add, gt, lt, multiply } from '@Utils/NumString/stringArithmatics';
import { PoolDropDown } from './PoolDropDown';
import { toFixed } from '@Utils/NumString';
import { MaxButton } from './DynamicCustomOption';

const TimeSelectorStyles = styled.div`
  display: flex;
  border-radius: 0.7rem;
  /* overflow: hidden; */
  .token-dd {
    border-top-right-radius: 0.7rem;
    border-bottom-right-radius: 0.7rem;
  }
  .timeRef {
    width: 100%;
  }
  .dd-items {
    border-radius: 4px !important;
    padding: 7px 10px;
    padding-bottom: 9px;
    font-size: 15px;
  }

  .timetip {
    /* width: fit-content; */
    background: transparent;
    /* color: var(--text-1); */
    outline: none;
    border: none;
    /* font-size: 18px; */
    /* font-weight: 600; */
    /* width: 20rem; */
    /* color: white; */
    &.number {
      text-align: center;
      width: 100%;
    }
  }

  button {
    :hover {
      cursor: pointer;
    }
  }

  .date-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-bg {
    background-color: var(--bg-14);
    border-radius: 50%;
    /* width: 25px;
    height: 25px; */
    /* display: flex;
    justify-content: center;
    align-items: center; */
    color: var(--text-1);
    /* position: relative; */
  }

  .dd {
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: var(--bg-23);
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.4rem;
    position: absolute;
    top: 4rem;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    /* bottom: 0; */
    z-index: 100;
  }
  .dd-item {
    background-color: var(--time-selector-bg);
    text-align: center;
    font-weight: 400;
    font-size: 1.2rem;
    border-radius: 0.4rem;
    padding: 1.1rem 0.7rem;
  }
`;

export function timeToMins(time: string) {
  if (!time) return;
  if (typeof time !== 'string') return;
  var b = time.split(':');

  return +b[0] * 60 + +b[1];
}

// Convert minutes to a time in format hh:mm
// Returned value is in range 00  to 24 hrs
export function timeFromMins(mins) {
  function z(n) {
    return (n < 10 ? '0' : '') + n;
  }
  var h = ((mins / 60) | 0) % 24;
  var m = mins % 60;
  return z(h) + ':' + z(m);
}

export function getUserError(maxTimeInHHMM: string) {
  let hours = maxTimeInHHMM.toString().split(':')[0];
  let minutes = maxTimeInHHMM.toString().split(':')[1];
  if (hours.charAt(0) == '0') hours = hours.charAt(1);
  if (minutes.charAt(0) == '0') minutes = minutes.charAt(1);
  if (minutes == '0') return `${hours} hour${gt(hours, '1') ? 's' : ''}`;
  else if (hours == '0')
    return `${minutes} minute${gt(minutes, '1') ? 's' : ''}`;
  else
    return `${hours} hour${gt(hours, '1') ? 's' : ''} ${minutes} minute${
      gt(minutes, '1') ? 's' : ''
    }`;
}

// Add two times in hh:mm format
function addTimes(t0, t1) {
  return timeFromMins(timeToMins(t0) + timeToMins(t1));
}

function subtractTImes(t0, t1) {
  return timeFromMins(timeToMins(t0) - timeToMins(t1));
}
const getDisplayTime = (timestamp) => {
  const currentDate = new Date();
  const hours = Math.round(timestamp / 3600000);
  const minutes = Math.round(timestamp / 60000);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};
const INT_MAX = 1e18;

export const MINIMUM_MINUTES = 5;
export const MINUTES_IN_DAY = 24 * 60;

export const TimeSelector = ({
  isTimeSelector,
  currentTime,
  setTime,
  investmentDD,
  max,
  error,
  onSelect,
  maxTime = '23:59',
  minTime = '00:05',
}: {
  isTimeSelector?: boolean;
  currentTime: string | number;
  label?: string;
  investmentDD?: boolean;
  maxTime?: string;
  minTime?: string;
  setTime: (any) => void;
  max?: number;
  onSelect?: () => void;
  title?: string;
  error: {
    min: number;
    minMsg?: ReactNode;
    max: number;
    maxMsg?: ReactNode;
  };
}) => {
  const maxMins = parseInt(maxTime.split(':')[1]);
  const maxHrs = parseInt(maxTime.split(':')[0]);
  const maxTimeInMins = timeToMins(maxTime);
  const minTimeInMins = timeToMins(minTime);
  const currentTimeInMins = timeToMins(currentTime);
  const hrsRef = useRef(null);
  const minRef = useRef(null);
  if (!currentTime) {
    currentTime = '01:00';
  }

  useEffect(() => {
    if (currentTimeInMins === undefined || maxTimeInMins === undefined) return;
    if (currentTimeInMins > maxTimeInMins) {
      hrsRef.current.value = maxHrs;
      minRef.current.value = maxMins;
      setTime(hrsRef.current.value + ':' + minRef.current.value);
    }
  }, [maxTimeInMins]);

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

  const minError = isTimeSelector
    ? timeToMins(currentTime) < minTimeInMins
    : currentTime < error.min;
  const maxError = isTimeSelector
    ? timeToMins(currentTime) > maxTimeInMins
    : currentTime > error.max;

  const btnClick = (isBack?) => {
    if (isTimeSelector) {
      currentTime = hrsRef.current.value + ':' + minRef.current.value;
      if (isBack) {
        setTime(subtractTImes(currentTime, '00:01'));
      } else if (currentTimeInMins < timeToMins('23:59')) {
        setTime(addTimes(currentTime, '00:01'));
      }
    } else {
      setTime((time) => {
        if (isBack && time > 1) {
          return isBack ? +time - 1 : +time + 1;
        }
        if (!isBack && time < INT_MAX) {
          return isBack ? +time - 1 : +time + 1;
        }

        return time;
      });
    }
  };
  const toastify = useToast();

  const hrsValidations = (value) => {
    if (value < 0) hrsRef.current.value = 0;
    if (value > 23) hrsRef.current.value = 23;
    if (value.toString().length > 2)
      hrsRef.current.value = value.toString().slice(0, 2);
    // if (
    //   (hrsRef.current.value === '00' ||
    //     hrsRef.current.value === '0' ||
    //     !hrsRef.current.value) &&
    //   lt(minRef.current.value || '0', '5')
    // )
    //   minRef.current.value = '5';
    // if (
    //   timeToMins(hrsRef.current.value + ":" + minRef.current.value) >
    //   maxTimeInMins
    // ) {
    //   hrsRef.current.value = maxHrs;
    //   minRef.current.value = maxMins;
    //   setTime(hrsRef.current.value + ":" + minRef.current.value);
    // }
    setTime(hrsRef.current.value + ':' + minRef.current.value);
  };

  const minValidations = (value) => {
    if (value < 0) minRef.current.value = 0;
    // if (value > 59) minRef.current.value = 59;
    if (value.toString().length > 2)
      minRef.current.value = value.toString().slice(0, 2);
    // if (value > 59) {
    //   minRef.current.value = 0;
    //   hrsRef.current.value = add('1',hrsRef.current.value);
    // }
    // if (
    //   (hrsRef.current.value === '00' ||
    //     hrsRef.current.value === '0' ||
    //     !hrsRef.current.value) &&
    //   lt(minRef.current.value || '0', '5')
    // )
    //   minRef.current.value = '5';
    // if (
    //   timeToMins(hrsRef.current.value + ":" + minRef.current.value) >
    //   maxTimeInMins
    // ) {
    //   hrsRef.current.value = maxHrs;
    //   minRef.current.value = maxMins;
    //   setTime(hrsRef.current.value + ":" + minRef.current.value);
    // }
    setTime(hrsRef.current.value + ':' + minRef.current.value);
  };
  const timestyles = 'timeRef timetip text-right text-f16 font-bold';
  return (
    <>
      <TimeSelectorStyles className=" transition-colors bg-1  border-">
        <div
          className={`${
            isTimeSelector ? 'w-full' : 'w-max'
          } flex-1 hover:brightness-150 p-[3px] bg-1 `}
        >
          <div className="flex-bw ">
            <button
              className="button-bg"
              onClick={() => btnClick(true)}
              disabled={minError}
            >
              <Remove className="m-2" />
            </button>
            {isTimeSelector ? (
              // <LocalizationProvider dateAdapter={AdapterDateFns}>
              //   <TimePicker
              //     className={`timeip text-4 time`}
              //     value={currentTime}
              //     ampm={false}
              //     disableOpenPicker
              //     onChange={timeChange}
              //     renderInput={(params) => <TextField {...params} />}
              //   />
              // </LocalizationProvider>
              <div className="flex-center">
                <input
                  className="timeRef timetip text-right text-f16 font-bold text-1"
                  ref={hrsRef}
                  onKeyDown={(e) => e.key == 'Enter' && onSelect?.()}
                  type="number"
                  tabIndex={2}
                  onChange={(e) => hrsValidations(e.target.value)}
                  placeholder="00"
                  min={0}
                  max={23}
                />
                <div className="text-f16 text-1 mx-1 text-center">:</div>
                <input
                  className="timeRef timetip text-f16 font-bold text-left text-1"
                  ref={minRef}
                  onKeyDown={(e) => e.key == 'Enter' && onSelect?.()}
                  type="number"
                  tabIndex={onSelect && 3}
                  onChange={(e) => minValidations(e.target.value)}
                  placeholder="00"
                  min={0}
                  max={59}
                />
                {/* <div className="f18 text-1 ">m</div> */}
              </div>
            ) : (
              <input
                value={currentTime}
                className="timetip number text-f16 text-1 "
                type="number"
                // title={title}
                max={max}
                onChange={(e) => {
                  if (e.target.value) {
                    const decimals = 6;
                    const valBN: BN = Big(e.target.value);
                    const regexArr = [
                      /^\d*(\.)?(\d{0,0})?$/,
                      /^\d*(\.)?(\d{0,1})?$/,
                      /^\d*(\.)?(\d{0,2})?$/,
                      /^\d*(\.)?(\d{0,3})?$/,
                      /^\d*(\.)?(\d{0,4})?$/,
                      /^\d*(\.)?(\d{0,5})?$/,
                      /^\d*(\.)?(\d{0,6})?$/,
                    ];
                    if (!regexArr[decimals].test(valBN.toString())) {
                      toastify({
                        type: 'error',
                        msg: !decimals
                          ? "Decimal values aren't allowed"
                          : 'Only ' + decimals + ' decimal digits are allowed!',
                        id: 'decimals',
                      });
                      return;
                    }
                  }
                  if (+e.target.value < INT_MAX) setTime(e.target.value);
                }}
              />
            )}

            <button className="button-bg" onClick={() => btnClick()}>
              <Add className="m-2" />
            </button>
          </div>
        </div>
        {investmentDD && <PoolDropDown />}
      </TimeSelectorStyles>
      {(minError || maxError) && (
        <div className="text-1 text-f12 mt-2 flex items-center">
          <ErrorIcon className="error-icon" />
          {minError
            ? error.minMsg || "Can't decrease from " + `"${error.min}"`
            : error.maxMsg || "Can't increase from " + `"${error.max}"`}
        </div>
      )}
    </>
  );
};
export const AmountSelector = ({
  isTimeSelector,
  currentTime,
  setTime,
  investmentDD,
  max,
  error,
  onSelect,
  balance,
  maxTime = '23:59',
  minTime = '00:05',
}: {
  isTimeSelector?: boolean;
  currentTime: string | number;
  label?: string;
  investmentDD?: boolean;
  maxTime?: string;
  minTime?: string;
  setTime: (any) => void;
  max?: number;
  onSelect?: () => void;
  title?: string;
  balance?: any;
  error: {
    min: number;
    minMsg?: ReactNode;
    max: number;
    maxMsg?: ReactNode;
  };
}) => {
  const maxMins = parseInt(maxTime.split(':')[1]);
  const maxHrs = parseInt(maxTime.split(':')[0]);
  const maxTimeInMins = timeToMins(maxTime);
  const minTimeInMins = timeToMins(minTime);
  const currentTimeInMins = timeToMins(currentTime);
  const hrsRef = useRef(null);
  const minRef = useRef(null);
  if (!currentTime) {
    currentTime = '01:00';
  }

  useEffect(() => {
    if (currentTimeInMins === undefined || maxTimeInMins === undefined) return;
    if (currentTimeInMins > maxTimeInMins) {
      hrsRef.current.value = maxHrs;
      minRef.current.value = maxMins;
      setTime(hrsRef.current.value + ':' + minRef.current.value);
    }
  }, [maxTimeInMins]);

  useEffect(() => {
    if (!hrsRef.current || !minRef.current) return;

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

  const minError = isTimeSelector
    ? timeToMins(currentTime) < minTimeInMins
    : currentTime < error.min;
  const maxError = isTimeSelector
    ? timeToMins(currentTime) > maxTimeInMins
    : currentTime > error.max;

  const toastify = useToast();

  return (
    <>
      <TimeSelectorStyles className=" transition-colors bg-3  border-">
        <div
          className={`${
            isTimeSelector ? 'w-full' : 'w-max'
          } flex-1 hover:brightness-150 p-[3px] bg-1`}
        >
          <div className="flex-bw ">
            <input
              value={currentTime}
              className="timetip number text-f16 text-1 !py-[2px]"
              type="number"
              // title={title}
              max={max}
              onChange={(e) => {
                if (e.target.value) {
                  const decimals = 6;
                  const valBN: BN = Big(e.target.value);
                  const regexArr = [
                    /^\d*(\.)?(\d{0,0})?$/,
                    /^\d*(\.)?(\d{0,1})?$/,
                    /^\d*(\.)?(\d{0,2})?$/,
                    /^\d*(\.)?(\d{0,3})?$/,
                    /^\d*(\.)?(\d{0,4})?$/,
                    /^\d*(\.)?(\d{0,5})?$/,
                    /^\d*(\.)?(\d{0,6})?$/,
                  ];
                  if (!regexArr[decimals].test(valBN.toString())) {
                    toastify({
                      type: 'error',
                      msg: !decimals
                        ? "Decimal values aren't allowed"
                        : 'Only ' + decimals + ' decimal digits are allowed!',
                      id: 'decimals',
                    });
                    return;
                  }
                }
                if (+e.target.value < INT_MAX) setTime(e.target.value);
              }}
            />
            <MaxButton
              onChange={(max) => {
                setTime(max);
              }}
              className="!w-fit !px-[6px] !py-[2px] rounded-[4px] !h-[20px] mr-[5px]"
              balance={balance}
            />
          </div>
        </div>
        {investmentDD && <PoolDropDown />}
      </TimeSelectorStyles>

      {(minError || maxError) && (
        <div className="text-1 text-f12 mt-2 flex items-center">
          <ErrorIcon className="error-icon" />
          {minError
            ? error.minMsg || "Can't decrease from " + `"${error.min}"`
            : error.maxMsg || "Can't increase from " + `"${error.max}"`}
        </div>
      )}
    </>
  );
};
