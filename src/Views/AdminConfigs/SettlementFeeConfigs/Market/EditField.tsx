import { ResetSVG } from '@Views/TradePage/Components/ResetSVG';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { SettlementFeesChangedConfigAtom } from '../store';
import { IMarketConstant } from '../types';
import { NumInput } from './NumInput';

export const EditField: React.FC<{
  defaultValue: number;
  keyValue: string;
  market: string;
}> = ({ defaultValue, keyValue, market }) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [shouldEdit, setShouldEdit] = useState<boolean>(false);
  const [editedObj, setEditedObj] = useAtom(SettlementFeesChangedConfigAtom);
  const editedValue = editedObj?.[market]?.[keyValue as keyof IMarketConstant];
  const isValueChanged =
    editedValue !== undefined && defaultValue !== editedValue;

  return (
    <div className="flex items-center">
      {shouldEdit ? (
        <div className="flex items-center gap-3">
          <NumInput value={value} setValue={setValue} />
          <button
            onClick={() => {
              setShouldEdit(false);
              setValue(defaultValue);
            }}
          >
            <ResetSVG />
          </button>
          {value !== defaultValue && (
            <button
              onClick={() => {
                setEditedObj((prev) => {
                  const newEditedObj = { ...prev };
                  newEditedObj[market] = {
                    ...newEditedObj[market],
                    [keyValue]: value,
                  };
                  return newEditedObj;
                });
                setShouldEdit(false);
              }}
            >
              Save
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className={`${isValueChanged ? 'line-through' : ''}`}>
            {defaultValue}
          </div>{' '}
          {isValueChanged && <div>{editedValue}</div>}
          <button onClick={() => setShouldEdit(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};
