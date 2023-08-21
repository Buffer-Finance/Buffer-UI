import React, { useEffect, useState } from 'react';
import TimePickerSelection from './IOSTimePicker';

function TimePicker({
  initialValue = null,
  cellHeight = 28,
  pickerDefaultValue = '10:00',
  onChange = () => {},
  onFocus = () => {},
  onSave = () => true,
  onCancel = () => {},
  isOpen: initialIsOpenValue = false,
  cancelButtonText = 'Cancel',
  saveButtonText = 'Save',
  controllers = true,
  seperator = true,
  use12Hours = false,
  onAmPmChange = () => {},
  onOpen = () => {},
  minValue = '00:00',
  maxValue = '24:00',
}) {
  const [isOpen, setIsOpen] = useState(initialIsOpenValue);
  const [height, setHeight] = useState(cellHeight);
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    console.log(`initialValue: `, initialValue);
    setInputValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    console.log(`onSave: `, onSave);
  }, [onSave]);

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
    minValue,
    maxValue,
    use12Hours,
    onAmPmChange,
    initialValue: finalValue,
    pickerDefaultValue,
  };

  return <TimePickerSelection {...params} />;
}

export default React.memo(TimePicker);
