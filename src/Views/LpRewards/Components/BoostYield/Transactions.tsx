import BufferTable from '@Views/Common/BufferTable';
import { TableHeader } from '@Views/Common/TableHead';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { poolsType } from '@Views/LpRewards/types';
import { DisplayTime } from '@Views/TradePage/Views/AccordionTable/Common';
import { Launch } from '@mui/icons-material';

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

function Body(row: number, col: number, data: any, activePool: poolsType) {
  switch (col) {
    case transactionCols.timestamp:
      return <DisplayTime ts={1711601516} className="text-f15 ml-8" />;
    case transactionCols.amount:
      return (
        <Display
          data={0.0}
          unit={activePool}
          precision={2}
          className="!justify-start text-f15"
        />
      );
    case transactionCols.APR:
      return <span className="text-f15">100%</span>;
    case transactionCols.remainingTime:
      return <span className="text-f15">1 Year</span>;
    case transactionCols.pendingRewards:
      return <span className="text-f15">1000</span>;
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
      return <span className="text-f15">1 Year</span>;

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

export const Transactions: React.FC<{
  activePool: poolsType;
}> = ({ activePool }) => {
  return (
    <BufferTable
      headerJSX={Header}
      bodyJSX={(row, col) => Body(row, col, [], activePool)}
      cols={colNames.length}
      rows={1}
      onRowClick={() => {}}
      className="mt-6"
      widths={['14%', '10%', '9%', '13%', '14%', '13%', '15%', '7%']}
    />
  );
};
