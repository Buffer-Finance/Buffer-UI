import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { SomethingWentWrongModal } from '@Views/Common/Modals/SomethingWentWrong';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { btnClasses } from '@Views/Earn/Components/EarnButtons';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { LBFRModalAtom, LBFRModalNumberAtom } from '../atom';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { getContract } from '../Config/Addresses';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import { stakedType } from '../Hooks/useReadCalls';
import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import {
  WalletNotConnectedCard,
  profileCardClass,
} from '@Views/Profile/Components/ProfileCards';
import { Skeleton } from '@mui/material';
import { Card } from '@Views/Earn/Components/Card';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { keyClasses, valueClasses } from '@Views/Earn/Components/VestCards';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';

export const StakeCard = ({ data }: { data: null | stakedType }) => {
  const toastify = useToast();
  try {
    const { state } = useGlobal();
    const [btnState, setBtnState] = useState(false);
    const { address: account } = useUserAccount();
    const setIsModalOpen = useSetAtom(LBFRModalAtom);
    const setActiveModalNumber = useSetAtom(LBFRModalNumberAtom);
    const { activeChain } = useActiveChain();
    const { writeCall } = useWriteCall(
      getContract(activeChain.id, 'LBFRrewardTracker'),
      RewardTrackerAbi
    );
    const { viewOnlyMode } = useUserAccount();
    const unit = 'LBFR';
    const rewardUnit = 'BFR';
    const rewardDecimals = 18;
    const heading = 'Stake LBFR';

    function stake() {
      setIsModalOpen(true);
      setActiveModalNumber(0);
    }
    function unstake() {
      setIsModalOpen(true);
      setActiveModalNumber(1);
    }
    function claim() {
      setBtnState(true);
      if (
        data &&
        !gt(divide(data.userRewards, rewardDecimals) as string, '0')
      ) {
        toastify({
          type: 'error',
          msg: `No rewards to claim.`,
          id: 'claimLBFR',
        });
        setBtnState(false);
        return;
      }
      writeCall(
        () => {
          setBtnState(false);
        },
        'claim',
        [account]
      );
    }

    if (account === undefined)
      return <WalletNotConnectedCard heading={heading} />;
    if (!data)
      return (
        <Skeleton
          key={'stakeCardLoader'}
          variant="rectangular"
          className="w-full !h-full min-h-[270px] !transform-none !bg-1"
        />
      );
    return (
      <Card
        className={profileCardClass}
        shouldShowDivider={false}
        top={heading}
        middle={
          <TableAligner
            className="mt-3"
            keyStyle={keyClasses}
            valueStyle={valueClasses}
            keysName={[
              'Wallet',
              'Staked',
              //  'APR',
              'Weekly Reward Pool',
              'Total Staked',
              'Rewards',
            ]}
            values={[
              <div className={wrapperClasses}>
                <Display
                  data={divide(data.userBalance, data.decimals)}
                  unit={unit}
                />
              </div>,
              <div className={wrapperClasses}>
                <Display
                  data={divide(data.userStaked, data.decimals)}
                  unit={unit}
                />
              </div>,
              // <div className={wrapperClasses}>
              //   <Display data={'0000'} unit="dummy" />
              // </div>,
              <div className={wrapperClasses}>
                <Display
                  data={divide(
                    multiply(multiply(data.tokensPerInterval, '7'), '86400'),
                    rewardDecimals
                  )}
                  unit={rewardUnit}
                />
              </div>,
              <div className={wrapperClasses}>
                <Display
                  data={divide(data.totalStakedLBFR, data.decimals)}
                  unit={unit}
                />
              </div>,
              <div className={wrapperClasses}>
                <Display
                  data={divide(data.userRewards, rewardDecimals)}
                  unit={rewardUnit}
                />
              </div>,
            ]}
          />
        }
        bottom={
          <ConnectionRequired className={'mt-7 mb-5 ' + btnClasses}>
            <div className="flex items-center gap-4 mt-7 mb-5 flex-wrap">
              <BlueBtn
                onClick={stake}
                className={btnClasses}
                isDisabled={viewOnlyMode || state.txnLoading >= 1}
              >
                Stake
              </BlueBtn>
              <BlueBtn
                onClick={unstake}
                className={btnClasses}
                isDisabled={viewOnlyMode || state.txnLoading >= 1}
              >
                Unstake
              </BlueBtn>
              <BlueBtn
                onClick={claim}
                className={btnClasses}
                isDisabled={viewOnlyMode || state.txnLoading >= 1}
                isLoading={btnState}
              >
                Claim BFR
              </BlueBtn>
            </div>
          </ConnectionRequired>
        }
      />
    );
  } catch (e) {
    toastify({ type: 'error', msg: 'Stake Card ' + (e as Error).message });
    return <SomethingWentWrongModal />;
  }
};
