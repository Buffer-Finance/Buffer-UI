import NumberTooltip from '@Views/Common/Tooltips';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { useState } from 'react';
import { Chain } from 'wagmi';
import { RenewLockModal } from '../RenewLockModal';
import { convertToNumberOfMonthsAndDays } from './helpers';

export const RenewLock: React.FC<{
  lockTxn: lockTxn;
  activeChain: Chain;
  decimals: number;
  unit: string;
  activePool: poolsType;
}> = ({ lockTxn, activeChain, decimals, unit, activePool }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <RenewLockModal
        activeChain={activeChain}
        lockTxn={lockTxn}
        decimals={decimals}
        unit={unit}
        closeModal={setIsOpen}
        isOpen={isOpen}
        isExtendModal={false}
        lockPeriod={convertToNumberOfMonthsAndDays(
          parseInt(lockTxn.lockPeriod)
        )}
        setLockPeriod={() => {}}
        activePool={activePool}
      />
      <NumberTooltip content={'Renew'}>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Renew.png" />
        </button>
      </NumberTooltip>
    </>
  );
};
