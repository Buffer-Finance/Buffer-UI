import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { divide } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useUSDCapr } from '@Views/LpRewards/Hooks/useUSDCapr';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import RewardRouterABI from '../../abis/RewardRouter.json';
import { getLpConfig, poolToTokenMapping } from '../../config';
import { poolsType } from '../../types';
import { DataColumn, defaultDataStyle } from '../DataColumn';
import { Container } from './Styles';

export const UserData: React.FC<{
  activePool: poolsType;
  readcallData: {
    [callId: string]: string[];
  };
  activeChain: Chain;
}> = ({ activePool, readcallData, activeChain }) => {
  const rewards = readcallData[activePool + '-claimable']?.[0];
  const totalDeposits = readcallData[activePool + '-depositBalances']?.[0];
  const apr = useUSDCapr(activeChain, activePool);
  const unit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  const decimals = activePool === 'uBLP' ? 6 : 18;
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <DataColumn
          title="Total value"
          value={
            totalDeposits !== undefined ? (
              <span className={defaultDataStyle}>
                <Display
                  data={divide(totalDeposits, decimals)}
                  unit={unit}
                  precision={2}
                  className="!justify-start"
                />
              </span>
            ) : (
              <Skeleton className="w-[50px] !h-5 lc " />
            )
          }
        />
        <DataColumn
          title="Current APR"
          value={
            apr !== undefined ? (
              <span className={defaultDataStyle}>
                <Display
                  data={apr}
                  unit="%"
                  precision={2}
                  className="!justify-start"
                />
              </span>
            ) : (
              <Skeleton className="w-[50px] !h-5 lc " />
            )
          }
        />
        <DataColumn
          title={`${poolToTokenMapping[activePool]} rewards`}
          value={
            rewards !== undefined ? (
              <span className={defaultDataStyle}>
                <Display
                  data={divide(rewards, decimals)}
                  unit={unit}
                  precision={2}
                  className="!justify-start"
                />
              </span>
            ) : (
              <Skeleton className="w-[50px] !h-5 lc " />
            )
          }
        />
      </div>
      <ClaimButton activeChain={activeChain} rewards={rewards} />
    </Container>
  );
};

const ClaimButton: React.FC<{
  activeChain: Chain;
  rewards: string | undefined;
}> = ({ activeChain, rewards }) => {
  const contracts = getLpConfig(activeChain.id);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const { writeCall } = useWriteCall(contracts.RewardRouter, RewardRouterABI);

  async function handleClaim() {
    try {
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
        'handleRewards',
        [false, false, false, false, false, true]
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
        isDisabled={loading || rewards === '0' || rewards === undefined}
        isLoading={loading}
      >
        Claim
      </BlueBtn>
    </ConnectionRequired>
  );
};
