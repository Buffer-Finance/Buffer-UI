import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { divide } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { getLpConfig } from '@Views/LpRewards/config';
import { poolsType } from '@Views/LpRewards/types';
import { useState } from 'react';
import { Chain } from 'viem';
import NFTlockPoolABI from '../../abis/NftLockPool.json';
import { DataColumn, defaultDataStyle } from '../DataColumn';
import { Container } from '../Deposit/Styles';

export const Data: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  computedData: {
    totalLocked: string;
    totalUnlocked: string;
    totalClaimable: string;
    withdrawableNftIds: string[];
    claimableIds: string[];
  };
}> = ({ activeChain, activePool, computedData }) => {
  const { address } = useUserAccount();
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  const decimals = activePool === 'uBLP' ? 6 : 18;

  const {
    totalLocked,
    totalUnlocked,
    totalClaimable,
    withdrawableNftIds: withdrawableIds,
    claimableIds,
  } = computedData;

  return (
    <Container className="gap-7">
      <div className="flex flex-col gap-6 h-full">
        <DataColumn
          title="Total Locked"
          value={
            <span className={defaultDataStyle}>
              <Display
                data={divide(totalLocked, decimals)}
                precision={2}
                unit={unit}
              />
            </span>
          }
        />
        <div className="flex gap-8 items-start h-full justify-between">
          <DataColumn
            title="Total Withdrawable"
            value={
              <span className={defaultDataStyle}>
                <Display
                  data={divide(totalUnlocked, decimals)}
                  precision={2}
                  unit={unit}
                />
              </span>
            }
          />
          <WithdrawButton
            activeChain={activeChain}
            unlockedAmount={totalUnlocked}
            withdrawAbleIds={withdrawableIds}
          />
        </div>
        <div className="flex gap-8 items-start h-full justify-between">
          <DataColumn
            title="Total Claimable"
            value={
              <span className={defaultDataStyle}>
                <Display
                  data={divide(totalClaimable, 18)}
                  precision={2}
                  unit={'ARB'}
                />
              </span>
            }
          />
          <ClaimButton
            activeChain={activeChain}
            rewards={totalClaimable}
            userAddress={address}
            claimableIds={claimableIds}
          />
        </div>
      </div>
    </Container>
  );
};

const ClaimButton: React.FC<{
  activeChain: Chain;
  rewards: string | undefined;
  userAddress: string | undefined;
  claimableIds: string[];
}> = ({ activeChain, rewards, userAddress, claimableIds }) => {
  const contracts = getLpConfig(activeChain.id);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NFTlockPoolABI);

  async function handleClaim() {
    try {
      if (rewards === undefined) throw new Error('Rewards not found');
      if (userAddress === undefined) throw new Error('User address not found');
      setLoading(true);
      await writeCall(
        (obj) => {
          if (obj !== undefined) {
            toastify({
              type: 'success',
              msg: 'Rewards claimed successfully',
              id: 'claim-rewards-success',
            });
          }
        },
        'harvestPositionsTo',
        [claimableIds.slice(0, 10), userAddress]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: 'Error while claiming rewards',
        id: 'claim-rewards-error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConnectionRequired className="mt-4">
      <BlueBtn
        onClick={handleClaim}
        className="!w-fit !h-fit !px-5 !py-[0] min-h-[25px] mt-[20px]"
        isDisabled={
          loading ||
          rewards === '0' ||
          rewards === undefined ||
          userAddress === undefined
        }
        isLoading={loading}
      >
        Claim
      </BlueBtn>
    </ConnectionRequired>
  );
};

const WithdrawButton: React.FC<{
  activeChain: Chain;
  unlockedAmount: string | undefined;
  withdrawAbleIds: string[];
}> = ({ activeChain, unlockedAmount, withdrawAbleIds }) => {
  const contracts = getLpConfig(activeChain.id);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NFTlockPoolABI);

  async function handleClaim() {
    try {
      if (unlockedAmount === undefined)
        throw new Error('UnlockedAmount not found');
      setLoading(true);
      await writeCall(
        (obj) => {
          if (obj !== undefined) {
            toastify({
              type: 'success',
              msg: 'Withdrawn successfully',
              id: 'unlockedAmount-success',
            });
          }
        },
        'withdrawAllFromMultiplePositions',
        [withdrawAbleIds.slice(0, 10)]
      );
    } catch (e) {
      toastify({
        type: 'error',
        msg: 'Error while claiming unlockedAmount',
        id: 'claim-unlockedAmount-error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ConnectionRequired className="mt-4">
      <BlueBtn
        onClick={handleClaim}
        className="!w-fit !h-fit !px-5 !py-[0] min-h-[25px] mt-[20px]"
        isDisabled={
          loading || unlockedAmount === '0' || unlockedAmount === undefined
        }
        isLoading={loading}
      >
        Withdraw
      </BlueBtn>
    </ConnectionRequired>
  );
};
