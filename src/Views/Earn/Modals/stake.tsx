import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { earnAtom } from '../earnAtom';
import {
  useEarnWriteCalls,
  useGetApprovalAmount,
} from '../Hooks/useEarnWriteCalls';
import { toFixed } from '@Utils/NumString';
import { getPosInf, gt, gte } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { Skeleton } from '@mui/material';
import { EarnContext } from '..';
import { IContract } from 'src/Interfaces/interfaces';
import { getContract } from '../Config/Address';

export const StakeModal = ({
  max,
  head,
  isStakeModal = false,
  tokenContract,
  unit,
  allowance,
}: {
  max: string;
  head: string;
  isStakeModal: boolean;
  tokenContract?: IContract;
  unit: string;
  allowance?: string;
}) => {
  if (!max)
    return (
      <Skeleton
        variant="rectangular"
        className="w-[350px] sm:w-full !h-8 !transform-none"
      />
    );
  if (isStakeModal)
    return (
      <Stake
        head={head}
        max={max}
        unit={unit}
        tokenContract={tokenContract}
        allowance={allowance}
      />
    );
  else return <Unstake head={head} max={max} unit={unit} />;
};

const Common = ({ val, setVal, head, max, unit, isStakeModal }) => {
  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>{isStakeModal ? 'Stake' : 'Unstake'}</span>
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
        value={val}
        onChange={(val) => {
          setVal(val);
        }}
        unit={
          <span className="text-f16 flex justify-between w-fit">
            <BlueBtn
              isDisabled={!gt(max, '0')}
              onClick={() => {
                setVal(toFixed(max, 6));
              }}
              className="!py-1 !px-3 !h-fit text-f13 rounded-sm mr-3"
            >
              Max
            </BlueBtn>
            {unit}
          </span>
        }
      />
    </div>
  );
};

const Stake = ({ tokenContract, max, head, unit, allowance }) => {
  const [val, setVal] = useState('');
  const { activeChain } = useContext(EarnContext);
  const { approve } = useGetApprovalAmount(
    tokenContract?.abi,
    tokenContract?.contract,
    getContract(activeChain.id, 'StakedBfrTracker')
  );
  const [pageState] = useAtom(earnAtom);
  const toastify = useToast();
  const [approveState, setApprovalState] = useState(false);
  const { state } = useGlobal();
  const { stakeUnstakeiBFR, validations } = useEarnWriteCalls('Router');
  const isApproved = gte(allowance, val || '1');

  const clickHandler = () => {
    if (validations(val)) return;
    if (gt(val, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });
    if (pageState.activeModal === 'iBFRstake')
      return stakeUnstakeiBFR(val, 'stakeBfr');
    if (pageState.activeModal === 'esBFRstake')
      return stakeUnstakeiBFR(val, 'stakeEsBfr');
  };

  return (
    <>
      <Common
        head={head}
        isStakeModal
        max={max}
        unit={unit}
        val={val}
        setVal={setVal}
      />
      <div className="flex whitespace-nowrap mt-5">
        <BlueBtn
          onClick={() => approve(toFixed(getPosInf(), 0), setApprovalState)}
          className="mr-4 rounded"
          isDisabled={isApproved || state.txnLoading > 1}
          isLoading={state.txnLoading === 1 && approveState}
        >
          Approve
        </BlueBtn>
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1 || !isApproved}
          isLoading={state.txnLoading === 1 && !approveState}
        >
          Stake
        </BlueBtn>
      </div>
    </>
  );
};

const Unstake = ({ max, head, unit }) => {
  const [val, setVal] = useState('');
  const [pageState] = useAtom(earnAtom);
  const toastify = useToast();
  const { stakeUnstakeiBFR, validations } = useEarnWriteCalls('Router');
  const { state } = useGlobal();

  const clickHandler = () => {
    if (validations(val)) return;
    if (gt(val, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds max unstakeable value.',
        id: '007',
      });

    if (pageState.activeModal === 'iBFRunstake')
      return stakeUnstakeiBFR(val, 'unstakeBfr');

    if (pageState.activeModal === 'esBFRunstake')
      return stakeUnstakeiBFR(val, 'unstakeEsBfr');
  };
  return (
    <>
      <Common
        head={head}
        isStakeModal={false}
        max={max}
        unit={unit}
        val={val}
        setVal={setVal}
      />
      <BlueBtn
        className={'px-4 rounded-sm !h-7 w-full mt-5'}
        onClick={clickHandler}
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1}
      >
        Unstake
      </BlueBtn>
    </>
  );
};
