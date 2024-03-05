import BufferCheckbox from '@Views/Common/BufferCheckbox';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { txnSuccessAtom } from './atoms';

export const DataStates: React.FC<{
  onSelectCheckBox: (newState: string) => void;
  onDeSelectCheckBox: () => void;
  dataName: string;
  defaultState: string;
}> = ({ onDeSelectCheckBox, onSelectCheckBox, dataName, defaultState }) => {
  const [edit, setEdit] = useState(false);
  const [threshold, setThreshold] = useState(defaultState);
  const [add, setAdd] = useState(false);
  const txnStatus = useAtomValue(txnSuccessAtom);

  useEffect(() => {
    if (txnStatus) {
      handleReset();
    }
  }, [txnStatus]);

  function handleReset() {
    setThreshold(defaultState);
    setEdit(false);
    setAdd(false);
  }

  function removeThreshold() {
    onDeSelectCheckBox();
  }
  function addThreshold() {
    onSelectCheckBox(threshold);
  }

  function handleCheckBox() {
    setAdd(!add);
  }

  useEffect(() => {
    if (add) {
      addThreshold();
    } else {
      removeThreshold();
    }
  }, [add]);

  return (
    <div className="flex gap-3 items-center">
      <div>{dataName}</div>
      {edit ? (
        <div className="flex gap-3 items-center">
          <input
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="bg-2 rounded-[5px] p-2 w-[300px]"
          />
          <BlueBtn
            className="!w-fit h-fit px-3 !text-f14"
            onClick={handleReset}
          >
            Reset
          </BlueBtn>
          <BufferCheckbox checked={add} onCheckChange={handleCheckBox} />
        </div>
      ) : (
        <div className="flex gap-3 items-center">
          <div>{defaultState}</div>
          <BlueBtn
            onClick={() => setEdit(true)}
            className="!w-fit h-fit px-3 !text-f14"
          >
            Edit
          </BlueBtn>
        </div>
      )}
    </div>
  );
};
