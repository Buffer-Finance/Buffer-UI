import { gt } from '@Utils/NumString/stringArithmatics';
import BufferInput from '../BufferInput';
import { Display } from '../Tooltips/Display';
import { BlueBtn } from '../V2-Button';
import { toFixed } from '@Utils/NumString';
import { ConnectionRequired } from '../Navbar/AccountDropdown';
import { useState } from 'react';
import { useGlobal } from '@Contexts/Global';

export function StakeModal({
  head,
  unit,
  max,
  approveFunction,
  isApproveLoading,
  allowance,
  stakeFunction,
}: {
  head: string;
  unit: string;
  max: string;
  approveFunction: () => void;
  stakeFunction: (amount: string) => void;
  isApproveLoading: boolean;
  allowance: string;
}) {
  const [userInput, setUserInput] = useState('');
  const { state } = useGlobal();
  const isApproved = gt(allowance, userInput || '0');
  return (
    <>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Stake</span>
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
      />{' '}
      <ConnectionRequired>
        <div className="flex whitespace-nowrap mt-5">
          <BlueBtn
            onClick={approveFunction}
            className="mr-4 rounded"
            isDisabled={isApproved || state.txnLoading > 1}
            isLoading={state.txnLoading === 1 && isApproveLoading}
          >
            Approve
          </BlueBtn>
          <BlueBtn
            onClick={() => stakeFunction(userInput)}
            className="rounded"
            isDisabled={state.txnLoading > 1 || !isApproved}
            isLoading={state.txnLoading === 1 && !isApproveLoading}
          >
            Stake
          </BlueBtn>
        </div>
      </ConnectionRequired>
    </>
  );
}
