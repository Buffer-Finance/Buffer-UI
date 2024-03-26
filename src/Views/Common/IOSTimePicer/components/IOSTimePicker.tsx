import React, { useEffect, useMemo, useState } from 'react';
import HourFormat from './HourFormat';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';
import { useToast } from '@Contexts/Toast';
import { BlueBtn } from '@Views/Common/V2-Button';
import { LightToolTipSVG } from '@Views/ABTradePage/Components/LightToolTipSVG';
import { Trans } from '@lingui/macro';
import { HHMMToSeconds, secondsToHHMM } from '@Views/ABTradePage/utils';

const getValidationError = (value, minValue, maxValue) => {
  const seconds = HHMMToSeconds(value);
  const minSeconds = HHMMToSeconds(minValue);
  const maxSeconds = HHMMToSeconds(maxValue);

  if (seconds >= minSeconds) {
    if (seconds <= maxSeconds) {
      return false;
    } else {
      const maxTime = maxValue.split(':');
      return `Max time should be ${maxTime[0]}h ${maxTime[1]}m`;
    }
  } else {
    const minTime = minValue.split(':');
    return `Min time should be ${minTime[0]}h ${minTime[1]}m`;
  }
};

function TimePickerSelection({
  pickerDefaultValue,
  initialValue,
  onChange,
  height,
  onSave,
  onCancel,
  minValue,
  maxValue,
  cancelButtonText,
  saveButtonText,
  controllers,
  setInputValue,
  setIsOpen,
  seperator,
  use12Hours,
  onAmPmChange,
}) {
  const initialTimeValue = use12Hours ? initialValue.slice(0, 5) : initialValue;
  const toastify = useToast();
  const [value, setValue] = useState(
    initialValue === null ? pickerDefaultValue : initialTimeValue
  );
  const [hourFormat, setHourFormat] = useState({
    mount: false,
    hourFormat: initialValue.slice(6, 8),
  });

  useEffect(() => {
    if (controllers === false) {
      const finalSelectedValue = use12Hours
        ? `${value} ${hourFormat.hourFormat}`
        : value;
      setInputValue(finalSelectedValue);
      onChange(finalSelectedValue);
    }
  }, [value]);

  useEffect(() => {
    if (hourFormat.mount) {
      onAmPmChange(hourFormat.hourFormat);
    }
  }, [hourFormat]);
  const params = {
    height,
    value,
    setValue,
    controllers,
    use12Hours,
    onAmPmChange,
    setHourFormat,
    hourFormat,
  };

  const validationError = useMemo(() => {
    const finalSelectedValue = use12Hours
      ? `${value} ${hourFormat.hourFormat}`
      : value;
    return getValidationError(value, minValue, maxValue);
  }, [value, hourFormat.hourFormat, minValue, maxValue]);

  const handleSave = () => {
    const finalSelectedValue = use12Hours
      ? `${value} ${hourFormat.hourFormat}`
      : value;
    if (validationError)
      return toastify({ type: 'error', msg: validationError });
    setInputValue(finalSelectedValue);
    onChange(finalSelectedValue);
    onSave(finalSelectedValue);
  };

  return (
    <div className="mt-5 react-ios-time-picker  react-ios-time-picker-transition">
      <div className="text-f12 text-center text-[#7f87a7]">
        Select Trade Duration
      </div>
      <div
        className="react-ios-time-picker-container"
        style={{ height: `${height * 5 + 40}px` }}
      >
        <div
          className="react-ios-time-picker-selected-overlay"
          style={{
            top: `${height * 2 + 20}px`,
            height: `${height}px`,
          }}
        />
        <HourWheel {...params} />
        {seperator && <div className="react-ios-time-picker-colon">:</div>}
        <MinuteWheel {...params} />
        {use12Hours && <HourFormat {...params} />}
      </div>
      {validationError ? (
        <Trans>
          <span
            className={`text-red w-full text-f12 mb-4 justify-center  mt-[-15px]  whitespace-nowrap flex gap-x-2 items-center`}
          >
            <span>
              <LightToolTipSVG />
            </span>
            {validationError}
          </span>
        </Trans>
      ) : null}
      <BlueBtn onClick={handleSave}>Continue</BlueBtn>
    </div>
  );
}

export default TimePickerSelection;
