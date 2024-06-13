import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { getDHMSFromSeconds } from '@Utils/Dates/displayDateTime';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import { APR } from './Apr';
import { ClaimRewards } from './ClaimAction';
import { ErrorComponent } from './ErrorComponent';
import { ExtendLock } from './ExtendLockAction';
import { MobileTransactions } from './MobileTransactions';
import { RenewLock } from './RenewLockAction';
import { Withdraw } from './WithdrawAction';

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
          unit={'uBLP'}
          precision={2}
          className="!justify-start text-f15"
        />
      );
    case transactionCols.APR:
      return (
        <APR activeChain={activeChain} lockTxn={txn} activePool={activePool} />
      );
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
            <Withdraw activeChain={activeChain} lockTxn={txn} />
          )}
          {/* <RenewLock
            lockTxn={txn}
            activeChain={activeChain}
            decimals={decimals}
            unit={unit}
            activePool={activePool}
          />
          <ExtendLock
            lockTxn={txn}
            activeChain={activeChain}
            decimals={decimals}
            unit={unit}
            activePool={activePool}
          /> */}
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
  totalTxns: string;
}> = ({ activePool, activeChain, data, error, pendingRewards, totalTxns }) => {
  const [activePage, setActivePage] = useState(1);

  const currentPageTxns = data?.slice((activePage - 1) * 10, activePage * 10);

  return (
    <>
      <BufferTable
        headerJSX={Header}
        bodyJSX={(row, col) =>
          currentPageTxns === undefined ||
          currentPageTxns.length === 0 ||
          error !== undefined ? (
            <ErrorComponent
              isDataAvailable={currentPageTxns !== undefined}
              isError={error !== undefined}
            />
          ) : (
            Body(
              row,
              col,
              activePool,
              currentPageTxns,
              activeChain,
              pendingRewards
            )
          )
        }
        cols={colNames.length}
        rows={currentPageTxns?.length ?? 0}
        onRowClick={() => {}}
        className="mt-6"
        widths={['14%', '10%', '9%', '13%', '14%', '13%', '15%', '7%']}
        loading={currentPageTxns === undefined && !error}
        error={
          <ErrorComponent
            isDataAvailable={currentPageTxns !== undefined}
            isError={error !== undefined}
          />
        }
        activePage={activePage}
        count={
          parseInt(totalTxns) % 10 === 0
            ? Math.floor(parseInt(totalTxns) / 10)
            : Math.floor(parseInt(totalTxns) / 10) + 1
        }
        onPageChange={(_, page) => setActivePage(page)}
      />
      <MobileTransactions
        activePool={activePool}
        activeChain={activeChain}
        data={currentPageTxns}
        error={error}
        pendingRewards={pendingRewards}
        activePage={activePage}
        count={
          parseInt(totalTxns) % 10 === 0
            ? Math.floor(parseInt(totalTxns) / 10)
            : Math.floor(parseInt(totalTxns) / 10) + 1
        }
        setActivePage={setActivePage}
      />
    </>
  );
};
