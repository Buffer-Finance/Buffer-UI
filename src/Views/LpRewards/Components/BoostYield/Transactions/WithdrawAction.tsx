import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import NumberTooltip from '@Views/Common/Tooltips';
import { getLpConfig } from '@Views/LpRewards/config';
import { lockTxn } from '@Views/LpRewards/types';
import { useState } from 'react';
import { Chain } from 'wagmi';
import NFTlockPoolABI from '../../../abis/NftLockPool.json';

export const Withdraw: React.FC<{
  activeChain: Chain;
  lockTxn: lockTxn;
  className?: string;
}> = ({ activeChain, lockTxn, className = '' }) => {
  const contracts = getLpConfig(activeChain.id);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NFTlockPoolABI);

  async function handleWithdraw() {
    try {
      setLoading(true);
      writeCall(
        (returnObj) => {
          if (returnObj) {
            toastify({
              type: 'success',
              msg: 'Withdrawn Successfully',
              id: 'withdraw',
            });
          }
        },
        'withdrawAllFromPosition',
        [lockTxn.nftId]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'withdraw',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <NumberTooltip content={'Withdraw'}>
      <button onClick={handleWithdraw} disabled={loading} className={className}>
        <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Withdraw.png" />
      </button>
    </NumberTooltip>
  );
};
