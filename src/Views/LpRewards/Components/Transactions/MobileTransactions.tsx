import { divide } from '@Utils/NumString/stringArithmatics';
import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { usePoolTxns } from '@Views/LpRewards/Hooks/usePoolTxns';
import { poolTxn, poolsType, transactionTabType } from '@Views/LpRewards/types';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';
import { useState } from 'react';
import { Chain } from 'viem';
import { ErrorComponent } from './ErrorComponent';
import { PoolTimeElapsed } from './PoolTimeElapsed';
import { Tabs } from './Tabs';

export const MobileTransactions: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
}> = ({ activeChain, activePool }) => {
  const [activeTab, setActiveTab] = useState<transactionTabType>('all');

  return (
    <div className="w-full a600:hidden">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Tables
        activeTab={activeTab}
        activePool={activePool}
        activeChain={activeChain}
      />
    </div>
  );
};

enum transactionCols {
  address,
  amount,
  txnHash,
}

const colNames = ['Wallet Address', 'Amount', 'Tx Status'];

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
        <span className="text-f13">
          {txn.userAddress.slice(0, 7) + '...' + txn.userAddress.slice(-7)}
        </span>
      );
    case transactionCols.amount:
      return (
        <Display
          data={divide(txn.amount, decimals)}
          unit={poolUnit}
          precision={2}
          className="!justify-start text-f13"
        />
      );
    case transactionCols.txnHash:
      return (
        <button
          className="text-f13"
          onClick={() => {
            window.open(
              `${activeChain.blockExplorers?.default.url}/tx/${txn.txnHash}`
            );
          }}
        >
          <span className="text-[#808191] text-f13 font-medium">View</span>
          <Launch className="text-[#808191] ml-2" />
        </button>
      );

    default:
      return <div>'unhandled column'</div>;
  }
}

function Accordian(
  row: number,
  data: poolTxn[] | undefined,
  activePool: poolsType,
  activeChain: Chain
) {
  if (data === undefined) return <></>;
  const txn = data[row];
  const decimals = activePool === 'uBLP' ? 6 : 18;
  const poolUnit = activePool === 'uBLP' ? 'USDC' : 'ARB';
  return (
    <div className="px-3 py-2">
      <RowBetween>
        <span>{txn.type}</span>
        <span>Lock Period</span>
      </RowBetween>
      <PoolTimeElapsed trade={txn} />
      <RowBetween>
        <DisplayTime ts={txn.timestamp} className="text-f13" />
        <ColumnGap gap="3px">
          <div>BLP Rate</div>
          <Display
            data={divide(txn.blpRate, 8)}
            precision={3}
            className="!justify-center text-f13"
          />
        </ColumnGap>
        <ColumnGap gap="3px">
          <div>Units Minted</div>
          <Display
            data={divide(txn.unitsMinted, decimals)}
            precision={2}
            className="!justify-end text-f13"
          />
        </ColumnGap>
      </RowBetween>
    </div>
  );
}

const Tables: React.FC<{
  activeTab: transactionTabType;
  activePool: poolsType;
  activeChain: Chain;
}> = ({ activeChain, activePool, activeTab }) => {
  const [activePage, setActivePage] = useState(1);
  const { data, isValidating, error } = usePoolTxns(
    activeChain,
    activePool,
    activeTab,
    activePage
  );

  return (
    <BufferTable
      className="mt-5"
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
      loading={data === undefined && !error && isValidating}
      error={
        <ErrorComponent
          activeTab={activeTab}
          isDataAvailable={data !== undefined}
          isError={error !== undefined}
        />
      }
      shouldShowMobile
      shouldHideHeader
      doubleHeight
      accordianJSX={(row) =>
        Accordian(row, data?.blpTxns, activePool, activeChain)
      }
      activePage={activePage}
      count={
        activeTab === 'all'
          ? data?.totalTxns[0]?.totalTxns
            ? Math.floor(parseInt(data.totalTxns[0].totalTxns) / 10) + 1
            : undefined
          : undefined
      }
      onPageChange={(_, page) => setActivePage(page)}
    />
  );
};
