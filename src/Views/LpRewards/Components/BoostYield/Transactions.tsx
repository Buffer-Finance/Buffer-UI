import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getDHMSFromSeconds } from '@Utils/Dates/displayDateTime';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Variables } from '@Utils/Time';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { useLockTxns } from '@Views/LpRewards/Hooks/useLockTxns';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import styled from '@emotion/styled';
import { Launch } from '@mui/icons-material';
import { Chain } from 'viem';

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
  activeChain: Chain
) {
  const txn = txns[row];
  const unit = activePool === 'aBLP' ? 'ARB' : 'USDC';
  const decimals = activePool === 'aBLP' ? 18 : 6;
  const distanceObject = Variables(
    parseInt(txn.timestamp) +
      parseInt(txn.lockPeriod) -
      Math.floor(Date.now() / 1000)
  );
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
      return <span className="text-f15">Nah</span>;
    case transactionCols.Actions:
      return (
        <div className="flex gap-6 items-center">
          <NumberTooltip content={'Unlock'}>
            <button onClick={() => {}}>
              <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Unlock.png" />
            </button>
          </NumberTooltip>
          <NumberTooltip content={'Renew'}>
            <button onClick={() => {}}>
              <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Renew.png" />
            </button>
          </NumberTooltip>
          <NumberTooltip content={'Lock'}>
            <button onClick={() => {}}>
              <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Lock.png" />
            </button>
          </NumberTooltip>
          <NumberTooltip content={'Harvest'}>
            <button onClick={() => {}}>
              <img src="https://res.cloudinary.com/dtuuhbeqt/image/upload/v1710914581/Rewards/Harvest.png" />
            </button>
          </NumberTooltip>
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
}> = ({ activePool, activeChain }) => {
  const { data, error } = useLockTxns(activeChain, activePool);
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
          Body(row, col, activePool, data, activeChain)
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
