import { toFixed } from '@Utils/NumString';
import { BlueBtn } from '../V2-Button';
import { gt } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useState } from 'react';
import BufferInput from '../BufferInput';
import { Display } from '../Tooltips/Display';
import { ConnectionRequired } from '../Navbar/AccountDropdown';

export const UnstakeModal = ({
  head,
  unit,
  max,
  unstakeFunction,
}: {
  head: string;
  unit: string;
  max: string;
  unstakeFunction: () => void;
}) => {
  const [userInput, setUserInput] = useState('');
  const { state } = useGlobal();
  return (
    <>
      {' '}
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Unstake</span>
            <span className="flex flex-row items-center">
              Max:
              <Display data={max} unit={unit} />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          max: {
            val: max.toString(),
            error: `Not enough funds!`,
          },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder="0.0"
        bgClass="!bg-1"
        ipClass="mt-1"
        value={userInput}
        onChange={(val) => {
          setUserInput(val);
        }}
        unit={
          <span className="text-f16 flex justify-between w-fit">
            <BlueBtn
              isDisabled={!gt(max, '0')}
              onClick={() => {
                setUserInput(toFixed(max, 6));
              }}
              className="!py-1 !px-3 !h-fit text-f13 rounded-sm mr-3"
            >
              Max
            </BlueBtn>
            {unit}
          </span>
        }
      />
      <ConnectionRequired>
        <BlueBtn
          className={'px-4 rounded-sm !h-7 w-full mt-5'}
          onClick={unstakeFunction}
          isDisabled={state.txnLoading > 1}
          isLoading={state.txnLoading === 1}
        >
          Unstake
        </BlueBtn>
      </ConnectionRequired>
    </>
  );
};
