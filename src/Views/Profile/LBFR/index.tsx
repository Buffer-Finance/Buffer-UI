import { Section } from '@Views/Earn/Components/Section';
import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import { profileCardClass } from '../Components/ProfileCards';
import { Card } from '@Views/Earn/Components/Card';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import { Display } from '@Views/Common/Tooltips/Display';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { usePoolNames } from '@Views/Dashboard/Hooks/useArbitrumOverview';
import { useMemo, useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { btnClasses } from '@Views/Earn/Components/EarnButtons';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { LBFRmodals } from './modals';
import { useSetAtom } from 'jotai';
import { LBFRModalAtom, LBFRModalNumberAtom } from './atom';
import { useUserAccount } from '@Hooks/useUserAccount';
import { stakedType, useLBFRreadCalls } from './Hooks/useReadCalls';
import { LBFRGraphqlType, useLBFRGraphql } from './Hooks/useGraphql';
import {
  divide,
  gt,
  lt,
  lte,
  multiply,
} from '@Utils/NumString/stringArithmatics';
import { useActiveChain } from '@Hooks/useActiveChain';
import { toFixed } from '@Utils/NumString';
import { Skeleton } from '@mui/material';
import { WalletNotConnectedCard } from '../Components/ProfileCards';
import { useWriteCall } from '@Hooks/useWriteCall';
import { getContract } from './Config/Addresses';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import { useToast } from '@Contexts/Toast';
import { SomethingWentWrongModal } from '@Views/Common/Modals/SomethingWentWrong';
import axios from 'axios';
import LBFRabi from './Config/FaucetLBFR.json';
import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useWeekOfTournament } from '@Views/V2-Leaderboard/Hooks/useWeekOfTournament';
import { LBFRconfig } from './config';
import { TimerBox } from '@Views/V2-Leaderboard/Incentivised';
import { getDistance } from '@Utils/Time';
import { getBalance } from '@Views/Common/AccountInfo';
import styled from '@emotion/styled';
import { useGlobal } from '@Contexts/Global';

export const LBFR = () => {
  return (
    <>
      <LBFRmodals />
      <Cards />
    </>
  );
};
const Cards = () => {
  const graphData = useLBFRGraphql();
  const readcallData = useLBFRreadCalls();
  const { activeChain } = useActiveChain();
  const launchTimeStamp = LBFRconfig[activeChain.id]?.startTimestamp / 1000;
  const distance = getDistance(launchTimeStamp);
  if (!launchTimeStamp) return <></>;
  if (distance > 0)
    return (
      <></>
      // <TimerBox
      //   expiration={launchTimeStamp}
      //   className="mt-[5vh] m-auto"
      //   head={
      //     <span className="text-5  mb-[25px] text-f16">
      //       Loyalty Program starts in
      //     </span>
      //   }
      // />
    );
  // return (
  //   <Section
  //     Heading={<div className="text-f22">Loyalty Program</div>}
  //     subHeading={<></>}
  //     Cards={[
  //       <TimerBox
  //         expiration={launchTimeStamp}
  //         className="mt-[5vh] m-auto"
  //         head={
  //           <span className="text-5  mb-[25px] text-f16">
  //             Loyalty Program starts in
  //           </span>
  //         }
  //       />,
  //     ]}
  //     className="!mt-7"
  //   />
  // );
  return (
    <Section
      Heading={<div className="text-f22">Loyalty Program</div>}
      subHeading={<></>}
      Cards={[
        <ClaimCard data={graphData} />,
        <StakeCard data={readcallData} />,
      ]}
      className="!mt-7"
    />
  );
};

const TimeLeft = () => {
  const { activeChain } = useActiveChain();
  const { nextTimeStamp } = useWeekOfTournament({
    startTimestamp: LBFRconfig[activeChain.id]?.startTimestamp,
  });

  const stopwatch = useStopWatch(nextTimeStamp / 1000);
  return <>{stopwatch}</>;
};

const ClaimCard = ({ data }: { data: LBFRGraphqlType }) => {
  const { address: account } = useUserAccount();

  const decimals = 18;
  const unit = 'LBFR';
  const heading = 'Claim LBFR';
  const { poolNames } = usePoolNames();
  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );

  const currentSlab = useMemo(() => {
    if (!data || !data.totalVolume?.[0].currentSlab) return '1';
    const slab = data.totalVolume[0].currentSlab;
    console.log(slab, 'slab');
    if (lt(slab, '1')) return '1';
    return divide(slab, 2);
  }, []);

  if (account === undefined)
    return <WalletNotConnectedCard heading={heading} />;
  if (data === undefined)
    return (
      <Skeleton
        key={'claimCardLoader'}
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
            'Claimable',
            'Claimed',
            'Last claimed',
            'Volume',
            'Loyalty points per USDC',
            'Time left for reset',
          ]}
          values={[
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalVolume?.[0]?.claimable ?? '0', decimals)}
                unit={unit}
              />
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalVolume?.[0]?.claimed ?? '0', decimals)}
                unit={unit}
              />
            </div>,
            <div className={wrapperClasses}>
              {data.lbfrclaimDataPerUser?.lastClaimedTimestamp
                ? getDisplayDate(
                    Number(data.lbfrclaimDataPerUser.lastClaimedTimestamp)
                  ) +
                  ' ' +
                  getDisplayTime(
                    Number(data.lbfrclaimDataPerUser.lastClaimedTimestamp)
                  )
                : 'Not claimed yet.'}
            </div>,
            <div className={wrapperClasses}>
              <Display
                data={divide(data.totalVolume?.[0]?.volume ?? '0', decimals)}
                unit={'USDC'}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) => {
                        const stats = data.totalVolume?.[0]?.[`volume${token}`];
                        if (stats)
                          return (
                            toFixed(divide(stats, decimals) as string, 2) +
                            ' ' +
                            token
                          );
                        else return '-';
                      })}
                    />
                  )
                }
              />
            </div>,
            <div className={wrapperClasses}>
              <Display data={currentSlab} unit={unit + '/USDC'} />
            </div>,
            <div className={wrapperClasses}>
              <TimeLeft />
            </div>,
          ]}
        />
      }
      bottom={
        <ConnectionRequired className={'mt-7 mb-5 ' + btnClasses}>
          <div className="flex items-center gap-4 mt-7 mb-5 ">
            <ClaimLBFRBtn />
          </div>
        </ConnectionRequired>
      }
    />
  );
};

