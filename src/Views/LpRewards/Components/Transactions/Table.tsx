import { divide } from '@Utils/NumString/stringArithmatics';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolTxns } from '@Views/LpRewards/Hooks/usePoolTxns';
import { poolTxn, poolsType, transactionTabType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Chain } from 'wagmi';
import { ErrorComponent } from './ErrorComponent';

enum transactionCols {
  address,
  timestamp,
  amount,
  // lockPeriod,
  blpRate,
  unitsMinted,
  txnHash,
}

const colNames = [
  'Wallet Address',
  'Date | Time',
  'Amount',
  // 'Lock Period',
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
          unit={'uBLP'}
          label={txn.type == 'Provide' ? '+' : '-'}
          precision={2}
          className="!justify-start text-f15"
        />
      );
    // case transactionCols.lockPeriod:
    //   return <span className="text-f15">{txn.lockPeriod}</span>;
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
  const [activePage, setActivePage] = useState(1);
  const { data, isValidating, error } = usePoolTxns(
    activeChain,
    activePool,
    activeTab,
    activePage
  );

  useEffect(() => {
    setActivePage(1);
  }, [activeTab]);

  return (
    <BufferTable
      headerJSX={Header}
      bodyJSX={(row, col) =>
        data === undefined || data.blpTxns.length === 0 ? (
          <ErrorComponent
            activeTab={activeTab}
            isDataAvailable={data !== undefined}
            isError={error !== undefined}
          />
        ) : (
          Body(row, col, data.blpTxns, activePool, activeChain)
        )
      }
      cols={colNames.length}
      rows={data?.blpTxns.length ?? 0}
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
      activePage={activePage}
      count={
        data?.totalTxns[0]?.totalTxns
          ? parseInt(data.totalTxns[0].totalTxns) % 10 === 0
            ? Math.floor(parseInt(data.totalTxns[0].totalTxns) / 10)
            : Math.floor(parseInt(data.totalTxns[0].totalTxns) / 10) + 1
          : undefined
      }
      onPageChange={(_, page) => setActivePage(page)}
    />
  );
};
