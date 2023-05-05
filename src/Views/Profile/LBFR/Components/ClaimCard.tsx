import { useUserAccount } from '@Hooks/useUserAccount';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { toFixed } from '@Utils/NumString';
import { divide, lt } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolNames } from '@Views/Dashboard/Hooks/useArbitrumOverview';
import { Card } from '@Views/Earn/Components/Card';
import { wrapperClasses } from '@Views/Earn/Components/EarnCards';
import {
  keyClasses,
  tooltipKeyClasses,
  tooltipValueClasses,
  valueClasses,
} from '@Views/Earn/Components/VestCards';
import {
  WalletNotConnectedCard,
  profileCardClass,
} from '@Views/Profile/Components/ProfileCards';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { TimeLeft } from './TimeLeft';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { btnClasses } from '@Views/Earn/Components/EarnButtons';
import { LBFRGraphqlType } from '../Hooks/useGraphql';
import { ClaimLBFRBtn } from './ClaimLBFRbtn';

export const ClaimCard = ({ data }: { data: LBFRGraphqlType }) => {
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