export const ClaimLBFRBtn = ({
  shouldShowValue = false,
  shouldShowIcon = false,
  shouldNotShowForZero = false,
  className = '',
}: {
  shouldShowValue?: boolean;
  shouldShowIcon?: boolean;
  shouldNotShowForZero?: boolean;
  className?: string;
}) => {
  const { address: account } = useUserAccount();
  const toastify = useToast();
  const { state } = useGlobal();
  const [btnState, setBtnState] = useState(false);
  const { viewOnlyMode } = useUserAccount();
  const { activeChain } = useActiveChain();
  const { writeCall } = useWriteCall(
    getContract(activeChain.id, 'LBFRfaucet'),
    LBFRabi
  );
  const data = useLBFRGraphql();
  const decimals = 18;

  const SVGclasses = styled.div`
    &:hover {
      svg {
        path {
          fill: url(#paint0_linear_2224_8373);
        }
        circle {
          fill: white;
        }
      }
    }
  `;
  async function claim() {
    if (
      data &&
      data.totalVolume &&
      data.totalVolume[0] &&
      lte(data.totalVolume[0].claimable, '0')
    )
      return toastify({
        type: 'error',
        msg: `You have no LBFR to claim`,
        id: 'claimLBFR',
      });

    setBtnState(true);
    try {
      const res = await axios.get(
        `https://lbfr.buffer-finance-api.link/lbfr/claim/${import.meta.env.VITE_ENV.toLowerCase()}/${account}`
      );
      console.log(res, 'res');
      if (res.data.error) {
        setBtnState(false);
        return;
      }
      const {
        signed_hash,
        current_week_token_allocation,
        former_week_token_allocation,
        weekID,
      } = res.data;

      writeCall(() => setBtnState(false), 'claim', [
        signed_hash,
        current_week_token_allocation,
        former_week_token_allocation,
        weekID,
      ]);
    } catch (e) {
      toastify({
        type: 'error',
        msg: `Failed to fetch data. Please try again. ${e}`,
        id: 'claimLBFR',
      });
      setBtnState(false);
    }
  }
  if (account === undefined) return <></>;
  if (data === undefined)
    return (
      <BlueBtn
        onClick={() => {
          console.log(data, 'claimLBFRbtnError');
        }}
        isDisabled
        className={className}
      >
        Claim LBFR
      </BlueBtn>
    );
  if (
    shouldNotShowForZero &&
    data &&
    data.totalVolume &&
    data.totalVolume[0] &&
    lte(data.totalVolume[0].claimable, '0')
  )
    return <></>;
  return (
    <SVGclasses>
      <BlueBtn
        onClick={claim}
        className={btnClasses + ' ' + className}
        isDisabled={viewOnlyMode || state.txnLoading >= 1}
        isLoading={btnState}
      >
        {shouldShowIcon && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <circle
              cx="8.24892"
              cy="8.24892"
              r="8.24892"
              fill="url(#paint0_linear_2224_8364)"
            />
            <path
              d="M8.45926 3.35996C8.37015 3.24906 8.28104 3.13816 8.17169 3C8.12449 3.07449 8.0937 3.12307 8.06677 3.17049L8.06071 3.18006C6.67774 5.36237 5.29616 7.54248 3.91093 9.72344C3.8469 9.82448 3.83738 9.90361 3.89549 10.0141C4.28022 10.7534 4.65991 11.4957 5.03455 12.241C5.0944 12.3586 5.16099 12.4015 5.296 12.4005C7.34704 12.4041 9.39982 12.4149 11.4512 12.4278C11.5693 12.4289 11.635 12.3894 11.6962 12.2927C12.0606 11.708 12.4286 11.1223 12.8056 10.5421C12.8816 10.4271 12.8715 10.3544 12.7791 10.2536C11.6231 10.1494 7.85917 9.95374 6.72321 9.85248L6.85544 9.64382C7.79919 8.1546 8.74433 6.66319 9.6926 5.17669C9.77194 5.05149 9.76178 4.97875 9.67127 4.87005C9.26251 4.3709 8.86158 3.86433 8.45926 3.35996Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2224_8364"
                x1="16.8828"
                y1="4.33417"
                x2="-0.58973"
                y2="5.69167"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#13D6C9" />
                <stop offset="1" stopColor="#0047D0" />
              </linearGradient>
              <defs>
                <linearGradient
                  id="paint0_linear_2224_8373"
                  x1="13.0662"
                  y1="5.47681"
                  x2="3.53016"
                  y2="6.18402"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#13D6C9" />
                  <stop offset="1" stopColor="#0047D0" />
                </linearGradient>
              </defs>
            </defs>
          </svg>
        )}
        Claim{' '}
        {shouldShowValue && (
          <>
            {getBalance(
              divide(data.totalVolume?.[0]?.claimable ?? '0', decimals)
            )}{' '}
            <span className="sm:hidden ml-2">LBFR</span>
          </>
        )}
      </BlueBtn>
    </SVGclasses>
  );
};

const StakeCard = ({ data }: { data: null | stakedType }) => {
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
