import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { add, divide } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { getLpConfig } from '@Views/LpRewards/config';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { useMemo, useState } from 'react';
import { Chain } from 'viem';
import NFTlockPoolABI from '../../abis/NftLockPool.json';
import { DataColumn, defaultDataStyle } from '../DataColumn';
import { Container } from '../Deposit/Styles';

export const Data: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  lockTxns: lockTxn[];
  pendingRewards: {
    [key: string]: string[];
  };
}> = ({ activeChain, activePool, lockTxns, pendingRewards }) => {
  const { address } = useUserAccount();
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  const decimals = activePool === 'uBLP' ? 6 : 18;

  const [
    totalLocked,
    totalUnlocked,
    totalClaimable,
    withdrawableIds,
    claimableIds,
  ] = useMemo(() => {
    let totalLocked = '0';
    let totalUnlocked = '0';
    let totalClaimable = '0';
    const withdrawableNftIds: string[] = [];
    const claimableIds: string[] = [];

    const currentTimestamp = Math.floor(Date.now() / 1000);

    lockTxns.forEach((txn) => {
      if (Number(txn.lockPeriod) + Number(txn.timestamp) > currentTimestamp) {
        totalLocked = add(totalLocked, txn.amount);
      } else {
        totalUnlocked = add(totalUnlocked, txn.amount);
        withdrawableNftIds.push(txn.nftId);
      }

      const unclaimedRewards = pendingRewards?.[txn.nftId]?.[0];

      if (unclaimedRewards) {
        totalClaimable = add(totalClaimable, unclaimedRewards);
        claimableIds.push(txn.nftId);
      }
    });

    return [
      totalLocked,
      totalUnlocked,
      totalClaimable,
      withdrawableNftIds,
      claimableIds,
    ];
  }, [lockTxns, pendingRewards]);

  return (
    <Container className="gap-7">
      <div className="flex flex-col gap-6">
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
        <DataColumn
          title="Total Claimable"
          value={
            <span className={defaultDataStyle}>
              <Display
                data={divide(totalClaimable, 18)}
                precision={2}
                unit={unit}
              />
            </span>
          }
        />
      </div>
      <div className="flex flex-col gap-8 justify-end items-end">
        <WithdrawButton
          activeChain={activeChain}
          unlockedAmount={totalUnlocked}
          withdrawAbleIds={withdrawableIds}
        />
        <ClaimButton
          activeChain={activeChain}
          rewards={totalClaimable}
          userAddress={address}
          claimableIds={claimableIds}
        />
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
        'harvestMultiplePositionTo',
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
    <ConnectionRequired>
      <BlueBtn
        onClick={handleClaim}
        className="!w-fit !h-fit !px-5 !py-[0] min-h-[25px]"
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
    <ConnectionRequired>
      <BlueBtn
        onClick={handleClaim}
        className="!w-fit !h-fit !px-5 !py-[0] min-h-[25px]"
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
