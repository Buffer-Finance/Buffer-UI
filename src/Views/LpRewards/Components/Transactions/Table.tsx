import { divide } from '@Utils/NumString/stringArithmatics';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolTxns } from '@Views/LpRewards/Hooks/usePoolTxns';
import { poolTxn, poolsType, transactionTabType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import styled from '@emotion/styled';
import { Launch } from '@mui/icons-material';
import { Chain } from 'wagmi';

enum transactionCols {
  address,
  timestamp,
  amount,
  // lockPeriod,
  txnType,
  blpRate,
  unitsMinted,
  txnHash,
}

const colNames = [
  'Wallet Address',
  'Date | Time',
  'Amount',
  // 'Lock Period',
  'Type',
  'BLP Rate',
  'Units Minted/Burned',
  'Tx Status',
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
  data: poolTxn[],
  activePool: poolsType,
  activeChain: Chain
) {
  const txn = data[row];
  const decimals = activePool === 'uBLP' ? 6 : 18;
  const poolUnit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  switch (col) {
    case transactionCols.address:
      return (
        <span className="ml-8 text-f15">
          {txn.userAddress.slice(0, 7) + '...' + txn.userAddress.slice(-7)}
        </span>
      );
    case transactionCols.timestamp:
      return <DisplayTime ts={txn.timestamp} className="text-f15" />;
    case transactionCols.amount:
      return (
        <Display
          data={divide(txn.amount, decimals)}
          unit={poolUnit}
          precision={2}
          className="!justify-start text-f15"
        />
      );
    // case transactionCols.lockPeriod:
    //   return <span className="text-f15">{txn.lockPeriod}</span>;
    case transactionCols.txnType:
      return <span className="text-f15">{txn.type}</span>;
    case transactionCols.blpRate:
      return (
        <Display
          data={divide(txn.blpRate, 8)}
          precision={3}
          className="!justify-start text-f15"
        />
      );
    case transactionCols.unitsMinted:
      return (
        <Display
          data={divide(txn.unitsMinted, decimals)}
          precision={2}
          className="!justify-start text-f15"
        />
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
      return <div>'unhandled column'</div>;
  }
}

export const Table: React.FC<{
  activeTab: transactionTabType;
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activeTab, activePool, activeChain }) => {
  const { data, isValidating, error } = usePoolTxns(
    activeChain,
    activePool,
    activeTab
  );
  return (
    <BufferTable
      headerJSX={Header}
      bodyJSX={(row, col) =>
        data === undefined || data.length === 0 ? (
          <ErrorComponent
            activeTab={activeTab}
            isDataAvailable={data !== undefined}
            isError={error !== undefined}
          />
        ) : (
          Body(row, col, data, activePool, activeChain)
        )
      }
      cols={colNames.length}
      rows={data?.length ?? 0}
      onRowClick={() => {}}
      className="mt-6"
      widths={['17%', '12%', '12%', '12%', '12%', '10%', '10%', '10%']}
      loading={data === undefined && !error && isValidating}
      error={
        <ErrorComponent
          activeTab={activeTab}
          isDataAvailable={data !== undefined}
          isError={error !== undefined}
        />
      }
    />
  );
};

const ErrorComponent: React.FC<{
  activeTab: transactionTabType;
  isDataAvailable: boolean;
  isError: boolean;
}> = ({ activeTab, isDataAvailable, isError }) => {
  if (isError) {
    return <ErrorDiv>Something went wring.Try again later.</ErrorDiv>;
  }
  if (isDataAvailable) {
    if (activeTab === 'my') {
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
