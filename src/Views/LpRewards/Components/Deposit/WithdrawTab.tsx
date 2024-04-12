import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { toFixed } from '@Utils/NumString';
import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import RewardRouterABI from '@Views/LpRewards/abis/RewardRouter.json';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { InputField } from './InputField';

export const WithdrawTab: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  readcallData: { [callId: string]: string[] };
}> = ({ activePool, activeChain, readcallData }) => {
  const [amount, setAmount] = useState<string>('');
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  const decimals = activePool === 'aBLP' ? 18 : 6;

  const balance = readcallData[activePool + '-depositBalances']?.[0];
  const poolAvailableBalance =
    readcallData[activePool + '-availableBalance']?.[0];
  const unlockedBalance =
    readcallData[activePool + '-getUnlockedLiquidity']?.[0];
  return (
    <div>
      <InputField
        activePool={activePool}
        setValue={setAmount}
        balance={balance ?? '0'}
        unit={activePool}
        decimals={decimals}
      />
      <div className="flex justify-between items-start mt-2">
        <span className="text-f12 font-medium text-[#C4C7C7]">
          You will receive:
        </span>
        <WithdrawButton
          activeChain={activeChain}
          amount={amount}
          decimals={decimals}
          poolAvailableBalance={poolAvailableBalance}
          unlockedBalance={unlockedBalance}
        />
      </div>
      <RowBetween className="mt-6">
        <span className="text-[#7F87A7] text-f14 font-medium leading-[14px]">
          Pool Available Balance:
        </span>
        {poolAvailableBalance !== undefined ? (
          <Display
            data={divide(poolAvailableBalance, decimals)}
            precision={2}
            unit={unit}
            className="text-[#FFFFFF] text-f14 font-medium leading-[14px]"
          />
        ) : (
          <Skeleton className="w-[50px] !h-5 lc " />
        )}
      </RowBetween>
      <RowBetween className="mt-5">
        <span className="text-[#7F87A7] text-f14 font-medium leading-[14px]">
          Unlocked Balance:
        </span>
        {unlockedBalance !== undefined ? (
          <Display
            data={divide(unlockedBalance, decimals)}
            precision={2}
            unit={unit}
            className="text-[#FFFFFF] text-f14 font-medium "
          />
        ) : (
          <Skeleton className="w-[50px] !h-5 lc " />
        )}
      </RowBetween>
    </div>
  );
};

const WithdrawButton: React.FC<{
  activeChain: Chain;
  amount: string;
  decimals: number;
  poolAvailableBalance: string | undefined;
  unlockedBalance: string | undefined;
}> = ({
  activeChain,
  amount,
  decimals,
  poolAvailableBalance,
  unlockedBalance,
}) => {
  const contracts = getLpConfig(activeChain.id);
  const toastify = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { writeCall } = useWriteCall(contracts.RewardRouter, RewardRouterABI);

  async function handleWithdraw() {
    try {
      if (poolAvailableBalance === undefined)
        throw new Error('Please wait for the data to load');
      if (unlockedBalance === undefined)
        throw new Error('Please wait for the data to load');
      if (amount === '' || amount === undefined)
        throw new Error('Please enter an amount');
      if (!amount) throw new Error('Please enter an amount');
      if (Number(amount) <= 0) throw new Error('Please enter a valid amount');
      if (gt(amount, divide(poolAvailableBalance, decimals) as string))
        throw new Error('Insufficient balance in the pool');
      if (gt(amount, divide(unlockedBalance, decimals) as string))
        throw new Error('Insufficient unlocked balance');

      setLoading(true);
      await writeCall(
        (returnObj) => {
          if (returnObj !== undefined) {
            toastify({
              type: 'success',
              msg: 'Withdrawal successful',
              id: 'withdraw-success',
            });
          }
        },
        'unstakeAndRedeemBlp',
        [toFixed(multiply(amount, decimals), 0)]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message ?? 'Withdraw failed',
        id: 'withdraw-error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConnectionRequired className="!text-f14 !py-[0] !px-4 mt-2">
      <BlueBtn
        onClick={handleWithdraw}
        isLoading={loading}
        isDisabled={loading}
        className="!text-f14 !h-fit !py-[0] !px-4 leading-[28px] mt-2 min-h-[25px]"
      >
        Withdraw
      </BlueBtn>
    </ConnectionRequired>
  );
};
