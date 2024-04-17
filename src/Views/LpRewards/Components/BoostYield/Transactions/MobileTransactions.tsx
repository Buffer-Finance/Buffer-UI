import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { getDHMSFromSeconds } from '@Utils/Dates/displayDateTime';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { Chain } from 'viem';
import { APR } from './Apr';
import { ClaimRewards } from './ClaimAction';
import { ErrorComponent } from './ErrorComponent';
import { LockTimeElapsed } from './LockTimeElapsed';
import { Withdraw } from './WithdrawAction';

enum transactionCols {
  amount,
  lockPeriod,
  Actions,
}

const colNames = ['Amount', 'Lock Period', 'Actions'];
const Header = (col: number) => {
  return (
    <TableHeader
      col={col}
      headsArr={colNames}
      firstColClassName="ml-7"
      className="text-f13"
    />
  );
};

function Body(
  row: number,
  col: number,
  activePool: poolsType,
  txns: lockTxn[],
  activeChain: Chain
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
  switch (col) {
    case transactionCols.amount:
      return (
        <Display
          data={divide(txn.amount, decimals) as string}
          unit={unit}
          precision={2}
          className="!justify-start text-f13"
        />
      );

    case transactionCols.lockPeriod:
      return (
        <span className="text-f13">
          {getDHMSFromSeconds(parseInt(txn.lockPeriod))}
        </span>
      );

    case transactionCols.Actions:
      return (
        <div className="flex gap-3 items-center">
          {distanceObject.distance < 0 && (
            <Withdraw
              activeChain={activeChain}
              lockTxn={txn}
              className="scale-[80%]"
            />
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
          <ClaimRewards
            lockTxn={txn}
            activeChain={activeChain}
            className="scale-[80%]"
          />

          <button
            className="scale"
            onClick={() => {
              window.open(
                `${activeChain.blockExplorers?.default.url}/tx/${txn.txnHash}`
              );
            }}
          >
            <Launch className="text-[#808191]" />
          </button>
        </div>
      );

    default:
      return 'unhandled column';
  }
}

function Accordian(
  row: number,
  txns: lockTxn[] | undefined,
  activeChain: Chain,
  activePool: poolsType,
  pendingRewards: { [key: string]: string } | undefined
) {
  if (txns === undefined) return <></>;
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

  return (
    <div className="px-3 py-2">
      <RowBetween>
        <span>Time To Unlock</span>
        <span>
          {distanceObject.distance >= 0 ? formatDistance(distanceObject) : '-'}
        </span>
      </RowBetween>
      <LockTimeElapsed trade={txn} />
      <RowBetween>
        <DisplayTime ts={txn.timestamp} className="text-f13" />
        <ColumnGap gap="3px">
          <div>APR</div>
          <APR
            activeChain={activeChain}
            lockTxn={txn}
            activePool={activePool}
          />
        </ColumnGap>
        <ColumnGap gap="3px">
          <div>Pending Rewards</div>
          <span className="text-f13">
            {rewards !== undefined ? (
              <span className="text-f13">
                <Display
                  data={divide(rewards, 18)}
                  unit="ARB"
                  precision={2}
                  className="!justify-start"
                />
              </span>
            ) : (
              <Skeleton className="w-[50px] !h-5 lc !transform-none " />
            )}
          </span>
        </ColumnGap>
      </RowBetween>
    </div>
  );
}

export const MobileTransactions: React.FC<{
  activePool: poolsType;
  activeChain: Chain;
  data: lockTxn[] | undefined;
  error: any;
  pendingRewards: { [key: string]: string } | undefined;
}> = ({ activePool, activeChain, data, error, pendingRewards }) => {
  return (
    <BufferTable
      widths={['35%', '35%', '30%']}
      className="a600:hidden mt-6"
      headerJSX={Header}
      bodyJSX={(row, col) =>
        data === undefined || data.length === 0 || error !== undefined ? (
          <ErrorComponent
            isDataAvailable={data !== undefined}
            isError={error !== undefined}
          />
        ) : (
          Body(row, col, activePool, data, activeChain)
        )
      }
      cols={colNames.length}
      rows={data?.length ?? 0}
      onRowClick={() => {}}
      loading={data === undefined && !error}
      shouldShowMobile={true}
      error={
        <ErrorComponent
          isDataAvailable={data !== undefined}
          isError={error !== undefined}
        />
      }
      accordianJSX={(row) =>
        Accordian(row, data, activeChain, activePool, pendingRewards)
      }
      shouldHideHeader
    />
  );
};
