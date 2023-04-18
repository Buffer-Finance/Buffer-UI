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
import { getDisplayDate } from '@Utils/Dates/displayDateTime';
import { usePoolNames } from '@Views/Dashboard/Hooks/useArbitrumOverview';
import { useMemo } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import { btnClasses } from '@Views/Earn/Components/EarnButtons';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { LBFRmodals } from './modals';
import { useSetAtom } from 'jotai';
import { LBFRModalAtom, LBFRModalNumberAtom } from './atom';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useLBLPreadCalls } from './Hooks/useReadCalls';
import { useLBFRGraphql } from './Hooks/useGraphql';

export const LBFR = () => {
  return (
    <>
      <LBFRmodals />
      <Cards />
    </>
  );
};
const Cards = () => {
  useLBFRGraphql();
  useLBLPreadCalls();
  return (
    <Section
      Heading={<div className="text-f22">Loyalty Program</div>}
      subHeading={<></>}
      Cards={[<ClaimCard />, <StakeCard />]}
      className="!mt-7"
    />
  );
};

const ClaimCard = () => {
  const { viewOnlyMode } = useUserAccount();
  const unit = 'LBFR';
  const { poolNames } = usePoolNames();
  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );
  function claim() {
    console.log('Claim');
  }
  return (
    <Card
      className={profileCardClass}
      shouldShowDivider={false}
      top={'Claim LBFR'}
      middle={
        <TableAligner
          className="mt-3"
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['Claimable', 'Claimed', 'Last claimed', 'Volume', 'Slab']}
          values={[
            <div className={wrapperClasses}>
              <Display data={'11234'} unit={unit} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'145'} unit={unit} />
            </div>,
            <div className={wrapperClasses}>{getDisplayDate(1681452781)}</div>,
            <div className={wrapperClasses}>
              <Display
                data={'10000'}
                unit={'USDC'}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map((token) => 5000 + ' ' + token)}
                    />
                  )
                }
              />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'12.54'} unit={unit + '/Per Unit Volume'} />
            </div>,
          ]}
        />
      }
      bottom={
        <ConnectionRequired className={'mt-7 mb-5 ' + btnClasses}>
          <div className="flex items-center gap-4 mt-7 mb-5 ">
            <BlueBtn
              onClick={claim}
              className={btnClasses}
              isDisabled={viewOnlyMode}
            >
              Claim
            </BlueBtn>
          </div>
        </ConnectionRequired>
      }
    />
  );
};

const StakeCard = () => {
  const setIsModalOpen = useSetAtom(LBFRModalAtom);
  const setActiveModalNumber = useSetAtom(LBFRModalNumberAtom);
  const { viewOnlyMode } = useUserAccount();
  const unit = 'LBFR';
  const rewardUnit = 'BFR';

  function stake() {
    setIsModalOpen(true);
    setActiveModalNumber(0);
  }
  function unstake() {
    setIsModalOpen(true);
    setActiveModalNumber(1);
  }
  function claim() {
    console.log('Claim');
  }
  return (
    <Card
      className={profileCardClass}
      shouldShowDivider={false}
      top={'Stake LBFR'}
      middle={
        <TableAligner
          className="mt-3"
          keyStyle={keyClasses}
          valueStyle={valueClasses}
          keysName={['Wallet', 'Staked', 'APR', 'Total Staked', 'Rewards']}
          values={[
            <div className={wrapperClasses}>
              <Display data={'11234'} unit={unit} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'145'} unit={unit} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'12'} unit="%" />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'1235'} unit={unit} />
            </div>,
            <div className={wrapperClasses}>
              <Display data={'147'} unit={rewardUnit} />
            </div>,
          ]}
        />
      }
      bottom={
        <ConnectionRequired className={'mt-7 mb-5 ' + btnClasses}>
          <div className="flex items-center gap-4 mt-7 mb-5 ">
            <BlueBtn
              onClick={stake}
              className={btnClasses}
              isDisabled={viewOnlyMode}
            >
              Stake
            </BlueBtn>
            <BlueBtn
              onClick={unstake}
              className={btnClasses}
              isDisabled={viewOnlyMode}
            >
              Unstake
            </BlueBtn>
            <BlueBtn
              onClick={claim}
              className={btnClasses}
              isDisabled={viewOnlyMode}
            >
              Claim BFR
            </BlueBtn>
          </div>
        </ConnectionRequired>
      }
    />
  );
};
