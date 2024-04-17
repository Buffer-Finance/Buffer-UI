import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import NumberTooltip from '@Views/Common/Tooltips';
import { getLpConfig } from '@Views/LpRewards/config';
import { lockTxn } from '@Views/LpRewards/types';
import { useState } from 'react';
import { Chain } from 'wagmi';
import NFTlockPoolABI from '../../../abis/NftLockPool.json';

export const ClaimRewards: React.FC<{
  lockTxn: lockTxn;
  activeChain: Chain;
  className?: string;
}> = ({ lockTxn, activeChain, className = '' }) => {
  const contracts = getLpConfig(activeChain.id);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NFTlockPoolABI);

  async function handleClaim() {
    try {
      setLoading(true);
      writeCall(
        (returnObj) => {
          if (returnObj) {
            toastify({
              type: 'success',
              msg: 'Claimed Successfully',
              id: 'claim-rewards',
            });
          }
        },
        'harvestPosition',
        [lockTxn.nftId]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'claim-rewards',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <NumberTooltip content={'Claim Rewards'}>
      <button onClick={handleClaim} disabled={loading} className={className}>
        <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/ClaimRewards.png" />
      </button>
    </NumberTooltip>
  );
};
