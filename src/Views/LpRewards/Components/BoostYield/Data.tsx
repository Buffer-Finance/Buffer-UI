import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
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
}> = ({ activeChain, activePool }) => {
  const { address } = useUserAccount();
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <DataColumn
          title="Total Locked"
          value={<span className={defaultDataStyle}>1,0567 USDC</span>}
        />
        <DataColumn
          title="Total Unlocked"
          value={<span className={defaultDataStyle}>67%</span>}
        />
        <DataColumn
          title="Total Claimable"
          value={<span className={defaultDataStyle}>56,661</span>}
        />
      </div>
      <div className="flex flex-col gap-8 justify-end items-end">
        <WithdrawButton activeChain={activeChain} unlockedAmount={undefined} />
        <ClaimButton
          activeChain={activeChain}
          rewards={undefined}
          userAddress={address}
        />
      </div>
    </Container>
  );
};

const ClaimButton: React.FC<{
  activeChain: Chain;
  rewards: string | undefined;
  userAddress: string | undefined;
}> = ({ activeChain, rewards, userAddress }) => {
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
        [
          [
            // add the nft ids of the user here
          ],
          userAddress,
        ]
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
}> = ({ activeChain, unlockedAmount }) => {
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
        [
          [
            // add the nft ids of the user here
          ],
        ]
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
