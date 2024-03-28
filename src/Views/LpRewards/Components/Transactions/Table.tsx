import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { poolsType, transactionTabType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';

enum transactionCols {
  address,
  timestamp,
  amount,
  lockPeriod,
  txnType,
  blpRate,
  unitsMinted,
  txnHash,
}

const colNames = [
  'Wallet Address',
  'Date | Time',
  'Amount',
  'Lock Period',
  'Type',
  'BLP Rate',
  'Units Minted',
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

function Body(row: number, col: number, data: any, activePool: poolsType) {
  switch (col) {
    case transactionCols.address:
      return (
        <span className="ml-8 text-f15">
          {'0x32A49a15F8eE598C1EeDc21138DEb23b391f425b'.slice(0, 7) +
            '...' +
            '0x32A49a15F8eE598C1EeDc21138DEb23b391f425b'.slice(-7)}
        </span>
      );
    case transactionCols.timestamp:
      return <DisplayTime ts={1711601516} className="text-f15" />;
    case transactionCols.amount:
      return (
        <Display
          data={0.0}
          unit={activePool}
          precision={2}
          className="!justify-start text-f15"
        />
      );
    case transactionCols.lockPeriod:
      return <span className="text-f15">1 Year</span>;
    case transactionCols.txnType:
      return <span className="text-f15">Deposit</span>;
    case transactionCols.blpRate:
      return (
        <Display
          data={1.23445}
          precision={3}
          className="!justify-start text-f15"
        />
      );
    case transactionCols.unitsMinted:
      return (
        <Display
          data={1.23445}
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
              'https://arbiscan.io/tx/0xd80a612ebabb55b1f0d16c57c311e0faddcceb683d92988c3e6de094362e08b2'
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

export const Table: React.FC<{
  activeTab: transactionTabType;
  activePool: poolsType;
}> = ({ activeTab, activePool }) => {
  return (
    <BufferTable
      headerJSX={Header}
      bodyJSX={(row, col) => Body(row, col, [], activePool)}
      cols={colNames.length}
      rows={1}
      onRowClick={() => {}}
      className="mt-6"
      widths={['17%', '12%', '12%', '12%', '12%', '10%', '10%', '10%']}
    />
  );
};
