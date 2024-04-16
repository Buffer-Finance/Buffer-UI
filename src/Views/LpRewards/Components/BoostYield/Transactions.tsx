import { useToast } from '@Contexts/Toast';
import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { getDHMSFromSeconds } from '@Utils/Dates/displayDateTime';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { getLpConfig } from '@Views/LpRewards/config';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import styled from '@emotion/styled';
import { Launch } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import NFTlockPoolABI from '../../abis/NftLockPool.json';
import { RenewLockModal } from './RenewLockModal';

enum transactionCols {
  timestamp,
  amount,
  APR,
  lockPeriod,
  remainingTime,
  pendingRewards,
  Actions,
  txnHash,
}

const colNames = [
  'Date | Time',
  'Amount',
  'APR',
  'Lock Period',
  'Time To Unlock',
  'Pending Rewards',
  'Actions',
  '',
];

const Header = (col: number) => {
  return (
    <TableHeader
      col={col}
      headsArr={colNames}
      firstColClassName="ml-7"
      className="text-f15"
    />
  );
};

function Body(
  row: number,
  col: number,
  activePool: poolsType,
  txns: lockTxn[],
  activeChain: Chain,
  pendingRewards: { [key: string]: string } | undefined
) {
  const txn = txns[row];
  const unit = activePool === 'aBLP' ? 'ARB' : 'USDC';
  const decimals = activePool === 'aBLP' ? 18 : 6;
  const currentTimestamp = new Date().getTime();
  const distanceObject = Variables(
    parseInt(txn.timestamp) +
      parseInt(txn.lockPeriod) -
      Math.floor(currentTimestamp / 1000)
  );

  const rewards = pendingRewards?.[txn.nftId];
  switch (col) {
    case transactionCols.timestamp:
      return <DisplayTime ts={txn.timestamp} className="text-f15 ml-8" />;
    case transactionCols.amount:
      return (
        <Display
          data={divide(txn.amount, decimals) as string}
          unit={unit}
          precision={2}
          className="!justify-start text-f15"
        />
      );
    case transactionCols.APR:
      return <span className="text-f15">Meh</span>;
    case transactionCols.remainingTime:
      return (
        <span className="text-f15">
          {distanceObject.distance >= 0 ? formatDistance(distanceObject) : '-'}
        </span>
      );
    case transactionCols.pendingRewards:
      return rewards !== undefined ? (
        <span className="text-f15">
          <Display
            data={divide(rewards, 18)}
            unit="ARB"
            precision={2}
            className="!justify-start"
          />
        </span>
      ) : (
        <Skeleton className="w-[50px] !h-5 lc !transform-none " />
      );
    case transactionCols.Actions:
      return (
        <div className="flex gap-6 items-center">
          {distanceObject.distance < 0 && (
            <NumberTooltip content={'Unlock'}>
              <button onClick={() => {}}>
                <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Withdraw.png" />
              </button>
            </NumberTooltip>
          )}
          <RenewLock
            lockTxn={txn}
            activeChain={activeChain}
            decimals={decimals}
            unit={unit}
          />
          <ExtendLock
            lockTxn={txn}
            activeChain={activeChain}
            decimals={decimals}
            unit={unit}
          />
          <ClaimRewards lockTxn={txn} activeChain={activeChain} />
        </div>
      );
    case transactionCols.lockPeriod:
      return (
        <span className="text-f15">
          {getDHMSFromSeconds(parseInt(txn.lockPeriod))}
        </span>
      );

    case transactionCols.txnHash:
      return (
        <button
          className="text-f15"
          onClick={() => {
            window.open(
              `${activeChain.blockExplorers?.default.url}/tx/${txn.txnHash}`
            );
          }}
        >
          <span className="text-[#808191] text-f14 font-medium">View</span>
          <Launch className="text-[#808191] ml-2" />
        </button>
      );

    default:
      return 'unhandled column';
  }
}

export const Transactions: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  data: lockTxn[] | undefined;
  error: any;
  pendingRewards: { [key: string]: string } | undefined;
  pendingRewardsError: any;
}> = ({ activePool, activeChain, data, error, pendingRewards }) => {
  return (
    <BufferTable
      headerJSX={Header}
      bodyJSX={(row, col) =>
        data === undefined || data.length === 0 || error !== undefined ? (
          <ErrorComponent
            isDataAvailable={data !== undefined}
            isError={error !== undefined}
          />
        ) : (
          Body(row, col, activePool, data, activeChain, pendingRewards)
        )
      }
      cols={colNames.length}
      rows={data?.length ?? 0}
      onRowClick={() => {}}
      className="mt-6"
      widths={['14%', '10%', '9%', '13%', '14%', '13%', '15%', '7%']}
      loading={data === undefined && !error}
      error={
        <ErrorComponent
          isDataAvailable={data !== undefined}
          isError={error !== undefined}
        />
      }
    />
  );
};

const ErrorComponent: React.FC<{
  isDataAvailable: boolean;
  isError: boolean;
}> = ({ isDataAvailable, isError }) => {
  const { address } = useUserAccount();
  if (isError) {
    return <ErrorDiv>Something went wring.Try again later.</ErrorDiv>;
  }
  if (isDataAvailable) {
    if (address === undefined) {
      return <ErrorDiv>Wallet Not Connected.</ErrorDiv>;
    } else {
      return <ErrorDiv>No txns found.</ErrorDiv>;
    }
  }
  return <ErrorDiv>Fetching data...</ErrorDiv>;
};

const ErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px 0;
  font-size: 16px;
  color: #ffffff;
`;

const ClaimRewards: React.FC<{ lockTxn: lockTxn; activeChain: Chain }> = ({
  lockTxn,
  activeChain,
}) => {
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
      <button onClick={handleClaim} disabled={loading}>
        <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/ClaimRewards.png" />
      </button>
    </NumberTooltip>
  );
};

function convertToNumberOfMonthsAndDays(seconds: number) {
  // conver the given seconds in to number of months and days
  const months = Math.floor(seconds / 2629746);
  const days = Math.floor((seconds % 2629746) / 86400);
  return { months, days };
}

const RenewLock: React.FC<{
  lockTxn: lockTxn;
  activeChain: Chain;
  decimals: number;
  unit: string;
}> = ({ lockTxn, activeChain, decimals, unit }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <RenewLockModal
        activeChain={activeChain}
        lockTxn={lockTxn}
        decimals={decimals}
        unit={unit}
        closeModal={setIsOpen}
        isOpen={isOpen}
        isExtendModal={false}
        lockPeriod={convertToNumberOfMonthsAndDays(
          parseInt(lockTxn.lockPeriod)
        )}
        setLockPeriod={() => {}}
      />
      <NumberTooltip content={'Renew'}>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Renew.png" />
        </button>
      </NumberTooltip>
    </>
  );
};

const ExtendLock: React.FC<{
  activeChain: Chain;
  lockTxn: lockTxn;
  decimals: number;
  unit: string;
}> = ({ activeChain, lockTxn, decimals, unit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lockPeriod, setLockPeriod] = useState(
    convertToNumberOfMonthsAndDays(parseInt(lockTxn.lockPeriod))
  );
  return (
    <>
      <RenewLockModal
        activeChain={activeChain}
        lockTxn={lockTxn}
        decimals={decimals}
        unit={unit}
        closeModal={setIsOpen}
        isOpen={isOpen}
        isExtendModal={true}
        lockPeriod={lockPeriod}
        setLockPeriod={setLockPeriod}
      />
      <NumberTooltip content={'Extend'}>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Lock.png" />
        </button>
      </NumberTooltip>
    </>
  );
};
