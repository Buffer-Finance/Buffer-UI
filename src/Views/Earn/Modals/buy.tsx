import { ExpandMoreRounded } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { CONTRACTS } from '../Config/Address';
import {
  useEarnWriteCalls,
  useGetApprovalAmount,
} from '../Hooks/useEarnWriteCalls';
import USDCABI from '../Config/Abis/Token.json';
import {
  getPosInf,
  gt,
  gte,
  multiply,
} from '@Utils/NumString/stringArithmatics';
import { toFixed } from '@Utils/NumString';
import { useAtom } from 'jotai';
import { readEarnData } from '../earnAtom';
import { Display } from '@Views/Common/Tooltips/Display';
import { useGlobal } from '@Contexts/Global';
import BufferInput from '@Views/Common/BufferInput';
import { useToast } from '@Contexts/Toast';
import { Skeleton } from '@mui/material';
import { EarnContext } from '..';
import BufferCheckbox from '@Views/Common/BufferCheckbox';

export const Buy = () => {
  const [payAmount, setPayAmount] = useState('');
  const { state } = useGlobal();
  const { activeChain } = useContext(EarnContext);
  const [receiveAmount, setReceiveAmount] = useState('');
  const { buyBLP, validations } = useEarnWriteCalls('Router');
  const [pageState] = useAtom(readEarnData);
  const [approveState, setApprovalState] = useState(false);
  const { approve } = useGetApprovalAmount(
    USDCABI,
    CONTRACTS[activeChain.id].USDC,
    CONTRACTS[activeChain.id].BLP
  );
  const toastify = useToast();
  const [checkBoxState, setCheckBoxState] = useState(false);
  const max = pageState.earn?.usdc.wallet_balance;

  if (!pageState.earn)
    return (
      <Skeleton
        variant="rectangular"
        className="w-[350px] sm:w-full !h-8 !transform-none"
      />
    );
  const isApproved = gte(pageState.earn.usdc.allowance, payAmount || '1');
  const clickHandler = () => {
    if (validations(payAmount)) return;
    if (gt(payAmount, max))
      return toastify({
        type: 'error',
        msg: 'Amount exceeds balance.',
        id: '007',
      });
    return buyBLP(payAmount);
  };

  return (
    <div className="w-[350px] sm:w-full flex flex-col gap-4">
      <div className="text-f15 font-medium">Buy BLP</div>
      <BufferInput
        value={payAmount}
        onChange={(newValue) => {
          setPayAmount(newValue);
          setReceiveAmount(
            toFixed(multiply(newValue || '0', pageState.earn.blp.usdcToBlp), 6)
          );
        }}
        numericValidations={{
          decimals: { val: 6 },
          max: {
            val: max,
            error: `Not enough funds`,
          },
          min: { val: '0', error: 'Enter a poistive value' },
        }}
        inputType="number"
        ipClass=""
        hideSearchBar
        className="!text-f17"
        bgClass="!py-4 !px-5 !bg-1"
        placeholder="0.0"
        header={
          <div className="text-f14 font-medium text-3 flex justify-between w-full mb-4">
            <span className="flex">
              Pay: <Display data={payAmount} label="$" />
            </span>
            <span className="flex">
              Balance:
              <Display data={max} unit="USDC" />
            </span>
          </div>
        }
        unit={
          <div className="text-1 text-f16 font-medium flex items-center">
            <BlueBtn
              isDisabled={!gt(max, '0')}
              onClick={() => {
                setPayAmount(toFixed(max, 6));
                setReceiveAmount(
                  toFixed(multiply(max || '0', pageState.earn.blp.usdcToBlp), 6)
                );
              }}
              className="!py-1 !px-3 !h-fit text-f13 rounded-sm mr-3"
            >
              Max
            </BlueBtn>
            <div className="text-f15">USDC</div>
          </div>
        }
      />
      <div className="rounded-full p-2 bg-1 w-fit m-auto">
        <ExpandMoreRounded className="!w-7 !h-7" />
      </div>
      <BufferInput
        value={receiveAmount}
        onChange={(newValue) => {
          setReceiveAmount(newValue);
          setPayAmount(
            toFixed(multiply(newValue || '0', pageState.earn.blp.blpToUsdc), 6)
          );
        }}
        inputType="number"
        hideSearchBar
        className="!text-f17"
        bgClass="!py-4 !px-5 !bg-1"
        placeholder="0.0"
        header={
          <div className="text-f14 font-medium text-3 flex justify-between w-full mb-4">
            <span className="flex">Receive</span>
          </div>
        }
        numericValidations={{
          decimals: { val: 6 },

          min: { val: '0', error: 'Enter a poistive value' },
        }}
        unit={
          <div className="text-1 text-f16 font-medium flex items-center">
            <div className="text-f15">BLP</div>
          </div>
        }
      />
      <div>
        <BufferCheckbox
          className="items-start"
          checked={checkBoxState}
          onCheckChange={() => setCheckBoxState(!checkBoxState)}
        >
          <span className="text-f13 ml-2">
            I have read how the USDC vault works and aware of risk associated
            with being a liquidity provider
          </span>
        </BufferCheckbox>
      </div>
      <div className="flex whitespace-nowrap">
        <BlueBtn
          onClick={() => approve(toFixed(getPosInf(), 0), setApprovalState)}
          className="mr-4 rounded"
          isDisabled={isApproved || state.txnLoading > 1 || !checkBoxState}
          isLoading={state.txnLoading === 1 && approveState}
        >
          Approve
        </BlueBtn>
        <BlueBtn
          onClick={clickHandler}
          className="rounded"
          isDisabled={state.txnLoading > 1 || !checkBoxState || !isApproved}
          isLoading={state.txnLoading === 1 && !approveState}
        >
          Add Funds
        </BlueBtn>
      </div>
    </div>
  );
};
