import NumberTooltip from '@Views/Common/Tooltips';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { useState } from 'react';
import { Chain } from 'wagmi';
import { RenewLockModal } from '../RenewLockModal';
import { convertToNumberOfMonthsAndDays } from './helpers';

export const ExtendLock: React.FC<{
  activeChain: Chain;
  lockTxn: lockTxn;
  decimals: number;
  unit: string;
  activePool: poolsType;
}> = ({ activeChain, lockTxn, decimals, unit, activePool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lockPeriod, setLockPeriod] = useState(
    convertToNumberOfMonthsAndDays(parseInt(lockTxn.lockPeriod))
  );
  return (
    <>
      <RenewLockModal
        activeChain={activeChain}
        lockTxn={lockTxn}
        decimals={decimals}
        unit={unit}
        closeModal={setIsOpen}
        isOpen={isOpen}
        isExtendModal={true}
        lockPeriod={lockPeriod}
        setLockPeriod={setLockPeriod}
        activePool={activePool}
      />
      <NumberTooltip content={'Extend'}>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Lock.png" />
        </button>
      </NumberTooltip>
    </>
  );
};
