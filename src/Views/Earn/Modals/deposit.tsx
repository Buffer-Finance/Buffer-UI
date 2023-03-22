import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import BufferInput from '@Views/Common/BufferInput';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { CONTRACTS } from '../Config/Address';
import { readEarnData } from '../earnAtom';
import iBFRABI from '../Config/Abis/BFR.json';
import {
  useEarnWriteCalls,
  useGetApprovalAmount,
} from '../Hooks/useEarnWriteCalls';
import {
  add,
  getPosInf,
  gt,
  gte,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { Skeleton } from '@mui/material';
import { getNewReserve } from '../Hooks/useTokenomicsMulticall';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
  underLineClass,
} from '../Components/VestCards';
import NumberTooltip from '@Views/Common/Tooltips';
import { EarnContext } from '..';
import { useActiveChain } from '@Hooks/useActiveChain';

export const DepositModal = ({
  head,
  type,
  depositFn,
  validatinosFn,
}: {
  head: string;
  type: 'ibfr' | 'blp' | 'arbblp';
  depositFn: (amount: string, vesterContract: string) => void;
  validatinosFn: (amount: any) => true | undefined;
}) => {
  const [val, setVal] = useState('');
  const [pageState] = useAtom(readEarnData);
  const currentVault = pageState.vest[type];

  const { state } = useGlobal();
  const { activeChain } = useActiveChain();
  const vesterContract = currentVault.vesterContract;
  const tokenContract = currentVault.tokenContract;
  const { approve } = useGetApprovalAmount(
    iBFRABI,
    CONTRACTS[activeChain?.id].ES_BFR,
    tokenContract
  );
  const toastify = useToast();

  if (!pageState.vest)
    return (
      <Skeleton
        variant="rectangular"
        className="w-[350px] sm:w-full !h-8 !transform-none"
      />
    );
  const isApproved = gte(pageState.vest[type].allowance, val || '1');

  const max = pageState.vest[type].maxVestableAmount;
  const reserveAmount = getNewReserve(
    val,
    currentVault.averageStakedAmount,
    currentVault.maxVestableAmountExact,
    currentVault.reserved_for_vesting[0],
    currentVault.vesting_status.vested
  );
  const [approveState, setApprovalState] = useState(false);

  const clickHandler = () => {
    if (validatinosFn(val)) return;

    if (gt(val, pageState.earn.esBfr.user.wallet_balance.token_value))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });
    else if (
      gt(val, max) ||
      gt(
        subtract(reserveAmount, currentVault.reserved_for_vesting[0]),
        pageState.vest[type].staked_tokens.value
      )
    )
      return toastify({
        type: 'error',
        msg: 'Not enough tokens to reserve',
        id: '008',
      });
    depositFn(val, vesterContract);
  };

  return (
    <div>
      <div className="text-f15 mb-5">{head}</div>
      {/* <Divider className="bg-4" /> */}
      <BufferInput
        header={
          <div className="flex flex-row justify-between w-full text-3 text-f14 mt-2">
            <span>Deposit</span>
            <span className="flex flex-row items-center">
              Max:
              <Display data={max} unit="esBFR" />
            </span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },
          max: {
            val: max,
            error: `Not enough tokens to reserve`,
          },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        placeholder="0.0"
        bgClass="!bg-1"
        ipClass="mt-1"
        value={val}
        onChange={(val) => setVal(val)}
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
            esBFR
          </span>
        }
      />

      <div className="flex justify-between text-f14 mt-3">
        <div className="text-3">Wallet</div>
        <div>
          <Display
            data={pageState.earn.esBfr.user.wallet_balance.token_value}
            unit={'esBFR'}
          />
        </div>
      </div>
      <div className="flex justify-between text-f14 mt-2">
        <div className="text-3">Vault Capacity</div>
        <NumberTooltip
          content={
            <TableAligner
              className=""
              keysName={['Deposited', 'Max Capacity']}
              keyStyle={tooltipKeyClasses}
              valueStyle={tooltipValueClasses}
              values={[
                <Display
                  className="!justify-end"
                  data={currentVault.vesting_status.vested}
                  unit="esBFR"
                />,
                <Display
                  className="!justify-end"
                  data={currentVault.maxVestableAmountExact}
                  unit="esBFR"
                />,
              ]}
            ></TableAligner>
          }
        >
          <div className={`flex ${underLineClass}`}>
            <Display
              data={add(currentVault.vesting_status.vested, val || '0')}
              disable
            />
            &nbsp;/&nbsp;
            <Display data={currentVault.maxVestableAmountExact} disable />
          </div>
        </NumberTooltip>
      </div>
      <div className="flex justify-between text-f14 mt-2">
        <div className="text-3">Reserve Amount</div>
        <NumberTooltip
          className="flex"
          content={
            <TableAligner
              keysName={['Current Reserved', 'Additional Reserve Required']}
              keyStyle={tooltipKeyClasses}
              valueStyle={tooltipValueClasses}
              values={[
                <Display
                  className="!justify-end"
                  data={currentVault.reserved_for_vesting[0]}
                />,
                <Display
                  className="!justify-end"
                  data={subtract(
                    reserveAmount,
                    currentVault.reserved_for_vesting[0]
                  )}
                />,
              ]}
            ></TableAligner>
          }
        >
          <div className={`flex ${underLineClass}`}>
            <Display data={reserveAmount} disable />
            &nbsp;/&nbsp;
            <Display data={currentVault.staked_tokens.value} disable />
          </div>
        </NumberTooltip>
      </div>

      <div className="flex whitespace-nowrap mt-4">
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
          Deposit
        </BlueBtn>
      </div>
    </div>
  );
};
