import React, { useEffect, useState } from 'react';
import TimePickerSelection from './IOSTimePicker';

function TimePicker({
  value: initialValue = null,
  cellHeight = 28,
  placeHolder = 'Select Time',
  pickerDefaultValue = '10:00',
  onChange = () => {},
  onFocus = () => {},
  onSave = () => true,
  onCancel = () => {},
  disabled = false,
  isOpen: initialIsOpenValue = false,
  required = false,
  cancelButtonText = 'Cancel',
  saveButtonText = 'Save',
  controllers = true,
  seperator = true,
  id = null,
  use12Hours = false,
  onAmPmChange = () => {},
  name = null,
  onOpen = () => {},
  popupClassName = null,
  minDurationInMinutes = 0,

  inputClassName = null,
}) {
  const [isOpen, setIsOpen] = useState(initialIsOpenValue);
  const [height, setHeight] = useState(cellHeight);
  const [inputValue, setInputValue] = useState(initialValue);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleFocus = () => {
    onFocus();
    onOpen();
  };

  let finalValue = inputValue;

  if (initialValue === null && use12Hours) {
    finalValue = `${pickerDefaultValue} AM`;
  } else if (initialValue === null && !use12Hours) {
    finalValue = pickerDefaultValue;
  }

  const params = {
    onChange,
    height,
    onSave,
    onCancel,
    cancelButtonText,
    saveButtonText,
    controllers,
    setInputValue,
    setIsOpen,
    seperator,
    minValue: minDurationInMinutes * 60,
    use12Hours,
    onAmPmChange,
    initialValue: finalValue,
    pickerDefaultValue,
  };

  return <TimePickerSelection {...params} />;
}

export default TimePicker;
